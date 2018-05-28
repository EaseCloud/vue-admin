<template>
  <div>
    <template v-for="(item, index) in menuList">
      <div style="text-align: center;" :key="index">
        <dropdown transfer
                  placement="right-start"
                  :key="index"
                  @on-click="$emit('on-select', $event)">
          <i-button style="width: 70px;margin-left: -5px;padding:10px 0;"
                    type="text">
            <icon :size="20" :color="iconColor" :type="item.icon"></icon>
          </i-button>
          <dropdown-menu style="width: 200px;" slot="list" v-if="item.children && item.children.length">
            <template v-for="(child, i) in (item.children || [])">
              <dropdown-item :name="child.name" :key="i">
                <icon :type="child.icon"></icon>
                <span style="padding-left:10px;">{{ utils.html.i18nText(child.title) }}</span>
              </dropdown-item>
            </template>
          </dropdown-menu>
        </dropdown>
      </div>
    </template>
  </div>
</template>

<script>
  export default {
    name: 'sidebarMenuShrink',
    props: {
      menuList: {
        type: Array
      },
      iconColor: {
        type: String,
        default: 'white'
      },
      menuTheme: {
        type: String,
        default: 'dark'
      }
    }
  }
</script>
