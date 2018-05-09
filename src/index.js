import App from './components/App.vue'
import iView from 'iview'

import 'iview/dist/styles/iview.css'

// import config from './config'
import router from './router'
import store from './store'

import mixins from './mixins'
import mixinsAuth from './mixins/auth'

// console.log(config)

export default {
  install (Vue, options = {}) {
    Vue.use(iView)

    Vue.mixin(mixins)
    Vue.mixin(mixinsAuth)

    const AppConstructor = Vue.extend(App)

    window.app = new AppConstructor({
      el: '#app',
      router,
      store,
      // store,
      // render: h => h(App),
      // data: {
      //   currentPageName: ''
      // },
      mounted () {
        const vm = this
        vm.config.hook_root_mounted.apply(vm)
      }
      // created () {
      //   let tagsList = []
      //   appRouter.map(item => {
      //     if (item.children.length <= 1) {
      //       tagsList.push(item.children[0])
      //     } else {
      //       tagsList.push(...item.children)
      //     }
      //   })
      //   this.$store.commit('setTagsList', tagsList)
      // }
    })
  }
}
