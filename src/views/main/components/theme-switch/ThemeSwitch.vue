<template>
  <div style="display:inline-block;padding:0 6px;">
    <dropdown trigger="click" @on-click="setTheme">
      <a href="javascript:void(0)">
        <!-- TODO: 自 iView3.0 废弃，花哨的功能 -->
        <x-icon :style="{marginTop: '-2px', verticalAlign: 'middle'}" color="#515A6E" :size="18"
              type="paintbucket"></x-icon>
        <x-icon type="md-arrowdropdown"></x-icon>
      </a>
      <dropdown-menu slot="list">
        <dropdown-item v-for="(item, index) in themeList" :key="index" :name="item.name">
          <row type="flex" justify="center" align="middle">
            <span style="margin-right:10px;"
            ><icon :size="20"
                   :type="item.name.substr(0, 1) !== 'b' ? 'happy-outline' : 'happy'"
                   :color="item.menu"/></span>
            <span><icon :size="22" type="record" :color="item.element"/></span>
          </row>
        </dropdown-item>
      </dropdown-menu>
    </dropdown>
  </div>
</template>

<script>
  import _ from 'lodash'
  import Cookies from 'js-cookie'

  // import './theme/r.css'
  // import './theme/g.css'
  // import './theme/y.css'
  import r from './theme/r'
  import g from './theme/g'
  import y from './theme/y'

  const setThemeCss = mainTheme => {
    _.each(document.getElementsByClassName('vue-admin-theme'), el => {
      el.parentElement.removeChild(el)
    })
    if (css.hasOwnProperty(mainTheme)) {
      const el = document.createElement('style')
      el.setAttribute('class', 'vue-admin-theme')
      el.textContent = css[mainTheme]
      document.head.appendChild(el)
    }
  }
  const css = { r, g, y }

  export default {
    name: 'themeSwitch',
    data () {
      return {
        themeList: [
          { name: 'black_b', menu: '#515A6E', element: '#2d8cf0' },
          { name: 'black_g', menu: '#515A6E', element: '#00a854' },
          { name: 'black_y', menu: '#515A6E', element: '#e96500' },
          { name: 'black_r', menu: '#515A6E', element: '#e43e31' },
          { name: 'light_b', menu: '#515A6E', element: '#2d8cf0' },
          { name: 'light_g', menu: '#515A6E', element: '#00a854' },
          { name: 'light_y', menu: '#515A6E', element: '#e96500' },
          { name: 'light_r', menu: '#515A6E', element: '#e43e31' }
        ]
      }
    },
    methods: {
      getThemeLink () {
        let themeLink = document.querySelector('link[name="theme"]')
        if (!themeLink) {
          themeLink = document.createElement('link')
          themeLink.setAttribute('rel', 'styleSheet')
          themeLink.setAttribute('name', 'theme')
          document.head.appendChild(themeLink)
        }
        return themeLink
      },
      setTheme (themeFile) {
        let menuTheme = themeFile.substr(0, 1)
        let mainTheme = themeFile.substr(-1, 1)
        if (menuTheme === 'b') {
          // 黑色菜单
          this.$store.commit('changeMenuTheme', 'dark')
          menuTheme = 'dark'
        } else {
          this.$store.commit('changeMenuTheme', 'light')
          menuTheme = 'light'
        }
        let userName = Cookies.get('user')
        if (localStorage.theme) {
          let themeList = JSON.parse(localStorage.theme)
          let index = 0
          let hasThisUser = themeList.some((item, i) => {
            if (item.userName === userName || (!userName && !item.userName)) {
              index = i
              return true
            } else {
              return false
            }
          })
          if (hasThisUser) {
            themeList[index].mainTheme = mainTheme
            themeList[index].menuTheme = menuTheme
          } else {
            themeList.push({
              userName: userName,
              mainTheme: mainTheme,
              menuTheme: menuTheme
            })
          }
          localStorage.theme = JSON.stringify(themeList)
        } else {
          localStorage.theme = JSON.stringify([{
            userName: userName,
            mainTheme: mainTheme,
            menuTheme: menuTheme
          }])
        }
        setThemeCss(mainTheme)
      }
    },
    created () {
      let name = Cookies.get('user')
      if (localStorage.theme) {
        let hasThisUser = JSON.parse(localStorage.theme).some(item => {
          if (item.userName === name) {
            this.$store.commit('changeMenuTheme', item.menuTheme)
            this.$store.commit('changeMainTheme', item.mainTheme)
            return true
          } else {
            return false
          }
        })
        if (!hasThisUser) {
          this.$store.commit('changeMenuTheme', 'dark')
          this.$store.commit('changeMainTheme', 'b')
        }
      } else {
        this.$store.commit('changeMenuTheme', 'dark')
        this.$store.commit('changeMainTheme', 'b')
      }
      // 根据用户设置主题
      setThemeCss(this.$store.state.app.themeColor)
    }
  }
</script>
