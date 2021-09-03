export default {
  /**
   * 根组件挂载之后执行的任务，一般用于执行某些初始化任务
   * @returns {Promise<void>}
   * 如果返回 resolve，继续执行正常的启动代码
   * 如果返回 reject，替换正常的启动代码（不执行系统默认启动代码）
   */
  async action_root_mounted () {
  },
  /**
   * 登录后的根组件加载之后执行的任务
   * @returns {Promise<void>}
   * 如果返回 resolve，继续执行正常的启动代码
   * 如果返回 reject，替换正常的启动代码（不执行系统默认启动代码）
   */
  async action_main_mounted () {
  },
  /**
   * 通过 Promise 返回展示的主界面侧栏菜单
   * @returns {Promise<Array<Object>>}
   */
  async action_get_menus () {
    const vm = this
    return vm.config.menus
  },
  /**
   * 过滤主菜单选中的动作
   * @param menuName 选中的菜单项名称
   * @returns {Promise<any>}
   * 如果成功，resolve 过滤修改之后的菜单项名称
   * 否则，reject 之后菜单项跳转动作会被忽略
   */
  async filter_before_menu_select (menuName) {
    return menuName
  },
  /**
   * 执行登录的动作，返回一个 Promise，获得一个已登录的用户对象
   * @param username
   * @param password
   * @returns {Promise<Object user>}
   */
  async action_login (username, password) {
    console.warn(
      '还没有实现登录验证功能，' +
      '请实现 config.hooks.action_login(username, password)，' +
      '现在任意账号密码均允许登录。')
    return { username }
  },
  /**
   * TODO: 登录成功之后执行的动作，一般是跳转到首页
   */
  async action_after_login () {
  },
  /**
   * TODO: 跳转到登录页面，登录成功之后跳转回指定的链接
   * @param redirectTo 登录成功之后返回的链接
   */
  async action_goto_login (redirectTo = null) {
  },
  /**
   * 获取当前已登录的用户信息
   * @returns {Promise<Object user>}
   */
  async action_authenticate () {
    const vm = this
    console.warn(
      '还没有实现后台验证登录功能，' +
      '请实现 config.hooks.action_authenticate()，' +
      '现在直接返回 Vuex 登录对象。')
    if (vm.me) return vm.me
    throw new Error('尚未登录')
  },
  /**
   * 实现后台退出登录的动作
   * @returns {Promise<void>}
   */
  async action_logout () {
    console.warn(
      '尚未实现后台退出登录功能，' +
      '请实现 config.hooks.action_logout()，' +
      '现在直接通过并清空 Vuex 状态。')
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
  async filter_data_before_api_request (data) {
    return data
  },
  /**
   * 根据数据模型名称和获取列表页面路由
   * @param model
   * @returns {Promise<{name: string}>}
   */
  async action_get_model_list_route (model) {
    return { name: `main_${model}_list` }
  },
  /**
   * 根据数据模型名称和 id 获取编辑页面路由
   * @param model
   * @param pk
   * @returns {Promise<{name: string, params: {id: *}}>}
   */
  async action_get_model_edit_route (model, pk) {
    return { name: `main_${model}_edit`, params: { id: pk } }
  },
  /**
   * TODO: 默认情况没有实现
   * ListView 使用：根据接口配置获取数据
   * @returns {Promise<>}
   */
  async action_list_view_load_data () {
    const vm = this
    return vm.api(vm.model, vm.apiRoot || vm.config.api_root).get({
      // page
    })
  },
  /**
   * EditView 使用：根据接口配置获取单个数据
   * @returns {Promise<>}
   */
  async action_edit_view_load_data (id) {
    const vm = this
    return vm.config.hooks.action_model_get_item.apply(vm, [vm.model, id])
  },
  /**
   * EditView 使用：创建一个对象
   * @returns {Promise<>}
   */
  async action_edit_view_create_item (item) {
    const vm = this
    const resp = await vm.api(vm.model, vm.apiRoot || vm.config.api_root).post(item)
    vm.$Message.success('操作成功')
    return resp.data
  },
  /**
   * EditView 使用：更新一个对象
   * @returns {Promise<>}
   */
  async action_edit_view_update_item (item) {
    const vm = this
    const id = vm.evaluate(item, await vm.finalize(vm.pk))
    const resp = await vm.api(vm.model, vm.apiRoot || vm.config.api_root).patch({ id }, item)
    vm.$Message.success('操作成功')
    return resp.data
  },
  /**
   * EditView/ListView 使用：删除一个对象
   * @returns {Promise<>}
   */
  async action_data_view_delete_item (item) {
    const vm = this
    const id = vm.evaluate(item, await vm.finalize(vm.pk))
    await vm.config.hooks.action_model_delete_item.apply(vm, [vm.model, id])
    vm.$Message.info('已成功删除对象')
  },
  /**
   * 获取模型的对象
   * @param model
   * @param id
   * @returns {Promise<*>}
   */
  async action_model_delete_item (model, id) {
    const vm = this
    return vm.api(model, vm.apiRoot || vm.config.api_root).delete({ id })
  },
  /**
   * 获取模型的对象
   * @param model
   * @param id
   * @returns {Promise<*>}
   */
  async action_model_get_item (model, id) {
    const vm = this
    const resp = await vm.api(model, vm.apiRoot || vm.config.api_root).get({ id })
    return resp.data
  },
  /**
   * EditView 使用：保存对象之前的过滤动作
   * @returns {Promise<>}
   */
  async filter_edit_view_pre_save (item) {
    return item
  },
  /**
   * EditView 使用：保存对象之后的动作
   * 默认：保存之后重新打开
   * @returns {Promise<>}
   */
  async action_edit_view_post_save (item) {
    return item
  },
  /**
   * ListView, EditView 使用：删除对象之后的动作
   * 默认：返回删除的对象
   * @return {Promise}
   */
  async action_after_delete (item) {
    return item
  }
}
