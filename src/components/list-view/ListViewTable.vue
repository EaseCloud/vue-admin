<template>
  <div>
    <i-table :columns="columns"
             :size="size"
             :data="items">
    </i-table>
  </div>
</template>

<script>
  import defaults from './defaults'

  export default {
    name: 'ListViewTable',
    props: {
      model: { type: String, required: true },
      pk: { type: String, default: 'id' },
      cols: { type: Array, required: true },
      // 行级操作按钮
      actions: { type: Array, default: () => [] },
      // 页面级操作按钮
      listActions: { type: Array, default: () => [] },
      options: {
        type: Object,
        default: () => ({
          can_create: true,
          can_delete: true,
          can_edit: true,
          show_actions: true
        })
      },
      // TODO: 斟酌一下分页的传入用何种方式比较合适
      pager: {
        type: Object,
        default: () => ({
          page: 1,
          page_count: 1,
          page_size: 10
        })
      },
      filters: { type: Object, default: () => ({}) },
      // hooks: {
      //   type: Object
      // },
      size: {
        default: 'small',
        validator (value) {
          return ['large', 'default', 'small'].indexOf(value) > -1
        }
      }
    },
    data () {
      const vm = this
      return {
        items: [],
        // 选中的项目列表，主键 pk 的列表
        selectedItems: [],
        query: { ...vm.filters },
        total: 0
        // TODO: 改为 plugins 实现
        // preview_image: null
      }
    },
    computed: {
      hooks () {
        const vm = this
        return { ...defaults.hooks, ...(vm.$attrs.hooks || {}) }
      },
      columns () {
        const vm = this
        const columns = vm.cols.map(col => ({
          title: col.label,
          key: col.key
        }))
        if (vm.options.show_actions) {
          columns.push({
            title: '操作'
          })
        }
        return columns
      }
    },
    methods: {
      reload () {
        const vm = this
        // console.log(vm.hooks)
        vm.hooks.action_load_data.apply(vm).then(data => {
          const page = data.page
          const count = data.count
          const results = data.results
          vm.total = count
          // 整除：https://stackoverflow.com/a/4228528/2544762
          vm.pager.page_count = ~~(count / vm.pager.page_size)
          vm.pager.page = page
          const items = []
          Promise.all(results.map(
            (item, i) => {
              return vm.hooks.filter_item_before_render.apply(vm, [item]).then(item => {
                items[i] = item
              })
            }
          )).then(() => {
            // console.log(items)
            vm.items = items
          })
        })
      }
    }
  }
</script>

<style scoped>

</style>
