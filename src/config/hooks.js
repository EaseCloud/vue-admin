export default {
  /**
   * 根组件挂载之后执行的任务，一般用于执行某些初始化任务
   * @returns {Promise<void>}
   * 如果返回 resolve，继续执行正常的启动代码
   * 如果返回 reject，替换正常的启动代码（不执行系统默认启动代码）
   */
  action_root_mounted () {
    return Promise.resolve()
  },
  /**
   * 通过 Promise 返回展示的主界面侧栏菜单
   * @returns {Promise<Array<Object>>}
   */
  action_get_menus () {
    const vm = this
    return Promise.resolve(vm.config.menus)
  },
  /**
   * 过滤主菜单选中的动作
   * @param menuName 选中的菜单项名称
   * @returns {Promise<any>}
   * 如果成功，resolve 过滤修改之后的菜单项名称
   * 否则，reject 之后菜单项跳转动作会被忽略
   */
  filter_before_menu_select (menuName) {
    return Promise.resolve(menuName)
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
    return Promise.resolve({ username })
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
  },
  func_get_current_user_name () {
    const vm = this
    return (vm.me && (vm.me.name || vm.me.nickname || vm.me.username)) || ''
  },
  func_get_current_user_avatar_url () {
    const vm = this
    return vm.me && vm.me.avatar
  },
  /**
   * 通过 this 可以获取到调用的 vm 组件
   * 实现 api 模块提交数据之前，转换 payload 格式
   * 如果需要将提交格式转换成 FormData/json/x-urlencoded 的操作可以改写这个钩子
   */
  filter_data_before_api_request (data) {
    return Promise.resolve(data)
  }
}
