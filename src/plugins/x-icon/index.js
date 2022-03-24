import XIcon from './XIcon.vue'

import '@fortawesome/fontawesome-free/css/all.min.css'
import '@fortawesome/fontawesome-free/css/v4-shims.min.css'

export default {
  install (Vue) {
    Vue.mixin({
      components: { XIcon }
    })
  }
}
