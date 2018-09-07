<template>
  <div class="menu-shrink">
    <div style="text-align: center;"
         v-for="(item, index) in menuList"
         :key="index">
      <dropdown transfer
                placement="right-start"
                :key="index"
                @on-click="$emit('on-select', $event)">
        <div class="menu-item"
             :style="{cursor:!!item.route&&'pointer'}"
             @click="item.route && $router.push(item.route)">
          <x-icon :width="60" :height="45" :size="20" :name="item.icon"></x-icon>
        </div>
        <dropdown-menu style="width: 200px;" slot="list"
                       v-if="item.children && item.children.length">
          <template v-for="(child, i) in (item.children || [])">
            <dropdown-item :name="child.name" :key="i">
              <x-icon :name="child.icon"></x-icon>
              <span style="padding-left:10px;">{{ utils.html.i18nText(child.title) }}</span>
            </dropdown-item>
          </template>
        </dropdown-menu>
      </dropdown>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'sidebarMenuShrink',
    props: {
      menuList: {
        type: Array
      },
      menuTheme: {
        type: String,
        default: 'dark'
      }
    }
  }
</script>

<style lang="less" scoped>
  .menu-shrink {
    color: rgba(255, 255, 255, 0.7);
  }

  .menu-item {
    &:hover {
      color: white;
      background: #363E4F;
    }
  }
</style>
