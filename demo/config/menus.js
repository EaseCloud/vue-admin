export default [{
  name: 'menu_home',
  icon: 'ios-home',
  title: '首页',
  route: { name: 'main_home' },
  noCache: true,
  // children: []
  children: [{
    name: 'menu_hello',
    icon: 'ios-mic',
    title: '你好世界',
    route: { name: 'main_hello' }
  }]
}, {
  name: 'menu_home_clone',
  icon: 'ios-cloudy-night',
  title: '克隆首页',
  route: { name: 'main_home_clone' }
}, {
  name: 'menu_list_view',
  icon: 'person',
  title: '用户列表',
  route: { name: 'main_user_list' }
}]
