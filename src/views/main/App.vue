<template>
  <div class="main" :class="{'main-hide-text': shrink}">
    <div class="sidebar-menu-con" :style="{width: shrink?'60px':'200px', overflow: shrink ? 'visible' : 'auto'}">
      <scroll-bar ref="scrollBar">
        <shrinkable-menu
          :shrink="shrink"
          @on-change="handleSubmenuChange"
          :theme="$store.state.app.menuTheme"
          :before-push="beforePush"
          :open-names="openedSubmenuArr"
          :menu-list="menuList">
          <div slot="top" class="logo-con">
            <img v-show="!shrink" src="../../../assets/images/logo.jpg" key="max-logo"/>
            <img v-show="shrink" src="../../../assets/images/logo-min.jpg" key="min-logo"/>
          </div>
        </shrinkable-menu>
      </scroll-bar>
    </div>
    <div class="main-header-con" :style="{paddingLeft: shrink?'60px':'200px'}">
      <div class="main-header">
        <div class="navicon-con">
          <i-button :style="{transform: 'rotateZ(' + (this.shrink ? '-90' : '0') + 'deg)'}" type="text"
                    @click="toggleClick">
            <icon type="navicon" size="32"></icon>
          </i-button>
        </div>
        <div class="header-middle-con">
          <div class="main-breadcrumb">
            <breadcrumb-nav :currentPath="currentPath"></breadcrumb-nav>
          </div>
        </div>
        <div class="header-avator-con">
          <full-screen v-model="isFullScreen" @on-change="fullscreenChange"></full-screen>
          <lock-screen></lock-screen>
          <message-tip v-model="mesCount"></message-tip>
          <theme-switch></theme-switch>

          <div class="user-dropdown-menu-con">
            <Row type="flex" justify="end" align="middle" class="user-dropdown-innercon">
              <Dropdown transfer trigger="click" @on-click="handleClickUserDropdown">
                <a href="javascript:void(0)">
                  <span class="main-user-name">{{ userName }}</span>
                  <Icon type="arrow-down-b"></Icon>
                </a>
                <DropdownMenu slot="list">
                  <DropdownItem name="ownSpace">个人中心</DropdownItem>
                  <DropdownItem name="loginout" divided>退出登录</DropdownItem>
                </DropdownMenu>
              </Dropdown>
              <Avatar :src="avatorPath" style="background: #619fe7; margin-left: 10px;"></Avatar>
            </Row>
          </div>
        </div>
      </div>
      <div class="tags-con">
        <tags-page-opened :pageTagsList="pageTagsList"></tags-page-opened>
      </div>
    </div>
    <div class="single-page-con" :style="{left: shrink?'60px':'200px'}">
      <div class="single-page">
        <keep-alive :include="cachePage">
          <router-view></router-view>
        </keep-alive>
      </div>
    </div>
  </div>
</template>

<script>
  import ShrinkableMenu from './components/shrinkable-menu/ShrinkableMenu.vue'
  import TagsPageOpened from './components/TagsPageOpened.vue'
  import BreadcrumbNav from './components/BreadcurmbNav.vue'
  import FullScreen from './components/FullScreen.vue'
  import LockScreen from './components/lockscreen/LockScreen.vue'
  import MessageTip from './components/MessageTip.vue'
  import ThemeSwitch from './components/theme-switch/ThemeSwitch.vue'
  import Cookies from 'js-cookie'
  // import util from '@/libs/util.js'
  // import scrollBar from '@/views/my-components/scroll-bar/vue-scroller-bars'

  // function handleTitle (vm, item) {
  //   if (typeof item.title === 'object') {
  //     return vm.$t(item.title.i18n)
  //   } else {
  //     return item.title
  //   }
  // }

  // function setCurrentPath (vm, name) {
  //   const menu = vm.utils.app.getMenuItem(
  //     vm.config.home_route.name || vm.config.home_route
  //   )
  //   if (!menu) throw new Error('没有找到指定的菜单项：' + name)
  //   const title = handleTitle(vm, menu)
  //
  //   let currentPathArr = []
  //   if (name === 'home_index') {
  //     currentPathArr = [{
  //       title: handleTitle(vm, vm.utils.app.getMenuItem(vm.config.home_route.name || vm.config.home_route)),
  //       path: '',
  //       name: 'home_index'
  //     }]
  //   } else if ((name.indexOf('_index') >= 0 || isOtherRouter) && name !== 'home_index') {
  //     currentPathArr = [{
  //       title: handleTitle(vm, util.getRouterObjByName(vm.$store.state.app.routers, 'home_index')),
  //       path: '/home',
  //       name: 'home_index'
  //     }, {
  //       title: title,
  //       path: '',
  //       name: name
  //     }]
  //   } else {
  //     let currentPathObj = vm.$store.state.app.routers.filter(item => {
  //       if (item.children.length <= 1) {
  //         return item.children[0].name === name
  //       } else {
  //         let i = 0
  //         let childArr = item.children
  //         let len = childArr.length
  //         while (i < len) {
  //           if (childArr[i].name === name) {
  //             return true
  //           }
  //           i++
  //         }
  //         return false
  //       }
  //     })[0]
  //     if (currentPathObj.children.length <= 1 && currentPathObj.name === 'home') {
  //       currentPathArr = [
  //         {
  //           title: '首页',
  //           path: '',
  //           name: 'home_index'
  //         }
  //       ]
  //     } else if (currentPathObj.children.length <= 1 && currentPathObj.name !== 'home') {
  //       currentPathArr = [
  //         {
  //           title: '首页',
  //           path: '/home',
  //           name: 'home_index'
  //         },
  //         {
  //           title: currentPathObj.title,
  //           path: '',
  //           name: name
  //         }
  //       ]
  //     } else {
  //       let childObj = currentPathObj.children.filter((child) => {
  //         return child.name === name
  //       })[0]
  //       currentPathArr = [
  //         {
  //           title: '首页',
  //           path: '/home',
  //           name: 'home_index'
  //         },
  //         {
  //           title: currentPathObj.title,
  //           path: '',
  //           name: currentPathObj.name
  //         },
  //         {
  //           title: childObj.title,
  //           path: currentPathObj.path + '/' + childObj.path,
  //           name: name
  //         }
  //       ]
  //     }
  //   }
  //   vm.$store.commit('setCurrentPath', currentPathArr)
  //   return currentPathArr
  // }

  export default {
    components: {
      ShrinkableMenu,
      TagsPageOpened,
      BreadcrumbNav,
      FullScreen,
      LockScreen,
      MessageTip,
      ThemeSwitch
    },
    data () {
      return {
        shrink: false,
        userName: '',
        isFullScreen: false,
        openedSubmenuArr: this.$store.state.app.openedSubmenuArr
      }
    },
    computed: {
      menuList () {
        return this.$store.state.app.menuList
      },
      pageTagsList () {
        return this.$store.state.app.pageOpenedList // 打开的页面的页面对象
      },
      currentPath () {
        return this.$store.state.app.currentPath // 当前面包屑数组
      },
      avatorPath () {
        return localStorage.avatorImgPath
      },
      cachePage () {
        return this.$store.state.app.cachePage
      },
      mesCount () {
        return this.$store.state.app.messageCount
      }
    },
    methods: {
      init () {
        // let pathArr = setCurrentPath(this, this.$route.name)
        this.$store.commit('updateMenulist')
        // if (pathArr.length >= 2) {
        //   this.$store.commit('addOpenSubmenu', pathArr[1].name)
        // }
        this.userName = Cookies.get('user')
        let messageCount = 3
        this.messageCount = messageCount.toString()
        // this.checkTag(this.$route.name)
        this.$store.commit('setMessageCount', 3)
      },
      toggleClick () {
        this.shrink = !this.shrink
      },
      handleClickUserDropdown (name) {
        const vm = this
        if (name === 'ownSpace') {
          vm.utils.app.openNewPage(vm, 'ownspace_index')
          this.$router.push({
            name: 'ownspace_index'
          })
        } else if (name === 'loginout') {
          // 退出登录
          this.$store.commit('logout', this)
          this.$store.commit('clearOpenedSubmenu')
          this.$router.push({
            name: 'login'
          })
        }
      },
      // checkTag (name) {
      //   let openpageHasTag = this.pageTagsList.some(item => {
      //     if (item.name === name) {
      //       return true
      //     }
      //   })
      //   if (!openpageHasTag) { //  解决关闭当前标签后再点击回退按钮会退到当前页时没有标签的问题
      //     util.openNewPage(this, name, this.$route.params || {}, this.$route.query || {})
      //   }
      // },
      handleSubmenuChange (val) {
        // console.log(val)
      },
      beforePush (name) {
        // if (name === 'accesstest_index') {
        //     return false
        // } else {
        //     return true
        // }
        return true
      },
      fullscreenChange (isFullScreen) {
        // console.log(isFullScreen)
      },
      scrollBarResize () {
        this.$refs.scrollBar.resize()
      }
    },
    watch: {
      $route (to) {
        this.$store.commit('setCurrentPageName', to.name)
        // let pathArr = setCurrentPath(this, to.name)
        // if (pathArr.length > 2) {
        //   this.$store.commit('addOpenSubmenu', pathArr[1].name)
        // }
        this.checkTag(to.name)
        localStorage.currentPageName = to.name
      },
      // lang () {
      //   setCurrentPath(this, this.$route.name) // 在切换语言时用于刷新面包屑
      // },
      openedSubmenuArr () {
        setTimeout(() => {
          this.scrollBarResize()
        }, 300)
      }
    },
    mounted () {
      this.init()
      window.addEventListener('resize', this.scrollBarResize)
    },
    created () {
      // 显示打开的页面的列表
      this.$store.commit('setOpenedList')
    },
    dispatch () {
      window.removeEventListener('resize', this.scrollBarResize)
    }
  }
</script>

<style lang="less">
  .lock-screen-back {
    border-radius: 50%;
    z-index: -1;
    box-shadow: 0 0 0 0 #667aa6 inset;
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    transition: all 3s;
  }

  .main {
    position: absolute;
    width: 100%;
    height: 100%;
    .unlock-con {
      width: 0;
      height: 0;
      position: absolute;
      left: 50%;
      top: 50%;
      z-index: 11000;
    }
    .sidebar-menu-con {
      height: 100%;
      position: fixed;
      top: 0;
      left: 0;
      z-index: 21;
      transition: width .3s;
      background: rgb(73, 80, 96)
    }
    .layout-text {
      display: inline-block;
      white-space: nowrap;
      position: absolute;
    }
    .main-hide-text .layout-text {
      display: none;
    }
    &-content-container {
      position: relative;
    }
    &-header-con {
      box-sizing: border-box;
      position: fixed;
      display: block;
      padding-left: 200px;
      width: 100%;
      height: 100px;
      z-index: 20;
      box-shadow: 0 2px 1px 1px rgba(100, 100, 100, .1);
      transition: padding .3s;
    }
    &-breadcrumb {
      padding: 8px 15px 0;
    }
    &-menu-left {
      background: #464c5b;
      height: 100%;
    }
    .tags-con {
      height: 40px;
      z-index: -1;
      overflow: hidden;
      background: #f0f0f0;
      .tags-outer-scroll-con {
        position: relative;
        box-sizing: border-box;
        padding-right: 120px;
        width: 100%;
        height: 100%;
        .tags-inner-scroll-body {
          position: absolute;
          padding: 2px 10px;
          overflow: visible;
          white-space: nowrap;
          transition: left .3s ease;
        }
        .close-all-tag-con {
          position: absolute;
          right: 0;
          top: 0;
          box-sizing: border-box;
          padding-top: 8px;
          text-align: center;
          width: 110px;
          height: 100%;
          background: white;
          box-shadow: -3px 0 15px 3px rgba(0, 0, 0, .1);
          z-index: 10;
        }
      }
    }
    &-header {
      height: 60px;
      background: #fff;
      box-shadow: 0 2px 1px 1px rgba(100, 100, 100, .1);
      position: relative;
      z-index: 11;
      .navicon-con {
        margin: 6px;
        display: inline-block;
      }
      .header-middle-con {
        position: absolute;
        left: 60px;
        top: 0;
        right: 340px;
        bottom: 0;
        padding: 10px;
        overflow: hidden;
      }
      .header-avator-con {
        position: absolute;
        right: 0;
        top: 0;
        height: 100%;
        width: 300px;
        .switch-theme-con {
          display: inline-block;
          width: 40px;
          height: 100%;
        }
        .message-con {
          display: inline-block;
          width: 30px;
          padding: 18px 0;
          text-align: center;
          cursor: pointer;
          i {
            vertical-align: middle;
          }
        }
        .change-skin {
          font-size: 14px;
          font-weight: 500;
          padding-right: 5px;
        }
        .switch-theme {
          height: 100%;
        }
        .user-dropdown {
          &-menu-con {
            position: absolute;
            right: 0;
            top: 0;
            width: 150px;
            height: 100%;
            .main-user-name {
              display: inline-block;
              width: 80px;
              word-break: keep-all;
              white-space: nowrap;
              vertical-align: middle;
              overflow: hidden;
              text-overflow: ellipsis;
              text-align: right;
            }
          }
          &-innercon {
            height: 100%;
            padding-right: 14px;
          }
        }
        .full-screen-btn-con {
          display: inline-block;
          width: 30px;
          padding: 18px 0;
          text-align: center;
          cursor: pointer;
          i {
            vertical-align: middle;
          }
        }
        .lock-screen-btn-con {
          display: inline-block;
          width: 30px;
          padding: 18px 0;
          text-align: center;
          cursor: pointer;
          i {
            vertical-align: middle;
          }
        }
      }
    }
    .single-page-con {
      position: absolute;
      top: 100px;
      right: 0;
      bottom: 0;
      overflow: auto;
      background-color: #F0F0F0;
      z-index: 1;
      transition: left .3s;
      .single-page {
        margin: 10px;
      }
    }
    &-copy {
      text-align: center;
      padding: 10px 0 20px;
      color: #9ea7b4;
    }
  }

  .taglist-moving-animation-move {
    transition: transform .3s;
  }

  .logo-con {
    padding: 8px;
    text-align: center;
    img {
      height: 44px;
      width: auto;
    }
  }
</style>
