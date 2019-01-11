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
    mounted () {
      const vm = this
      vm.field.$el = this
      // 默认情况下要显示分页器
      if (vm.evaluate(vm.field.listViewOptions, 'options.show_pager') === void 0) {
        vm.setProperty(vm.field.listViewOptions, 'options.show_pager', true)
      }
      vm.initialized = true
    },
    methods: {
      refresh () {
        const vm = this
        vm.$refs.view.reload()
      }
    }
  }
</script>
