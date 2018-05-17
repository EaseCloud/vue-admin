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
    async openPage ({ name, params = {}, query = {} }) {
      const vm = this
      // 必须存在路由，否则直接判死刑
      const route = vm.getMainRouteItem(name)
      if (!route) throw new Error('没有找到匹配的路由：' + name)
      const title = await vm.finalize(route.meta && route.meta.title, params)
      vm.$store.commit('openPage', { name, params, query, title, meta: route.meta })
    },
    /**
     * 给进去一个路由，维护 pagesOpened
     * 用新的路由直接替换掉当前的 tab 选项
     * 匹配规则：
     * 匹配路由的 name 和 params，一致则认为是同一个 page，不一致则认为是新的 page
     * @param route
     */
    async replacePage ({ name, params = {}, query = {} }) {
      const vm = this
      // 必须存在路由，否则直接判死刑
      const route = vm.getMainRouteItem(name)
      if (!route) throw new Error('没有找到匹配的路由：' + name)
      const title = await vm.finalize(route.meta && route.meta.title, params)
      vm.$store.commit('replacePage', { name, params, query, title, meta: route.meta })
    },
    closePage (index) {
      const vm = this
      // let pagesOpened = vm.$store.state.app.pagesOpened
      // let lastPageObj = pagesOpened[0]
      // 如果关闭掉当前打开的标签，要将活动标签移到靠近的其他标签
      let newPageIndex = index
      const isCurrentPageClosing = index === vm.$store.state.app.currentPageIndex
      if (isCurrentPageClosing) {
        // 如果关掉的是最后一个标签，那么活动标签需要前移
        if (newPageIndex === vm.$store.state.app.pagesOpened.length - 1) {
          newPageIndex -= 1
        }
      }
      // let tagWidth = event.target.parentNode.offsetWidth
      // vm.tagBodyLeft = Math.min(vm.tagBodyLeft + tagWidth, 0)
      vm.$store.commit('closePage', index)
      // 如果当前标签关掉了，需要跳转
      if (isCurrentPageClosing) {
        if (vm.$store.state.app.pagesOpened.length === 0) {
          vm.$router.push(vm.config.home_route)
        } else {
          vm.$router.push(vm.$store.state.app.pagesOpened[newPageIndex].route)
        }
      }
    },
    closeCurrentPage () {
      const vm = this
      vm.closePage(vm.$store.state.app.currentPageIndex)
    }
  }
}
