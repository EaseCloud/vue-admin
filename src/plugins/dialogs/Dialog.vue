<script>
  export default {
    props: {
      options: Object
    },
    render (h) {
      const vm = this
      return h('modal', {
        props: {
          title: vm.options.title,
          closable: vm.options.closable,
          maskClosable: vm.options.maskClosable,
          scrollable: vm.options.scrollable,
          fullscreen: vm.options.fullscreen,
          draggable: vm.options.draggable,
          mask: vm.options.mask,
          okText: vm.options.okText,
          cancelText: vm.options.cancelText,
          width: vm.options.width,
          footerHide: vm.options.footerHide,
          styles: vm.options.styles,
          className: vm.options.className,
          transitionNames: vm.options.transitionNames,
          transfer: vm.options.transfer,
          content: vm.options.content,
          value: true // 立即显示
        },
        on: {
          'on-ok': () => {
            vm.options.onOk && vm.options.onOk(...arguments)
            vm.value = false
            vm.close()
          },
          'on-cancel': () => {
            vm.options.onCancel && vm.options.onCancel(...arguments)
            vm.value = false
            vm.close()
          }
        }
      }, vm.options.render ? [vm.options.render(h)] : [vm.options.content])
    },
    methods: {
      close () {
        const vm = this
        vm.$destroy()
        vm.$el.parentElement.removeChild(vm.$el)
      }
    }
  }
</script>
