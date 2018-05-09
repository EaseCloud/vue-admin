export default [{
  path: '/passport/login',
  name: 'passport_login',
  meta: {
    title: 'Login - 登录'
  },
  component: () => import('../views/passport/Login.vue')
// }, {
//   path: '/locking',
//   name: 'locking',
//   component: () => import('@/views/main-components/lockscreen/components/locking-page.vue')
}]
