export default [{
  name: 'menu_home',
  icon: 'key',
  title: '* 首页',
  route: { name: 'main_home' },
  noCache: true,
  // children: []
  children: [{
    name: 'menu_hello',
    icon: 'key',
    title: '* 你好世界',
    route: { name: 'main_hello' }
  }]
}, {
  name: 'menu_home_clone',
  icon: 'key',
  title: '* 克隆首页',
  route: { name: 'main_home_clone' }
}]
