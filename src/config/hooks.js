export default {
  /**
   * 根组件挂载之后执行的任务，一般用于执行某些初始化任务
   */
  action_root_mounted () {
    const vm = this
    // 从 localStorage 中读取当前登录的用户
    try {
      const user = JSON.parse(localStorage.getItem('current_user'))
      vm.$store.commit('setCurrentUser', user)
    } catch (e) {
      vm.$store.commit('setCurrentUser', null)
    }
    // 初始化菜单
    vm.config.hooks.action_get_menus.apply(vm).then(menus => {
      vm.config.menus = menus
    })
    // this.currentPageName = this.$route.name
    // this.$store.commit('setOpenedList')
    // this.$store.commit('initCachepage')
    // this.$store.commit('updateMenulist')
    // util.checkUpdate(this)
  },
  /**
   * 通过 Promise 返回展示的主界面侧栏菜单
   * @returns {Promise<Array<Object>>}
   */
  action_get_menus () {
    return Promise.resolve(import('../../../config/menus'))
  },
  /**
   * 执行登录的动作，返回一个 Promise，获得一个已登录的用户对象
   * @param username
   * @param password
   * @returns {Promise<Object user>}
   */
  action_login (username, password) {
    console.warn(
      '还没有实现登录验证功能，' +
      '请实现 config.hooks.action_login(username, password)，' +
      '现在任意账号密码均允许登录。')
    return Promise.resolve({username})
  },
  /**
   * TODO: 登录成功之后执行的动作，一般是跳转到首页
   */
  action_after_login () {
  },
  /**
   * TODO: 跳转到登录页面，登录成功之后跳转回指定的链接
   * @param redirectTo 登录成功之后返回的链接
   */
  action_goto_login (redirectTo = null) {
  },
  /**
   * 获取当前已登录的用户信息
   * @returns {Promise<Object user>}
   */
  action_authenticate () {
    const vm = this
    console.warn(
      '还没有实现后台验证登录功能，' +
      '请实现 config.hooks.action_authenticate()，' +
      '现在直接返回 Vuex 登录对象。')
    return new Promise((resolve, reject) => {
      if (vm.me) resolve(vm.me)
      else reject(new Error('尚未登录'))
    })
  },
  /**
   * 实现后台退出登录的动作
   * @returns {Promise<void>}
   */
  action_logout () {
    console.warn(
      '尚未实现后台退出登录功能，' +
      '请实现 config.hooks.action_logout()，' +
      '现在直接通过并清空 Vuex 状态。')
    return Promise.resolve()
  }
}
