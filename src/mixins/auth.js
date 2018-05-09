import config from '../config'
// import utils from '../utils'

export default {
  computed: {
    me () {
      const vm = this
      return vm.$store.state.auth.current_user
    }
  },
  methods: {
    login (username, password) {
      const vm = this
      return config.hooks.action_login.apply(
        vm, [username, password]
      ).then(user => {
        vm.$store.commit('setCurrentUser', user)
        config.hooks.action_after_login.apply(vm)
      })
    },
    authenticate (reload = false) {
      const vm = this
      if (!reload && vm.me) return Promise.resolve(vm.me)
      return new Promise((resolve, reject) => {
        config.hooks.action_authenticate().then(user => {
          vm.$store.commit('setCurrentUser', user)
          resolve(vm.me)
        }, () => {
          // 如果后台验证失败，还要顺道清空本地的 Vuex 状态
          vm.$store.commit('setCurrentUser', null)
          reject(new Error('尚未登录'))
        })
      })
    },
    logout () {
      const vm = this
      config.hooks.action_logout().then(() => {
        vm.$store.commit('setCurrentUser', null)
      })
    },
    requireLogin (reload = false, redirectTo = null) {
      const vm = this
      return vm.authenticate(reload).catch(() => {
        vm.config.hooks.action_goto_login.apply(vm, [redirectTo])
      })
    }
  }
}
