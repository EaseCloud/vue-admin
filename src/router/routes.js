export default [{
  path: '/login',
  name: 'login',
  meta: {
    title: 'Login - 登录'
  },
  component: () => import('../components/views/Login.vue')
// }, {
//   path: '/locking',
//   name: 'locking',
//   component: () => import('@/views/main-components/lockscreen/components/locking-page.vue')
}]
