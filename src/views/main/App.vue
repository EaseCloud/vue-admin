<template>
  <div class="main" :class="{'main-hide-text': shrink}" v-if="me">
    <div class="sidebar-menu-con"
         :class="{dark: $store.state.app.menuTheme==='dark'}"
         :style="{width: shrink?'60px':'200px'}">
      <shrinkable-menu
        :shrink="shrink"
        :theme="$store.state.app.menuTheme"
        :menu-list="$store.state.app.menus">
        <div slot="top" class="logo-con">
          <template v-if="shrink">
            <img v-if="$root.config.logo_square"
                 :src="$root.config.logo_square"/>
            <img v-else
                 src="../../../assets/images/logo-min.jpg" key="min-logo"/>
          </template>
          <template v-else>
            <img v-if="$root.config.logo_wide"
                 :src="$root.config.logo_wide"/>
            <img v-else
                 src="../../../assets/images/logo.jpg" key="max-logo"/>
          </template>
        </div>
      </shrinkable-menu>
    </div>
    <div class="main-header-con" :style="{paddingLeft: shrink?'60px':'200px'}">
      <div class="main-header">
        <div class="navicon-con">
          <x-icon name="fa fa-bars" :size="24" :width="32" :height="32"
                  style="cursor: pointer;"
                  :style="{transform: 'rotateZ(' + (this.shrink ? '-90' : '0') + 'deg)'}"
                  @click="toggleClick"
          ></x-icon>
        </div>
        <div class="header-middle-con">
          <div class="main-breadcrumb">
            <breadcrumb-nav :currentPath="currentPath"></breadcrumb-nav>
          </div>
        </div>
        <div class="header-avatar-con">
          <!-- TODO: 升级 iView3.0 之后出现了很多不兼容问题，先隐藏 -->
          <!--<full-screen v-model="isFullScreen"></full-screen>-->
          <!--<lock-screen></lock-screen>-->
          <!--<message-tip v-model="$store.state.app.messageCount"></message-tip>-->
          <!--<theme-switch></theme-switch>-->

          <div class="user-dropdown-menu-con">
            <dropdown transfer trigger="click" @on-click="handleClickUserDropdown">
              <a href="javascript:void(0)">
                <span class="main-user-name">{{ currentUserName }}</span>
                <x-icon name="fa fa-caret-down" style="vertical-align: middle"></x-icon>
              </a>
              <dropdown-menu slot="list">
                <dropdown-item v-for="(action, i) in $root.config.main_actions"
                               :key="i"
                               v-if="finalizeSync(action.display)"
                               @click="action.action.apply(this)">
                  {{action.label}}
                </dropdown-item>
                <dropdown-item name="logout" :divided="$root.config.main_actions.length > 0">
                  退出登录
                </dropdown-item>
              </dropdown-menu>
            </dropdown>
            <avatar :src="currentUserAvatarUrl"
                    class="main-avatar"
                    style="margin-left: 10px;"></avatar>
          </div>
        </div>
      </div>
      <div class="tags-con">
        <tags-page-opened ref="tagsPageOpened"></tags-page-opened>
      </div>
    </div>
    <div class="single-page-con" :style="{left: shrink?'60px':'200px'}">
      <div class="single-page">
        <!-- TODO: 如果开启 keep-alive 尚未实现编辑之后能够列表页自动刷新，这里要细致处理好 -->
        <!-- TODO: 开了之后导致所有的内容无法更新，考虑上一个前进刷新后退不刷新 -->
        <!--<keep-alive>-->
        <router-view></router-view>
        <!--</keep-alive>-->
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
  // import Cookies from 'js-cookie'

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

  // TODO: 面包屑尚未实现
  export default {
    name: 'Main',
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
        isFullScreen: false
      }
    },
    computed: {
      currentPath () {
        return this.$store.state.app.currentPath // 当前面包屑数组
      },
      avatarPath () {
        // TODO: 根据业务实现
        return localStorage.avatarImgPath
      }
    },
    methods: {
      // ---- 已修复分割线 ----
      toggleClick () {
        this.shrink = !this.shrink
      },
      handleClickUserDropdown (name) {
        const vm = this
        if (name === 'ownSpace') {
          // TODO: 个人中心路由不能写死
          vm.openNewPage('ownspace_index')
          this.$router.push({
            name: 'ownspace_index'
          })
        } else if (name === 'logout') {
          vm.config.hooks.action_logout.apply(vm).then(() => {
            vm.$store.commit('logout')
            vm.$store.commit('setMenusOpened', [])
            vm.config.hooks.action_goto_login.apply(vm)
          })
        }
        // recoverClosedTag () {
        //   const vm = this
        //   let isTagClosed = !vm.$store.state.app.pagesOpened.some(item => item.name === name)
        //   // 解决关闭当前标签后再点击回退按钮会退到当前页时没有标签的问题
        //   if (isTagClosed) {
        //     vm.openNewPage(name, this.$route.params || {}, this.$route.query || {})
        //   }
        // },
      }
    },
    watch: {
      $route (to) {
        const vm = this
        // console.log('Caught inner $route hook', to)
        // vm.$store.commit('setCurrentPageName', to.name)
        // let pathArr = setCurrentPath(this, to.name)
        // if (pathArr.length > 2) {
        //   this.$store.commit('addOpenSubmenu', pathArr[1].name)
        // }
        vm.openPage(to)
        localStorage.currentPageName = to.name
      }
      // lang () {
      //   setCurrentPath(this, this.$route.name) // 在切换语言时用于刷新面包屑
      // },
    },
    async mounted () {
      const vm = this
      await vm.config.hooks.action_main_mounted.apply(vm)
      // 从 localStorage 中读取当前登录的用户
      vm.$store.commit('loadCurrentUser')
      // 初始化菜单
      await vm.reloadMenus()
      // 显示打开的页面的列表
      vm.$store.commit('loadPagesOpened')
      // 激活当前标签
      vm.openPage(vm.$route)

      // vm.currentPageName = this.$route.name
      // vm.$store.commit('initPageList')
      // vm.$store.commit('initCachepage')
      // TODO: 检测 Vue-admin 框架升级提示
      // util.checkUpdate(this)

      // ---- 已修复分割线 ----
      // let pathArr = setCurrentPath(this, this.$route.name)
      // if (pathArr.length >= 2) {
      //   this.$store.commit('addOpenSubmenu', pathArr[1].name)
      // }
      // vm.recoverClosedTag()
      // vm.$store.commit('setMessageCount', 3)
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
      background: white;
      &.dark {
        background: #515A6E
      }
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
        margin: 14px;
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
      .header-avatar-con {
        position: absolute;
        right: 0;
        top: 0;
        height: 100%;
        width: auto;
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
            height: 32px;
            margin: 14px 10px;
            .main-user-name {
              display: inline-block;
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
    height: 44px;
    box-sizing: content-box;
    text-align: center;
    img {
      display: block;
      margin: auto;
      max-width: 100%;
      max-height: 100%;
    }
  }
</style>

<style scoped>
  .main-avatar {
    background: white 50% 50% url(../../../assets/images/avatar-default.png) no-repeat;
    background-size: cover;
  }
</style>
