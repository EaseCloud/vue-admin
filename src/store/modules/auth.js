// import Cookies from 'js-cookie'

// import config from '../../config'

const auth = {
  state: {
    current_user: null
  },
  mutations: {
    setCurrentUser (state, user) {
      console.log(state, user)
      state.current_user = user
      if (user) {
        localStorage.setItem('current_user', JSON.stringify(user))
      } else {
        localStorage.removeItem('current_user')
      }
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
