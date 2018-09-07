<template>
  <div :style="{background: bgColor}" class="ivu-shrinkable-menu" :class="{shrink:!!shrink}">
    <slot name="top"></slot>
    <div class="menu-container">
      <sidebar-menu
        v-show="!shrink"
        :menu-theme="theme"
        :menu-list="menuList"
        @on-open-change="$emit('on-open-change', $event)"
        @on-select="handleChange"></sidebar-menu>
      <sidebar-menu-shrink
        v-show="shrink"
        :menu-theme="theme"
        :menu-list="menuList"
        :icon-color="shrinkIconColor"
        @on-select="handleChange"></sidebar-menu-shrink>
    </div>
  </div>
</template>

<script>
  import _ from 'lodash'

  import SidebarMenu from './SidebarMenu.vue'
  import SidebarMenuShrink from './SidebarMenuShrink.vue'

  export default {
    name: 'ShrinkableMenu',
    components: {
      SidebarMenu,
      SidebarMenuShrink
    },
    props: {
      shrink: {
        type: Boolean,
        default: false
      },
      menuList: {
        type: Array,
        required: true
      },
      theme: {
        type: String,
        default: 'dark',
        validator (val) {
          return _.includes(['dark', 'light'], val)
        }
      }
    },
    computed: {
      bgColor () {
        return this.theme === 'dark' ? '#515A6E' : '#ffffff'
      },
      shrinkIconColor () {
        return this.theme === 'dark' ? '#ffffff' : '#515A6E'
      }
    },
    methods: {
      handleChange (menuName) {
        const vm = this
        vm.config.hooks.filter_before_menu_select(menuName).then(() => {
          // 默认情况下，通过菜单列表查找到对应的菜单项，并且跳转到 route 参数指定的路由目标
          // 如果没有 route 参数，跳转到名称为 name 的路由
          const menuItem = vm.getMenuItem(menuName)
          vm.$router.push(menuItem.route || { name: menuName })
        })
        vm.$emit('on-change', menuName)
      }
    }
  }
</script>

<style lang="less" scoped>
  .ivu-shrinkable-menu {
    height: 100%;
    position: relative;
    &.shrink {
      width: 60px;
    }
  }

  // 删除那条难看的右边框竖线
  .ivu-shrinkable-menu /deep/ .ivu-menu::after {
    display: none;
  }

  .menu-container {
    position: absolute;
    top: 60px;
    left: 0;
    right: 0;
    bottom: 0;
    overflow-y: auto;
    overflow-x: hidden;
  }
</style>
