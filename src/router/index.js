import Vue from 'vue'
import iView from 'iview'
import VueRouter from 'vue-router'
// import Cookies from 'js-cookie'

import config from '../config'
import utils from '../utils'

import routes from './routes'

import MainApp from '../views/main/App.vue'

Vue.use(VueRouter)

const router = new VueRouter({
  ...config.router_options,
  routes: [
    {
      path: '',
      component: MainApp,
      redirect: config.home_route,
      children: [
        // 这条记录使得打开根目录的时候能够重定向到首页
        // { path: '',  },
        ...config.main_routes
      ]
    },
    ...routes,
    ...config.extra_routes
  ]
})

// router.beforeEach((to, from, next) => {
//   iView.LoadingBar.start()
//   // TODO:
//   next()
// })
//
// router.beforeEach((to) => {
//   iView.LoadingBar.finish()
//   window.scrollTo(0, 0)
//   // TODO:
// })

router.beforeEach((to, from, next) => {
  iView.LoadingBar.start()
  utils.html.setHtmlTitle(utils.html.i18nText(to.meta.title))
  next()
  // TODO: 锁屏设定、TAB 页面弹出
  // if (Cookies.get('locking') === '1' && to.name !== 'locking') { // 判断当前是否是锁定状态
  //   next({ replace: true, name: 'locking' });
  // } else if (Cookies.get('locking') === '0' && to.name === 'locking') {
  //   next(false);
  // } else {
  //   if (!Cookies.get('user') && to.name !== 'login') { // 判断是否已经登录且前往的页面不是登录页
  //     next({
  //       name: 'login'
  //     });
  //   } else if (Cookies.get('user') && to.name === 'login') { // 判断是否已经登录且前往的是登录页
  //     // 设为默认标题
  //     utils.html.setTitle()
  //     next({
  //       name: 'home_index'
  //     });
  //   } else {
  //     const curRouterObj = Util.getRouterObjByName([otherRouter, ...appRouter], to.name);
  //     if (curRouterObj && curRouterObj.access !== undefined) { // 需要判断权限的路由
  //       if (curRouterObj.access === parseInt(Cookies.get('access'))) {
  //         Util.toDefaultPage([otherRouter, ...appRouter], to.name, router, next); // 如果在地址栏输入的是一级菜单则默认打开其第一个二级菜单的页面
  //       } else {
  //         next({
  //           replace: true,
  //           name: 'error-403'
  //         });
  //       }
  //     } else { // 没有配置权限的路由, 直接通过
  //       Util.toDefaultPage([...routers], to.name, router, next);
  //     }
  //   }
  // }
})

router.afterEach((to) => {
  // console.log('Caught outer $route hook', to)
  iView.LoadingBar.finish()
  window.scrollTo(0, 0)
})

export default router
