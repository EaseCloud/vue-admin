<template>
  <div class="field-item field-item-multi-object"
       :style="{width: field.final.width || '100%'}">
    <list-view-table @input="$emit('input', $event)"
                     :model="field.listViewOptions.model"
                     :fields="field.listViewOptions.fields"
                     :options="displayListOptions()"
                     :hooks="displayListHooks()"
                     :list-actions="field.listViewOptions.listActions"
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
    const pk = vm.field.listViewOptions.pk || 'id'
    return {
      displayListActions: [{
        // TODO: 如果 id 号有重复的情况下上下移动按钮会出BUG
        display: x => x && vm.field.value.indexOf(x[pk]) > 0,
        label: '↑',
        action (item) {
          const index = vm.field.value.indexOf(item[pk])
          vm.field.value[index] = vm.field.value[index - 1]
          vm.field.value[index - 1] = item[pk]
          vm.$emit('input', vm.field.value)
          vm.$refs.table.reload()
        }
      }, {
        // TODO: 如果 id 号有重复的情况下上下移动按钮会出BUG
        display: x => x && vm.field.value.indexOf(x[pk]) < vm.field.value.length - 1,
        label: '↓',
        action (item) {
          const index = vm.field.value.indexOf(item[pk])
          vm.field.value[index] = vm.field.value[index + 1]
          vm.field.value[index + 1] = item[pk]
          vm.$emit('input', vm.field.value)
          vm.$refs.table.reload()
        }
      }, {
        label: '×',
        buttonType: 'dashed',
        action (item) {
          // TODO: 如果 id 号有重复的情况下上下移动按钮会出BUG
          const index = vm.field.value.indexOf(item[pk])
          vm.field.value.splice(index, 1)
          vm.$emit('input', vm.field.value)
          vm.$refs.table.reload()
        }
      }]
    }
  },
  async created () {
    const vm = this
    // 将当前的 field 绑定到 view 上，使得内部可以访问到
    if (!vm.field.listViewOptions) vm.field.listViewOptions.options = {}
    vm.field.listViewOptions.options.field = vm.field
  },
  mounted () {
    const vm = this
    vm.field.$el = this
  },
  methods: {
    async reload () {
      const vm = this
      if (vm.$refs.table) await vm.$refs.table.reload()
    },
    displayListHooks () {
      const vm = this
      const hooks = {...(vm.field.listViewOptions.hooks || {})}
      hooks.action_load_data = async function () {
        // 默认情况下使用 id 列表获取
        const results = []
        const ids = vm.field.value || []
        await Promise.all(ids.map(async (id, i) => {
          results[i] = await vm.config.hooks.action_model_get_item.apply(
            vm, [vm.field.listViewOptions.model, id])
        }))
        return {page: 1, count: results.length, results}
      }
      return hooks
    },
    displayListOptions () {
      const vm = this
      return {
        can_delete: false,
        action_column_width: 180,
        action_column_render_header (h) {
          return h('i-button', {
            props: {
              size: 'small',
              type: 'info'
            },
            on: {
              async click () {
                const value = vm.field.value || []
                const ids = []
                if (vm.field.actionAddItem) {
                  ids.splice(0, 0, ...await vm.field.actionAddItem.apply(vm))
                } else {
                  const item = await vm.pickObject(
                    vm.modalListViewOptions(await vm.finalize(vm.field.filterAddItem, vm.field)), vm.field.modalOptions || {}
                  ).catch(() => 0)
                  if (!item) return
                  ids.push(item[vm.field.listViewOptions.pk || 'id'])
                }
                vm.$emit('input', vm._.union(value, ids))
                vm.$refs.table.reload()
              }
            }
          }, '添加')
        },
        ...(vm.field.listViewOptions.options || {})
      }
    },
    modalListViewOptions (filters) {
      const vm = this
      const options = {
        ...vm.field.listViewOptions,
        options: {
          ...(vm.field.listViewOptions.options || {}),
          can_edit: false,
          can_delete: false
        },
      }
      if (filters) {
        options.filters = filters
      } else {
        // 选的时候还要排除重复项
        options.filters = options.filters || {}
        options.filters['!pk__in'] = (vm.field.value || []).map(x => x.toString()).join(',')
        options.actions = []
      }
      return options
    }
  }
}
</script>
