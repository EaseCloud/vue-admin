import _ from 'lodash'

import config from '../config'
import utils from '../utils'
import components from '../components'

const mixin = {
  components,
  computed: {
    _: () => _,
    lodash: () => _,
    config: () => config,
    utils: () => utils
  },
  methods: {},
  mounted () {
    const vm = this
    if (vm.reload instanceof Function) vm.reload()
  }
}

/**
 * 将所有的 utils.general 的方法直接 mixin 到 Vue 全局
 * 同时将 this 绑定到调用的 vm 实例
 */
_.forEach(utils.general, (func, method) => {
  mixin.methods[method] = function () {
    const vm = this
    return func.apply(vm, arguments)
  }
})

export default mixin
