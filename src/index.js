import App from './views/App.vue'
import iView from 'iview'

import 'iview/dist/styles/iview.css'

import config from './config'
import router from './router'
import store from './store'

import mixins from './mixins'
import mixinsAuth from './mixins/auth'
import mixinsApp from './mixins/app'

import pluginImageViewer from './plugins/image-viewer'
import pluginApi from './plugins/api'
import pluginDataView from './plugins/data-view'
import pluginDialogs from './plugins/dialogs'

export default {
  install (Vue, options = {}) {
    Vue.use(iView)

    Vue.use(pluginImageViewer)
    Vue.use(pluginApi)
    Vue.use(pluginDataView)
    Vue.use(pluginDialogs)

    Vue.mixin(mixins)
    Vue.mixin(mixinsAuth)
    Vue.mixin(mixinsApp)

    // Custom mixins
    Vue.mixin(config.mixins)

    const AppConstructor = Vue.extend(App)

    window.app = new AppConstructor({
      el: '#app',
      router,
      store
      // store,
      // render: h => h(App),
      // data: {
      //   currentPageName: ''
      // },
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
