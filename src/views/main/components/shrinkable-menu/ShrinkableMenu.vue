<template>
  <div :style="{background: bgColor}" class="ivu-shrinkable-menu">
    <slot name="top"></slot>
    <sidebar-menu
      v-show="!shrink"
      :menu-theme="theme"
      :menu-list="menuList"
      :open-names="openNames"
      @on-change="handleChange"
    ></sidebar-menu>
    <sidebar-menu-shrink
      v-show="shrink"
      :menu-theme="theme"
      :menu-list="menuList"
      :icon-color="shrinkIconColor"
      @on-change="handleChange"
    ></sidebar-menu-shrink>
  </div>
</template>

<script>
  import _ from 'lodash'

  // import functions from './functions'
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
      },
      beforePush: {
        type: Function
      },
      openNames: {
        type: Array
      }
    },
    computed: {
      bgColor () {
        return this.theme === 'dark' ? '#495060' : '#fff'
      },
      shrinkIconColor () {
        return this.theme === 'dark' ? '#fff' : '#495060'
      }
    },
    methods: {
      handleChange (name) {
        let willpush = true
        if (this.beforePush !== undefined) {
          if (!this.beforePush(name)) {
            willpush = false
          }
        }
        if (willpush) {
          this.$router.push({
            name: name
          })
        }
        this.$emit('on-change', name)
      }
    }
  }
</script>

<style lang="less">
  .ivu-shrinkable-menu {
    height: 100%;
    width: 100%;
  }
</style>
