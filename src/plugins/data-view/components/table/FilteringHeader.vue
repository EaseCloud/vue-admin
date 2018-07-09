<script>
  import FilteringHeaderKeyword from './FilteringHeaderKeyword.vue'

  export default {
    name: 'FilteringHeader',
    components: {
      FilteringHeaderKeyword
    },
    props: {
      field: {
        type: Object
      }
    },
    render (h) {
      const vm = this
      const options = (typeof vm.field.filtering === 'string')
        ? { key: vm.field.filtering } : vm.field.filtering
      if ((options.type || 'keyword') === 'keyword') {
        // 关键词类型
        return h(FilteringHeaderKeyword, {
          props: { field: vm.field, options }
        })
      } else {
        console.error('未定义的 filtering 类型', vm.field)
        return h('div', '未定义的 filtering 类型')
      }
    }
  }
</script>
