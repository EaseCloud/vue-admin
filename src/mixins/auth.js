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
      return config.hook_login.apply(
        vm, [username, password]
      ).then(user => {
        vm.$store.commit('setCurrentUser', user)
        config.hook_after_login.apply(vm)
      })
    },
    authenticate (reload = true) {
    },
    logout () {
    }
  }
}
