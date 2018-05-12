export default {
  methods: {
    /**
     * 根据策略获取并刷新菜单列表
     * 默认情况下从 config.menus 抓取
     */
    reloadMenus () {
      const vm = this
      vm.config.hooks.action_get_menus.apply(vm).then(menus => {
        vm.$store.commit('updateMenus', menus)
      })
    },
    /**
     * TODO: 有些引用的地方可能从这里找会不全，因为有些没出现在 menus 里面的路由
     * 递归从当前菜单中匹配出查找的菜单项
     * @param name 需要匹配的菜单项 name 属性
     * @param menu 缺省时从当前所有菜单配置中获得
     */
    getMenuItem (name, menu = null) {
      const vm = this
      if (!menu) {
        const menus = vm.$store.state.app.menus
        for (let i = 0; i < menus.length; ++i) {
          const result = vm.getMenuItem(name, menus[i])
          if (result) return result
        }
      } else if (menu.name === name) {
        return menu
      } else if (menu.children) {
        for (let i = 0; i < menu.children.length; ++i) {
          const result = vm.getMenuItem(name, menu.children[i])
          if (result) return result
        }
      }
      return null
    },
    /**
     * 从 MainRoute 中获取指定名称的路由项目
     * @param name 路由的名称
     */
    getMainRouteItem (name) {
      const vm = this
      return vm._.find(vm.config.main_routes, { name })
    },
    /**
     * 给进去一个路由，维护 pagesOpened，如果有，切换至匹配的 pages
     * 如果没有，新建一个 pages 并且切换到上面
     * 匹配规则：
     * 匹配路由的 name 和 params，一致则认为是同一个 page，不一致则认为是新的 page
     * @param route
     */
    openPage ({ name, params = {}, query = {} }) {
      const vm = this
      // 必须存在路由，否则直接判死刑
      const route = vm.getMainRouteItem(name)
      if (!route) throw new Error('没有找到匹配的路由：' + name)
      vm.finalize(route.meta && route.meta.title, params).then(title => {
        vm.$store.commit('openPage', { name, params, query, title, meta: route.meta })
      })
    }
    // /**
    //  * 打开新的 TAB 窗口页
    //  * TODO: 这里的机制不够完整，同一个页面不同参数应该支持不同的 tab，譬如说不同商品的详情页不该独占，后期改进
    //  * @param name
    //  * @param params
    //  * @param query
    //  */
    // openNewPage (name, params, query) {
    //   console.log('OpenNewPage', name, params, query)
    //   const vm = this
    //   let pagesOpened = vm.$store.state.app.pagesOpened
    //   let found = false
    //   for (let i = 0; i < pagesOpened.length; ++i) {
    //     if (name === pagesOpened[i].name) { // 页面已经打开
    //       vm.$store.commit(
    //         'pageOpenedList',
    //         { index: i, params, query }
    //       )
    //       found = true
    //       break
    //     }
    //   }
    //   if (!found) {
    //     // TODO: 非 menu 的页面会有问题
    //     const menuItem = vm.getMenuItem(name)
    //     vm.$store.commit('addTag', {
    //       ...menuItem, params, query
    //     })
    //   }
    //   vm.$store.commit('setCurrentPageName', name)
    // },
    // /**
    //  * 打开页面，传入路由对象
    //  * @param name
    //  * @param params
    //  * @param query
    //  */
    // openPage ({ name, params = {}, query = {} }) {
    //   const vm = this
    //   vm.openNewPage(name, params, query)
    // }
  }
}
