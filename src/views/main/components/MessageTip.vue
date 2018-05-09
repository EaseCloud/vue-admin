<template>
  <div @click="showMessage" class="message-con">
    <tooltip :content="value > 0 ? '有' + value + '条未读消息' : '无未读消息'" placement="bottom">
      <badge :count="value" dot>
        <icon type="ios-bell" :size="22"></icon>
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
        vm.utils.app.openNewPage(vm, 'message_index')
        vm.$router.push({
          name: 'message_index'
        })
      }
    }
  }
</script>
