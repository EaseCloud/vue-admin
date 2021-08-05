export default {
  methods: {
    /**
     * 根据策略获取并刷新菜单列表
     * 默认情况下从 config.menus 抓取
     */
    async reloadMenus () {
      const vm = this
      const menus = await vm.config.hooks.action_get_menus.apply(vm)
      vm.$store.commit('updateMenus', menus)
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
     * @param routeList 搜索的路由列表范围，主要用于递归
     */
    getMainRouteItem (name, routeList = null) {
      const vm = this
      let result
      const routes = routeList || vm.config.main_routes
      routes.forEach(route => {
        if (route.name === name) {
          result = route
        } else if (route.children) {
          result = result || vm.getMainRouteItem(name, route.children)
        }
      })
      return result
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
      // 由于路由重复判定会用 params 和 name 匹配，因此要先将 params 取值归一化到 string 类型
      vm._.each(params, (v, k) => {
        params[k] = v.toString()
      })
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
    async closePage (index) {
      const vm = this
      // let pagesOpened = vm.$store.state.app.pagesOpened
      // let lastPageObj = pagesOpened[0]
      const isCurrentPageClosing = index === vm.$store.state.app.currentPageIndex
      // let tagWidth = event.target.parentNode.offsetWidth
      // vm.tagBodyLeft = Math.min(vm.tagBodyLeft + tagWidth, 0)

      // commit 之后 vm.$store.state.app.currentPageIndex 会自动跳转至正确的页面
      vm.$store.commit('closePage', index)
      // 如果当前标签关掉了，需要跳转
      if (isCurrentPageClosing) {
        // 没有了就打开首页
        if (vm.$store.state.app.pagesOpened.length === 0) {
          await vm.$router.push(vm.config.home_route).catch(err => {
            if (err.name !== 'NavigationDuplicated') throw err
          })
        } else {
          await vm.$router.push(
            vm.$store.state.app.pagesOpened[vm.$store.state.app.currentPageIndex].route
          ).catch(err => {
            if (err.name !== 'NavigationDuplicated') throw err
          })
        }
      }
    },
    async closeCurrentPage () {
      const vm = this
      await vm.closePage(vm.$store.state.app.currentPageIndex)
    }
  }
}
