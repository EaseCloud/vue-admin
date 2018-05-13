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
const httpMethods = [...httpMethodsSafe, ...httpMethodsUnsafe]

// 缓存的 Resource 对象
const cachedResources = {}

/**
 * 从 vue-resource 迁移，当 Resource 方法调用 http 方法的时候，传入参数的归一化
 * 调用的 http 方法
 * @param method
 * @param args 传入的参数数组，即 api(model).get(...args) 或者 api(model).post(...args) 的参数数组
 * @returns {{method: string, params: {}, body: {}, query: {}}}
 */
function parseArgs (method, args) {
  if (httpMethods.indexOf(method.toLowerCase()) === -1) {
    throw new Error('不支持的 http 方法：' + method)
  }
  const isSafe = httpMethodsSafe.indexOf(method.toLowerCase()) > -1
  const options = { method, params: {}, query: {} }
  switch (args.length) {
    case 3:
      if (isSafe) {
        throw new Error('最多2个参数 [params, query], 但是传入了' + args.length + '个')
      } else {
        options.params = args[0]
        options.body = args[1]
        options.query = args[2]
      }
      break
    case 2:
      if (isSafe) {
        options.params = args[0]
        options.query = args[1]
      } else {
        options.params = args[0]
        options.body = args[1]
      }
      break
    case 1:
      if (isSafe) {
        options.query = args[0]
      } else {
        options.body = args[0]
      }
      break
    case 0:
      break
    default:
      throw new Error('最多3个参数 [params, body, query], 但是传入了' + args.length + '个')
  }
  return options
}

class RestResource {
  constructor (model,
               root = config.api_root || '',
               format = config.api_format || '{/id}{/action}/') {
    const _this = this
    // 动态生成实例，使得动态配置 config.axios_options 修改可以动态生效
    this.axios = axios.create(config.axios_options)
    this.model = model
    this.root = root
    this.urlTemplate = template.parse(format)
    httpMethods.forEach(method => {
      this[method] = function () {
        // console.log(method, arguments)
        return _this.request(method.toUpperCase(), ...arguments)
      }
    })
  }

  request (method = 'GET') {
    const { params, body, query } = parseArgs(method, [...arguments].slice(1))
    // TODO: filter body Content-Type
    return this.axios.request({
      method,
      url: urljoin(this.root, this.model, this.urlTemplate.expand(params)),
      params: query,
      data: body
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
          const _model = model || this.model
          if (!cachedResources[_model]) cachedResources[_model] = new RestResource(_model)
          return cachedResources[_model]
        }
      }
    })
  }
}
