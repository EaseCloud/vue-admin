import hooks from './hooks'

export default {
  name: 'Vue Admin Project',
  version: '1.0',
  description: 'You can specify your description text here.',
  router_options: {},
  extra_routes: [],
  login_route: 'login',
  ...hooks
}
