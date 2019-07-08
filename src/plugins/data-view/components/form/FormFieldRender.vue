<script>
  export default {
    name: 'FormFieldRender',
    props: {
      field: {
        type: Object,
        default: () => {
        }
      }
    },
    data () {
      return {
        component: null,
        data: []
      }
    },
    render (h) {
      const vm = this
      const component = vm.field.render(h, vm.field, vm.field.context.item, vm.data)
      vm.waitFor(component, 'componentInstance').then(componentInstance => {
        vm.field.component = componentInstance
      })
      return component
    },
    mounted () {
      const vm = this
      vm.field.$el = this
    },
    methods: {
      async reload () {
        const vm = this
        vm.data = vm.field.renderData
          ? await vm.field.renderData(vm.field, vm.field.context.item)
          : vm.field.context.item
      }
    }
  }
</script>
