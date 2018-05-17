<template>
  <edit-view v-bind="editViewOptions"></edit-view>
</template>

<script>
  export default {
    data () {
      // const vm = this
      return {
        editViewOptions: {
          model: 'user',
          fields: [{
            type: 'label',
            key: 'id',
            label: 'ID',
            display: field => !!field.value
          }, {
            key: 'username',
            label: '用户名',
            required: true,
            readonly: field => !!field.context.item.id
          }, {
            key: 'mobile',
            label: '手机',
            required: true
          }, {
            key: 'email',
            label: '电子邮箱',
            required: true
            // }, {
            //   key: 'is_active',
            //   label: '可用',
            //   type: 'switch'
          }],
          hooks: {}
        }
      }
    }
  }
</script>
