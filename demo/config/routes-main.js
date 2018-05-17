import Home from '../pages/Home.vue'
import UserList from '../pages/UserList.vue'
import UserEdit from '../pages/UserEdit.vue'

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
  path: 'user',
  name: 'main_user_list',
  component: UserList,
  meta: {
    title: '用户列表'
  }
}, {
  path: 'user/:id',
  name: 'main_user_edit',
  component: UserEdit,
  meta: {
    title (params) {
      if (!Number(params.id)) return '创建用户'
      return `用户[${params.id}]`
    }
  }
}]
