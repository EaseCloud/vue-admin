<template>
  <render-component v-if="renderFunction" :render="renderFunction"></render-component>
</template>
<script>
  export default {
    name: 'FormFieldRender',
    props: {
      field: {
        type: Object,
        default: () => ({
          async renderData (field, item, data) {
            return [field, item, data]
          },
          render (h) {
            return h('div', '请在 field 中实现 render(h, field, item, data) 方法')
          }
        })
      }
    },
    data () {
      return {
        component: null,
        data: [],
        renderFunction: null
      }
    },
    async mounted () {
      const vm = this
      vm.field.$el = this
      let renderData = [vm.field, vm.field.context.item, vm.data]
      if (vm.field.renderData) {
        renderData = await vm.field.renderData(vm.field, vm.field.context.item, vm.data)
      }
      vm.renderFunction = function (h) {
        const component = vm.field.render.apply(vm, [h, ...renderData])
        vm.waitFor(component, 'componentInstance').then(componentInstance => {
          vm.field.component = componentInstance
        })
        return component
      }
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
