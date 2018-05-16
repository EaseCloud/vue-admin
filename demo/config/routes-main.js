import Home from '../pages/Home.vue'
import HelloWorld from '../pages/HelloWorld.vue'
import UserList from '../pages/UserList.vue'

/* TODO: 要补充 meta 的文档 */
export default [{
  path: 'home',
  name: 'main_home',
  component: Home,
  meta: {
    title: '首页',
    locked: true
  }
}, {
  path: 'hello',
  name: 'main_hello',
  component: HelloWorld,
  meta: {
    title: '你好世界'
  }
}, {
  path: 'home_clone',
  name: 'main_home_clone',
  component: Home,
  meta: {
    title: '克隆首页'
  }
}, {
  path: 'list_view',
  name: 'main_user_list',
  component: UserList,
  meta: {
    title: '用户列表'
  }
}]
