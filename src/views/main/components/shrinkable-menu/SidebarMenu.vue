<template>
  <i-menu ref="sideMenu"
          :active-name="$route.name"
          :theme="menuTheme"
          :open-names="$store.state.app.menusOpened"
          width="auto"
          @on-open-change="$store.commit('setMenusOpened', $event); $emit('on-open-change', $event)"
          @on-select="$emit('on-select', $event)">
    <template v-for="item in menuList">
      <submenu v-if="item.children && item.children.length"
               :name="item.name"
               :key="item.name">
        <template slot="title">
          <icon :type="item.icon"
                :size="iconSize"></icon>
          <span class="layout-text">{{ utils.html.i18nText(item.title) }}</span>
        </template>
        <template v-for="child in item.children">
          <menu-item :name="child.name"
                     :key="'menuitem' + child.name">
            <icon :type="child.icon"
                  :size="iconSize"
                  :key="'icon' + child.name"></icon>
            <span class="layout-text"
                  :key="'title' + child.name">{{ utils.html.i18nText(child.title) }}</span>
          </menu-item>
        </template>
      </submenu>
      <menu-item v-else
                 :name="item.name"
                 :key="'menuitem' + item.name">
        <icon :type="item.icon"
              :size="iconSize"
              :key="'menuicon' + item.name"></icon>
        <span class="layout-text"
              :key="'title' + item.name">{{ utils.html.i18nText(item.title) }}</span>
      </menu-item>
    </template>
  </i-menu>
</template>

<script>
  export default {
    name: 'sidebarMenu',
    props: {
      menuList: Array,
      iconSize: Number,
      menuTheme: {
        type: String,
        default: 'dark'
      }
    },
    updated () {
      this.$nextTick(() => {
        if (this.$refs.sideMenu) {
          this.$refs.sideMenu.updateOpened()
        }
      })
    }
  }
</script>
