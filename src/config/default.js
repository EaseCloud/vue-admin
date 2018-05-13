import hooks from './hooks'

export default {
  // Basic
  name: 'Vue Admin Project',
  version: '1.0',
  description: 'You can specify your description text here.',
  // API
  // TODO: API 配置未写文档
  api_root: '/api',
  api_format: '{/id}{/action}/',
  axios_options: {
    // baseURL: config.api_root,
    timeout: 10000,
    withCredentials: true
    // headers: {'X-Custom-Header': 'foobar'}
  },
  // TODO: 尚未实现，可以考虑改成 hook 实现
  api_payload_format: 'json', // json | form-data | urlencoded
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
  hooks
}
