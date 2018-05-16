<template>
  <list-view v-bind="listViewOptions"></list-view>
</template>

<script>
  export default {
    data () {
      // const vm = this
      return {
        listViewOptions: {
          model: 'user',
          fields: [{
            key: 'id',
            label: 'ID'
          }, {
            key: 'username',
            type: 'html',
            label: '用户名'
          }, {
            key: 'email',
            label: '电子邮箱'
          // }, {
          //   key: 'is_active',
          //   label: '可用',
          //   type: 'switch'
          }],
          hooks: {
            filter_item_before_render (item) {
              // console.log(item)
              return Promise.resolve(item)
            }
          }
        }
      }
    }
  }
</script>
