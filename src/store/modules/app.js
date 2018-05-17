import _ from 'lodash'
// import Cookies from 'js-cookie'
import Vue from 'vue'
// import config from '../../config'
// import utils from '../../utils'

const app = {
  state: {
    menus: [],
    pages: {}, // Main 下级路由中的所有页面组件
    /**
     * pagesOpened 格式：
     * {
     *   title: String / Function / Promise,
     *   route: {
     *     name: String,
     *     params: Object<String, Any>,
     *     query: Object<String, Any>
     *   }
     * }
     * 其中 title 可以通过 finalize 传入 params 做变量计算得到
     */
    pagesOpened: [],
    currentPageIndex: -1,
    menuTheme: 'dark', // 主题
    themeColor: '',
    // ---- 定版的分割线 ----
    cachePage: [],
    lang: '',
    isFullScreen: false,
    openedSubmenuArr: [], // 要展开的菜单数组
    // currentPageName: '',
    currentPath: [], // 面包屑数组
    // routers: [
    //   // otherRouter,
    //   // ...appRouter
    // ],
    // tagsList: [
    //   // ...otherRouter.children
    // ],
    // messageCount: 0,
    dontCache: ['text-editor', 'artical-publish'] // 在这里定义你不想要缓存的页面的name属性值(参见路由配置router.js)
  },
  mutations: {
    updateMenus (state, menus) {
      state.menus = menus
    },
    loadPagesOpened (state) {
      try {
        state.pagesOpened = JSON.parse(localStorage.getItem('vue_admin_pages_opened'))
      } catch (e) {
        state.pagesOpened = []
        this.commit('dumpPagesOpened')
      }
    },
    dumpPagesOpened (state) {
      localStorage.setItem('vue_admin_pages_opened', JSON.stringify(state.pagesOpened))
    },
    // /**
    //  * 查找所有 Main 路由下的所有页面组件，然后根据配置
    //  * 初始化所有的页面入口
    //  * @param state
    //  */
    // initPageList (state) {
    //   const pages = {}
    //   config.main_routes.forEach(route => {
    //     if (route.component) {
    //       pages[route.name] = {
    //         name: route.name,
    //         // TODO: 需要有动态获取标题的机制
    //         title: (route.meta && route.meta.title) || '未命名页面',
    //         locked: !!(route.meta && route.meta.locked)
    //       }
    //     }
    //   })
    //   state.pages = pages
    // },
    openPage (state, { title, name, meta, params = {}, query = {} }) {
      // 先查找现存的 pagesOpened
      let pageIndex = _.findIndex(state.pagesOpened, { route: { name, params } })
      if (pageIndex === -1) {
        // 没有的话插一个
        const page = { title, meta, route: { name, params, query } }
        if (!state.pagesOpened) state.pagesOpened = []
        state.pagesOpened.splice(state.currentPageIndex + 1, 0, page)
        pageIndex = state.currentPageIndex + 1
      } else {
        // 有的话替换掉 query 条件
        state.pagesOpened[pageIndex].route = { name, params, query }
      }
      state.currentPageIndex = pageIndex
      // 保存状态
      this.commit('dumpPagesOpened')
    },
    replacePage (state, { title, name, meta, params = {}, query = {} }) {
      // 先查找现存的 pagesOpened
      let pageIndex = _.findIndex(state.pagesOpened, { route: { name, params } })
      // 无论如何都要替换掉当前的页面
      const page = { title, meta, route: { name, params, query } }
      if (!state.pagesOpened) state.pagesOpened = []
      state.pagesOpened.splice(state.currentPageIndex, 1, page)
      // 保存状态
      this.commit('dumpPagesOpened')
      // 如果发现有同一个页面的话，将其关掉
      if (pageIndex > 1) {
        this.commit('closePage', pageIndex)
      }
    },
    closePage (state, index) {
      state.pagesOpened.splice(index, 1)
      this.commit('dumpPagesOpened')
    },
    closeAllPages (state) {
      state.pagesOpened = _.filter(state.pagesOpened, { meta: { locked: true } })
      state.currentPageIndex = state.pagesOpened.length - 1
      // state.cachePage.length = 0
      this.commit('dumpPagesOpened')
    },
    closeOtherPages (state) {
      let j = -1
      const oldIndex = state.currentPageIndex
      state.currentPageIndex = 0
      state.pagesOpened = _.filter(state.pagesOpened, (page, i) => {
        if (i === oldIndex || page.meta.locked) {
          j += 1
          if (i === oldIndex) state.currentPageIndex = j
          console.log(true, i)
          return true
        }
        console.log(false, i)
        return false
      })
      // let newCachepage = state.cachePage.filter(item => {
      //   return item === currentName
      // })
      // state.cachePage = newCachepage
      // localStorage.pagesOpened = JSON.stringify(state.pagesOpened)
      this.commit('dumpPagesOpened')
    },
    // ---- 定版的分割线 ----
    setTagsList (state, list) {
      state.tagsList.push(...list)
    },
    changeMenuTheme (state, theme) {
      state.menuTheme = theme
    },
    changeMainTheme (state, mainTheme) {
      state.themeColor = mainTheme
    },
    addOpenSubmenu (state, name) {
      let hasThisName = false
      let isEmpty = false
      if (name.length === 0) {
        isEmpty = true
      }
      if (state.openedSubmenuArr.indexOf(name) > -1) {
        hasThisName = true
      }
      if (!hasThisName && !isEmpty) {
        state.openedSubmenuArr.push(name)
      }
    },
    // closePage (state, name) {
    //   state.cachePage.forEach((item, index) => {
    //     if (item === name) {
    //       state.cachePage.splice(index, 1)
    //     }
    //   })
    // },
    // initCachepage (state) {
    //   if (localStorage.cachePage) {
    //     state.cachePage = JSON.parse(localStorage.cachePage)
    //   }
    // },
    // pagesOpened (state, page) {
    //   // {
    //   // title: '首页',
    //   // path: '',
    //   // name: 'main_home'
    //   // }
    //   let openedPage = state.pagesOpened[page.index]
    //   if (page.params) {
    //     openedPage.params = page.params
    //   }
    //   if (page.query) {
    //     openedPage.query = page.query
    //   }
    //   state.pagesOpened.splice(page.index, 1, openedPage)
    //   localStorage.pagesOpened = JSON.stringify(state.pagesOpened)
    // },
    // /**
    //  * TODO:
    //  * 初始化页面（从 localStorage 中读取已打开的页面，没有的话加载默认首页
    //  * @param state
    //  */
    // setOpenedList (state) {
    //   try {
    //     state.pagesOpened = localStorage.pagesOpened
    //       ? JSON.parse(localStorage.pagesOpened) : []
    //   } catch (e) {
    //     state.pagesOpened = []
    //   }
    // },
    setCurrentPath (state, pathArr) {
      state.currentPath = pathArr
    },
    // setCurrentPageName (state, name) {
    //   state.currentPageName = name
    // },
    setAvatar (state, path) {
      localStorage.avatarImgPath = path
    },
    switchLang (state, lang) {
      state.lang = lang
      Vue.config.lang = lang
    },
    clearOpenedSubmenu (state) {
      state.openedSubmenuArr.length = 0
    },
    // setMessageCount (state, count) {
    //   state.messageCount = count
    // },
    addTag (state, tagObj) {
      if (!tagObj.noCache) {
        state.cachePage.push(tagObj.name)
        localStorage.cachePage = JSON.stringify(state.cachePage)
      }
      state.pagesOpened.push(tagObj)
      localStorage.pagesOpened = JSON.stringify(state.pagesOpened)
    }
  }
}

export default app
