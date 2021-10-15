<template xmlns:v-slot="http://www.w3.org/1999/xhtml">
  <modal v-bind="options" :value="value" @on-visible-change="onVisibleChange">
    <template v-if="options.render">
      <render-component :render="options.render"></render-component>
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
    // render (h) {
    //   const vm = this
    //   const contents = vm.options.render ? [vm.options.render(h)] : [vm.options.content]
    //   return h('modal', {
    //     props: {
    //       title: vm.options.title,
    //       closable: vm.options.closable,
    //       maskClosable: vm.options.maskClosable,
    //       scrollable: vm.options.scrollable,
    //       fullscreen: vm.options.fullscreen,
    //       draggable: vm.options.draggable,
    //       mask: vm.options.mask,
    //       okText: vm.options.okText,
    //       cancelText: vm.options.cancelText,
    //       width: vm.options.width,
    //       footerHide: vm.options.footerHide,
    //       styles: vm.options.styles,
    //       className: vm.options.className,
    //       transitionNames: vm.options.transitionNames,
    //       transfer: vm.options.transfer,
    //       content: vm.options.content,
    //       value: true // 立即显示
    //     },
    //     on: {
    //       'on-ok': () => {
    //         vm.options.onOk && vm.options.onOk(...arguments)
    //         vm.value = false
    //         vm.close()
    //       },
    //       'on-cancel': () => {
    //         vm.options.onCancel && vm.options.onCancel(...arguments)
    //         vm.value = false
    //         vm.close()
    //       }
    //     }
    //   }, [...contents])
    //   // TODO: 这个地方，on-ok 是刹不了车的，
    // },
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
