<template>
  <modal v-bind="options" :value="value"
         @on-ok="onOk" @on-cancel="onCancel"
         @on-visible-change="onVisibleChange">
    <template v-if="options.render">
      <render-component ref="content" :render="options.render"></render-component>
    </template>
    <template v-else>{{options.content}}</template>
    <template v-slot:footer>
      <i-button type="text" @click="onCancel()">{{options.cancelText || '取消'}}</i-button>
      <i-button type="primary" @click="onOk()">{{options.okText || '确认'}}</i-button>
    </template>
  </modal>
</template>

<script>
export default {
  data () {
    return {value: true}
  },
  props: {
    options: Object
  },
  async mounted () {
    const vm = this
    // 记录对话框打开前的焦点，销毁之后返还焦点
    vm.$options.$elActive = document.activeElement
    // 如果定义了 options.noFocus，则 Enter 键提交会被
    if (vm.options.supportEnter) {
      // 获取焦点，避免触发原有焦点上的事件
      vm.$el.tabIndex = 0
      vm.$el.focus()
      vm.$el.addEventListener('keydown', async e => {
        if (e.key === 'Enter') await vm.onOk()
      })
    }
  },
  async destroyed () {
    const vm = this
    // 销毁后返还焦点
    vm.$options.$elActive.focus()
  },
  methods: {
    async onOk () {
      const vm = this
      vm.options.onOk && await vm.options.onOk.apply(vm)
      if (!vm.options.loading) vm.close()
    },
    async onCancel () {
      const vm = this
      vm.options.onCancel && await vm.options.onCancel.apply(vm)
      if (!vm.options.loading) vm.close()
    },
    close () {
      const vm = this
      vm.$destroy()
      vm.$el.parentElement.removeChild(vm.$el)
    },
    async onVisibleChange (value) {
      const vm = this
      vm.options.onVisibleChange && await vm.options.onVisibleChange.apply(vm, [value])
    }
  }
}
</script>
