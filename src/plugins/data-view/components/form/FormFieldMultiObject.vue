<template>
  <div class="field-item field-item-multi-object"
       :style="{width: field.final.width || 'auto'}">
    <list-view-table @input="$emit('input', $event)"
                     :model="field.listViewOptions.model"
                     :fields="field.listViewOptions.fields"
                     :options="displayListOptions()"
                     :hooks="displayListHooks()"
                     :actions="displayListActions"
                     ref="table"
    ></list-view-table>
  </div>
</template>

<script>
  export default {
    name: 'FormFieldMultiObject',
    props: {
      field: {
        type: Object,
        default: () => {
        }
      }
    },
    data () {
      const vm = this
      return {
        displayListActions: [{
          buttonIcon: 'minus',
          buttonShape: 'circle',
          action (item) {
            const index = vm.field.value.indexOf(item.id)
            vm.field.value.splice(index, 1)
            vm.$emit('input', vm.field.value)
            vm.$refs.table.reload()
          }
        }, {
          buttonIcon: 'chevron-up',
          buttonShape: 'circle',
          display: x => vm.field.value.indexOf(x.id) > 0,
          action (item) {
            const index = vm.field.value.indexOf(item.id)
            vm.field.value[index] = vm.field.value[index - 1]
            vm.field.value[index - 1] = item.id
            vm.$emit('input', vm.field.value)
            vm.$refs.table.reload()
          }
        }, {
          buttonIcon: 'chevron-down',
          buttonShape: 'circle',
          display: x => vm.field.value.indexOf(x.id) < vm.field.value.length - 1,
          action (item) {
            const index = vm.field.value.indexOf(item.id)
            vm.field.value[index] = vm.field.value[index + 1]
            vm.field.value[index + 1] = item.id
            vm.$emit('input', vm.field.value)
            vm.$refs.table.reload()
          }
        }]
      }
    },
    mounted () {
      const vm = this
      vm.field.$el = this
    },
    methods: {
      async reload () {
        const vm = this
        if (vm.$refs.table) vm.$refs.table.reload()
      },
      displayListHooks () {
        const vm = this
        const hooks = { ...(vm.field.listViewOptions.hooks || {}) }
        hooks.action_load_data = async function () {
          // 默认情况下使用 id 列表获取
          const results = []
          const ids = vm.field.value || []
          await Promise.all(ids.map(async (id, i) => {
            results[i] = await vm.config.hooks.action_model_get_item.apply(
              vm, [vm.field.listViewOptions.model, id])
          }))
          return { page: 1, count: results.length, results }
        }
        return hooks
      },
      displayListOptions () {
        const vm = this
        const options = { ...(vm.field.listViewOptions.options || {}) }
        options.can_edit = false
        options.can_delete = false
        options.action_column_render_header = (h) => {
          return h('i-button', {
            props: {
              size: 'small',
              type: 'info',
              shape: 'circle',
              icon: 'plus'
            },
            on: {
              async click () {
                const value = vm.field.value || []
                vm.item = await vm.pickObject(vm.modalListViewOptions(), vm.field.modalOptions || {})
                value.push(vm.item[vm.field.listViewOptions.pk || 'id'])
                vm.$emit('input', value)
                vm.$refs.table.reload()
              }
            }
          })
        }
        return options
      },
      modalListViewOptions () {
        const vm = this
        const options = { ...(vm.field.listViewOptions.options || {}) }
        options.can_edit = false
        options.can_delete = false
        return { ...vm.field.listViewOptions, options }
      }
    }
  }
</script>
