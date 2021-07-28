/**
 * 支持 vue-resource 风格的 api 调用
 * 通过 vm.api('model') 可以获取到 vue-resource 方式获取到的 REST-resource 对象
 * 提供相同的接口
 */
import urljoin from 'url-join'
import template from 'url-template'
import axios from 'axios'
import config from '../../config'
import Loading from './Loading'
import Vue from 'vue'

let loadingCount = 0

// All http methods: https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods
const httpMethodsSafe = ['get', 'head', 'connect', 'options', 'trace']
const httpMethodsUnsafe = ['post', 'put', 'delete', 'patch']
const httpMethodsParseBody = {
  get: false,
  head: false,
  connect: false,
  options: false,
  trace: false,
  post: true,
  put: true,
  delete: false,
  patch: true
}
const httpMethods = [...httpMethodsSafe, ...httpMethodsUnsafe]

/**
 * 从 vue-resource 迁移，当 Resource 方法调用 http 方法的时候，传入参数的归一化
 * 调用的 http 方法
 * @param method @param args 传入的参数数组，即 api(model).get(...args) 或者 api(model).post(...args) 的参数数组
 * @returns {{method: *, params: {}, query: {}}}
 */
function parseArgs (method, args) {
  if (httpMethods.indexOf(method.toLowerCase()) === -1) {
    throw new Error('不支持的 http 方法：' + method)
  }
  const hasBody = httpMethodsParseBody[method.toLowerCase()]
  const options = {method, params: {}, query: {}}
  switch (args.length) {
    case 3:
      if (hasBody) {
        options.params = args[0]
        options.data = args[1]
        options.query = args[2]
      } else {
        throw new Error('最多2个参数 [params, query], 但是传入了' + args.length + '个')
      }
      break
    case 2:
      if (hasBody) {
        options.params = args[0]
        options.data = args[1]
      } else {
        options.params = args[0]
        options.query = args[1]
      }
      break
    case 1:
      if (hasBody) {
        options.data = args[0]
      } else {
        options.params = args[0]
      }
      break
    case 0:
      break
    default:
      throw new Error('最多3个参数 [params, data, query], 但是传入了' + args.length + '个')
  }
  return options
}

class RestResource {
  constructor (model,
    root = config.api_root || '',
    format = config.api_format || '{/id}{/action}/') {
    if (!model) {
      throw new Error('没有为 api 指定对应的 model')
    }
    const _this = this
    // 动态生成实例，使得动态配置 config.axios_options 修改可以动态生效
    this.vm = null
    this.axios = axios.create(config.axios_options)
    this.model = model
    this.root = root
    this.urlTemplate = template.parse(format)
    httpMethods.forEach(method => {
      this[method] = async function () {
        // console.log(method, arguments)
        return _this.request(method.toUpperCase(), ...arguments)
      }
    })
  }

  async request (method = 'GET', ...args) {
    let {params, data, query} = parseArgs(method, args)
    data = await config.hooks.filter_data_before_api_request.apply(this.vm, [data])
    loadingCount += 1
    // console.log('>>> loadingCount', loadingCount)
    if (loadingCount) showLoading()
    return api.request({
      method,
      url: urljoin(this.root, this.model, this.urlTemplate.expand(params)),
      params: query,
      data
    })
  }

  // 根据 ID 获取指定模型的对象
  async retrieve (id, pk = 'id') {
    const resp = await this.request('GET', {[pk]: id})
    return resp.data
  }

  // 根据 ID 获取指定模型的对象
  async list (filters) {
    const resp = await this.request('GET', {}, filters)
    return resp.data.results
  }

}

// Axios instance
let api = axios.create(config.axios_options)

function notifyResponseMessage (response) {
  if (!window.app) return
  const vm = window.app
  vm.loading_count = Math.max(0, vm.loading_count - 1)
  loadingCount = Math.max(0, loadingCount - 1)
  // console.log('<<< loadingCount', loadingCount)
  if (!loadingCount) hideLoading()
  if (!response) {
    vm.$Message.error('请求失败：服务器没有响应')
  } else if (response.data.msg) {
    if (response.data.silent) return
    if (loadingCount < vm.loading_count) return
    vm.$Message[response.data.ok ? 'success' : 'warning'](response.data.msg)
    vm.loading_count = null
  } else if (response.status >= 400) {
    vm.$Message.error(JSON.stringify(response.data))
  }
}

// 自动错误处理器
api.interceptors.response.use(response => {
  notifyResponseMessage(response)
  return response
}, error => {
  notifyResponseMessage(error.response)
  return Promise.reject(error)
})

// Added config hook for accessing interceptor or other behavior under api
if (config.axios_setup) {
  config.axios_setup(api)
}

function showLoading () {
  if (document.getElementById('api_loading')) return
  const el = document.createElement('div')
  el.id = 'api_loading'
  document.body.appendChild(el)
  const ModalComponent = Vue.extend(Loading)
  const div = document.createElement('div')
  el.appendChild(div)
  return new ModalComponent({el: div})
}

function hideLoading () {
  const el = document.getElementById('api_loading')
  if (el) {
    document.body.removeChild(el)
  }
}

export default {
  install (Vue, options = {}) {
    Vue.mixin({
      computed: {
        // 动态生成实例，使得动态配置 config.axios_options 修改可以动态生效
        // axios: () => axios.create(config.axios_options)
        axios: () => api
      },
      methods: {
        // 从性能角度来看，可以考虑将多次的构造缓存下来，支持重复使用
        api (model, root = config.api_root) {
          const vm = this
          const resource = new RestResource(model || vm.model, vm.api_root || root)
          // 保留 vm 的引用
          resource.vm = vm
          return resource
        }
      }
    })
  }
}
