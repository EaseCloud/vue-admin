<script>
  export default {
    name: 'FormFieldRender',
    props: {
      value: {},
      field: {
        type: Object,
        default: () => {
        }
      }
    },
    data () {
      return {
        data: []
      }
    },
    render (h) {
      const vm = this
      return vm.field.render(h, vm.field, vm.field.context.item, vm.data)
    },
    methods: {
      async reload () {
        const vm = this
        vm.data = await vm.field.renderData(vm.field, vm.field.context.item)
        // vm.$forceUpdate()
      }
    }
  }
</script>
