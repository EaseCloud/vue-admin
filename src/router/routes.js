export default [{
  path: '/passport/login',
  name: 'passport_login',
  meta: {
    title: 'Login - 登录'
  },
  component: () => import('../views/passport/Login.vue')
// }, {
// TODO: 锁屏功能未实现
//   path: '/locking',
//   name: 'locking',
//   component: () => import('@/views/main-components/lockscreen/components/locking-page.vue')
}]
