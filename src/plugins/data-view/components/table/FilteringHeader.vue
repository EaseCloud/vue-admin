<script>
  import FilteringHeaderKeyword from './FilteringHeaderKeyword.vue'
  import FilteringHeaderSelect from './FilteringHeaderSelect.vue'
  import FilteringHeaderRange from './FilteringHeaderRange.vue'
  import FilteringHeaderDateRange from './FilteringHeaderDateRange.vue'

  export default {
    name: 'FilteringHeader',
    components: {
      FilteringHeaderKeyword,
      FilteringHeaderSelect,
      FilteringHeaderRange
    },
    props: {
      field: {
        type: Object
      }
    },
    render (h) {
      const vm = this
      // 获取 filtering 选项参数，如果指定为字符串，自动撸成 keyword 类型
      const options = (typeof vm.field.filtering === 'string')
        ? { key: vm.field.filtering } : vm.field.filtering
      if ((options.type || 'keyword') === 'keyword') { // 关键词类型
        return h(FilteringHeaderKeyword, {
          props: { field: vm.field, options }
        })
      } else if (options.type === 'select') { // 选项类型
        return h(FilteringHeaderSelect, {
          props: { field: vm.field, options }
        })
      } else if (options.type === 'range') { // 数字范围类型
        return h(FilteringHeaderRange, {
          props: { field: vm.field, options }
        })
      } else if (options.type === 'date-range') { // 日期范围类型
        return h(FilteringHeaderDateRange, {
          props: { field: vm.field, options }
        })
      } else {
        console.error('未定义的 filtering 类型', vm.field)
        return h('div', '未定义的 filtering 类型')
      }
    }
  }
</script>
