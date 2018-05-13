<template>
  <list-view v-bind="listViewOptions"></list-view>
</template>

<script>
  export default {
    data () {
      const vm = this
      return {
        listViewOptions: {
          model: 'user',
          cols: [{
            key: 'id',
            label: 'ID'
          }, {
            key: 'username',
            label: '用户名'
          }, {
            key: 'email',
            label: '电子邮箱'
          }, {
            key: 'is_active',
            label: '电子邮箱'
          }],
          hooks: {
            filter_item_before_render (item) {
              // console.log(item)
              return Promise.resolve(item)
            },
            action_load_data () {
              return vm.api('user').get({ action: 'fuck' }).then(resp => ({
                page: 1,
                count: resp.data.count,
                results: resp.data.results
              }))
              // return Promise.resolve({
              //   page: 1,
              //   count: 999,
              //   results: [{
              //     id: 1,
              //     username: 'zhangsan',
              //     email: '12345@163.com'
              //   }]
              // })
            }
          }
        }
      }
    }
  }
</script>
