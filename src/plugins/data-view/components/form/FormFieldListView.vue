<template>
  <div class="field-item field-item-list-view"
       :style="{width: field.final.width || 'auto'}">
    <list-view-table v-if="initialized"
                     ref="view"
                     @input="$emit('input', $event)"
                     v-bind="field.listViewOptions"></list-view-table>
  </div>
</template>

<script>
export default {
  name: 'FormFieldListView',
  data () {
    return {
      initialized: false
    }
  },
  props: {
    field: {
      type: Object,
      default: () => {
      }
    }
  },
  async mounted () {
    const vm = this
    vm.field.$el = this
    // 将刷新方法绑定到字段上
    vm.field.refresh = this.refresh()
    // 默认情况下要显示分页器
    if (vm.evaluate(vm.field.listViewOptions, 'options.show_pager') === void 0) {
      vm.setProperty(vm.field.listViewOptions, 'options.show_pager', true)
    }
    // 将当前的 field 绑定到 view 上，使得内部可以访问到
    if (!vm.field.listViewOptions) vm.field.listViewOptions.options = {}
    vm.field.listViewOptions.options.field = vm.field
    // 处理完毕执行渲染
    vm.initialized = true
  },
  methods: {
    async refresh () {
      const vm = this
      const $view = await vm.waitFor(vm.$refs, 'view')
      $view.reload()
    }
  }
}
</script>
