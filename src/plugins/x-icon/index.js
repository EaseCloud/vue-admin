import XIcon from './XIcon.vue'

import '@fortawesome/fontawesome-free/js/all'

export default {
  install (Vue) {
    Vue.mixin({
      components: { XIcon }
    })
  }
}
