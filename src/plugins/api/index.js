/**
 * 支持 vue-resource 风格的 api 调用
 * 通过 vm.api('model') 可以获取到 vue-resource 方式获取到的 REST-resource 对象
 * 提供相同的接口
 */
import urljoin from 'url-join'
import template from 'url-template'
import axios from 'axios'
import config from '../../config'

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
 * @param method
 * @param args 传入的参数数组，即 api(model).get(...args) 或者 api(model).post(...args) 的参数数组
 * @returns {{method: *, params: {}, query: {}}}
 */
function parseArgs (method, args) {
  if (httpMethods.indexOf(method.toLowerCase()) === -1) {
    throw new Error('不支持的 http 方法：' + method)
  }
  const hasBody = httpMethodsParseBody[method.toLowerCase()]
  const options = { method, params: {}, query: {} }
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
    let { params, data, query } = parseArgs(method, args)
    data = await config.hooks.filter_data_before_api_request.apply(this.vm, [data])
    return this.axios.request({
      method,
      url: urljoin(this.root, this.model, this.urlTemplate.expand(params)),
      params: query,
      data
    })
  }
}

export default {
  install (Vue, options = {}) {
    Vue.mixin({
      computed: {
        // 动态生成实例，使得动态配置 config.axios_options 修改可以动态生效
        axios: () => axios.create(config.axios_options)
      },
      methods: {
        // 从性能角度来看，可以考虑将多次的构造缓存下来，支持重复使用
        api (model) {
          const vm = this
          const resource = new RestResource(model || vm.model)
          // 保留 vm 的引用
          resource.vm = vm
          return resource
        }
      }
    })
  }
}
