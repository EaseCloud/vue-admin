import hooks from './hooks'

export default {
  // Basic
  name: 'Vue Admin Project',
  version: '1.0',
  description: 'You can specify your description text here.',
  // API
  api_root: '/api',
  /**
   * 路径格式模板
   * https://github.com/bramstein/url-template
   * http://tools.ietf.org/html/rfc6570
   */
  api_format: '{/id}{/action}/',
  axios_options: {
    // baseURL: config.api_root,
    timeout: 10000,
    withCredentials: true
    // headers: {'X-Custom-Header': 'foobar'}
  },
  // Router
  router_options: {},
  main_routes: [],
  extra_routes: [],
  login_route: { name: 'passport_login' },
  home_route: { name: 'main_home' },
  // App Frame
  menus: [],
  pages: {},
  // Hooks
  // TODO: Hooks 太杂乱，应该将源码文件拆开，将文档分节
  hooks
}
