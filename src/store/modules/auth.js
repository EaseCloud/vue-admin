// import Cookies from 'js-cookie'

// import config from '../../config'

const auth = {
  state: {
    currentUser: null
  },
  mutations: {
    loadCurrentUser (state) {
      try {
        state.currentUser = JSON.parse(localStorage.getItem('vue_admin_current_user'))
      } catch (e) {
        this.commit('setCurrentUser', null)
      }
    },
    dumpCurrentUser (state) {
      if (state.currentUser) {
        localStorage.setItem('vue_admin_current_user', JSON.stringify(state.currentUser))
      } else {
        localStorage.removeItem('vue_admin_current_user')
      }
    },
    setCurrentUser (state, user) {
      state.current_user = user
      this.commit('dumpCurrentUser')
    }
  },
  actions: {
    logout (dispatch) {
      dispatch('setCurrentUser', null)

      // Cookies.remove('user')
      // Cookies.remove('password')
      // Cookies.remove('access')
      // // 恢复默认样式
      // let themeLink = document.querySelector('link[name="theme"]')
      // themeLink.setAttribute('href', '')
      // // 清空打开的页面等数据，但是保存主题数据
      // let theme = ''
      // if (localStorage.theme) {
      //   theme = localStorage.theme
      // }
      // localStorage.clear()
      // if (theme) {
      //   localStorage.theme = theme
      // }
    }
  }
}

export default auth
