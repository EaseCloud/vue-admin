export default {
  /**
   * 递归从当前菜单中匹配出查找的菜单项
   * @param name 需要匹配的菜单项 name 属性
   * @param menu 缺省时从当前所有菜单配置中获得
   */
  getMenuItem (name, menu = null) {
    if (!menu) {
      const menus = window.app.config.menus
      for (let i = 0; i < menus.length; ++i) {
        const result = this.getMenuItem(name, menus[i])
        if (result) return result
      }
    } else if (menu.name === name) {
      return menu
    } else if (menu.children) {
      for (let i = 0; i < menu.children.length; ++i) {
        const result = this.getMenuItem(name, menu.children[i])
        if (result) return result
      }
    }
    return null
  },
  getMenuTitle (menuItem) {
    if (menuItem.title && menuItem.title.i18n) {
      return this.$t(menuItem.title.i18n)
    }
    return menuItem.title
  },
  openNewPage (vm, name, argu, query) {
    let pageOpenedList = vm.$store.state.app.pageOpenedList
    let openedPageLen = pageOpenedList.length
    let i = 0
    let tagHasOpened = false
    while (i < openedPageLen) {
      if (name === pageOpenedList[i].name) { // 页面已经打开
        vm.$store.commit('pageOpenedList', {
          index: i,
          argu,
          query
        })
        tagHasOpened = true
        break
      }
      i++
    }
    if (!tagHasOpened) {
      let tag = vm.$store.state.app.tagsList.filter((item) => {
        if (item.children) {
          return name === item.children[0].name
        } else {
          return name === item.name
        }
      })
      tag = tag[0]
      if (tag) {
        tag = tag.children ? tag.children[0] : tag
        if (argu) {
          tag.argu = argu
        }
        if (query) {
          tag.query = query
        }
        vm.$store.commit('increateTag', tag)
      }
    }
    vm.$store.commit('setCurrentPageName', name)
  }
}
