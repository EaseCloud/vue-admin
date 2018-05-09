export default {
  /**
   * 根组件挂载之后执行的任务，一般用于执行某些初始化任务
   */
  hook_root_mounted () {
    const vm = this
    // 从 localStorage 中读取当前登录的用户
    try {
      const user = JSON.parse(localStorage.getItem('current_user'))
      vm.$store.commit('setCurrentUser', user)
    } catch (e) {
      vm.$store.commit('setCurrentUser', null)
    }
    // this.currentPageName = this.$route.name
    // this.$store.commit('setOpenedList')
    // this.$store.commit('initCachepage')
    // this.$store.commit('updateMenulist')
    // util.checkUpdate(this)
  },
  /**
   * 执行登录的动作，返回一个 Promise，获得一个已登录的用户对象
   * @param username
   * @param password
   * @returns {Promise<Object user>}
   */
  hook_login (username, password) {
    console.warn(
      '还没有实现登录验证功能，' +
      '请实现 config.hook_login(username, password)，' +
      '现在任意账号密码均允许登录。')
    return Promise.resolve({username})
  },
  /**
   * TODO: 登录成功之后执行的动作，一般是跳转到首页
   */
  hook_after_login () {
  },
  /**
   * TODO: 跳转到登录页面，登录成功之后跳转回指定的链接
   * @param redirectTo 登录成功之后返回的链接
   */
  hook_goto_login (redirectTo = null) {
  },
  /**
   * TODO: 获取当前已登录的用户信息
   * @param reload 是否从服务器中重新获取认证并刷新
   * @returns {Promise<Object user>}
   */
  hook_authenticate (reload = false) {
    return Promise.resolve()
  },
  /**
   * TODO: 实现退出登录的动作
   * 一般而言需要调用服务端的退出登录接口，并且返回登录页
   * @returns {Promise<void>}
   */
  hook_logout () {
    return Promise.resolve()
  }
}
