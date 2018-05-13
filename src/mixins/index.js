import _ from 'lodash'

import config from '../config'
import utils from '../utils'
import components from '../components'

export default {
  components,
  computed: {
    _: () => _,
    lodash: () => _,
    config: () => config,
    utils: () => utils
  },
  methods: {
    finalize () {
      const vm = this
      return vm.utils.general.finalize(...arguments)
    }
  },
  mounted () {
    const vm = this
    if (vm.reload instanceof Function) vm.reload()
  }
}
