import config from '../config'
// import utils from '../utils'

export default {
  computed: {
    me () {
      const vm = this
      return vm.$store.state.auth.currentUser
    },
    currentUserName () {
      const vm = this
      return vm.config.hooks.func_get_current_user_name.apply(vm)
    },
    currentUserAvatarUrl () {
      const vm = this
      return vm.config.hooks.func_get_current_user_avatar_url.apply(vm)
    }
  },
  methods: {
    async login (username, password) {
      const vm = this
      const user = await config.hooks.action_login.apply(vm, [username, password])
      vm.$store.commit('setCurrentUser', user)
      await config.hooks.action_after_login.apply(vm)
    },
    async authenticate (reload = false) {
      const vm = this
      if (!reload && vm.me) return vm.me
      const user = await config.hooks.action_authenticate.apply(vm)
      vm.$store.commit('setCurrentUser', user)
      return user
    },
    async logout () {
      const vm = this
      await config.hooks.action_logout.apply(vm)
      vm.$store.commit('setCurrentUser', null)
    },
    async requireLogin (reload = false, redirectTo = null) {
      const vm = this
      return vm.authenticate(reload).catch(() => {
        vm.config.hooks.action_goto_login.apply(vm, [redirectTo])
      })
    }
  }
}
