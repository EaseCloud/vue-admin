<script>
  import FilteringHeaderKeyword from './FilteringHeaderKeyword.vue'
  import FilteringHeaderText from './FilteringHeaderText.vue'
  import FilteringHeaderSelect from './FilteringHeaderSelect.vue'
  import FilteringHeaderRange from './FilteringHeaderRange.vue'
  import FilteringHeaderDateRange from './FilteringHeaderDateRange.vue'
  import FilteringHeaderMultiSelect from './FilteringHeaderMultiSelect'

  export default {
    name: 'FilteringHeader',
    components: {
      FilteringHeaderKeyword,
      FilteringHeaderText,
      FilteringHeaderSelect,
      FilteringHeaderRange,
      FilteringHeaderMultiSelect
    },
    props: {
      field: {
        type: Object
      }
    },
    render (h) {
      const vm = this
      // 获取 filtering 选项参数，如果指定为字符串，自动撸成 keyword 类型
      const options = (typeof vm.field.final.filtering === 'string')
        ? { key: vm.field.final.filtering } : vm.field.final.filtering
      // 如果 filtering 为数组，则认为提供了连续多个筛选器，递归渲染
      if (options instanceof Array) {
        return h('div', {
          style: { display: 'inline-block' }
        }, options.map(opt => vm.renderWithFilteringOption(h, opt)))
      }
      // 否则直接返回单个渲染
      return vm.renderWithFilteringOption(h, options)
    },
    methods: {
      renderWithFilteringOption (h, opt) {
        // 单个渲染
        const vm = this
        if ((opt.type || 'keyword') === 'keyword') { // 关键词类型
          return h(FilteringHeaderKeyword, {
            props: { field: vm.field, options: opt }
          })
        } else if (opt.type === 'text') { // TODO: 嵌入文本框类型
          return h(FilteringHeaderText, {
            props: { field: vm.field, options: opt }
          })
        } else if (opt.type === 'select') { // 选项类型
          return h(FilteringHeaderSelect, {
            props: { field: vm.field, options: opt }
          })
        } else if (opt.type === 'range') { // 数字范围类型
          return h(FilteringHeaderRange, {
            props: { field: vm.field, options: opt }
          })
        } else if (opt.type === 'date-range') { // 日期范围类型
          return h(FilteringHeaderDateRange, {
            props: { field: vm.field, options: opt }
          })
        } else if (opt.type === 'multi-select') { // 多选类型
          return h(FilteringHeaderMultiSelect, {
            props: { field: vm.field, options: opt }
          })
        } else if (opt.type === 'render') { // 自定义
          return opt.render(h, {field: vm.field, options: opt})
        } else {
          console.error('未定义的 filtering 类型', vm.field)
          return h('div', '未定义的 filtering 类型')
        }
      }
    }
  }
</script>
