<template>
  <div @click="showMessage" class="message-con">
    <tooltip :content="value > 0 ? '有' + value + '条未读消息' : '无未读消息'" placement="bottom">
      <badge :count="value" dot>
        <x-icon name="fa fa-bell" :size="22"></x-icon>
      </badge>
    </tooltip>
  </div>
</template>

<script>
  export default {
    name: 'MessageTip',
    props: {
      value: {
        type: Number,
        default: 0
      }
    },
    methods: {
      showMessage () {
        const vm = this
        // TODO: 消息中心路由不能写死
        vm.utils.app.openNewPage('message_index')
        vm.$router.push({
          name: 'message_index'
        })
      }
    }
  }
</script>
