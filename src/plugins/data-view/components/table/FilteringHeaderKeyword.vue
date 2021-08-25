<script>
export default {
  name: 'FilteringHeaderKeyword',
  props: {
    field: { type: Object },
    options: { type: Object }
  },
  render (h) {
    const vm = this
    const key = vm.options.key
    let value = vm.field.$view.query[key] || ''
    if (vm.options.refiner) value = vm.options.refiner(value)

    if (value) {
      return h('tag', {
        style: { marginLeft: '8px' },
        props: {
          closable: true,
          color: '#CCCCCC',
          fade: false
        },
        on: {
          'on-close': vm.reset
        }
      }, value)
    } else {
      return h('a', {
        style: { marginLeft: '8px' },
        class: { collapsible: true },
        on: {
          async click () {
            await vm.query(value)
          }
        }
      }, [
        h('x-icon', {
          props: { name: 'fa fa-filter' }
        })
      ])
    }
  },
  methods: {
    async query (value) {
      const vm = this
      const key = vm.options.key
      let text = await vm.$prompt('请输入关键词', {
        title: '根据关键词过滤',
        defaultValue: value
      }).catch(() => 0)
      if (vm.options.mapper) text = await vm.options.mapper.apply(vm, [text])
      const query = { [key]: text }
      // 字段修改的拦截钩子
      if (vm.options.onChange) await vm.options.onChange(query)
      // ListViewTable 执行查询
      if (text) await vm.field.$view.doQuery(query)
    },
    async reset () {
      const vm = this
      const key = vm.options.key
      const query = { [key]: null }
      // 字段修改的拦截钩子
      if (vm.options.onChange) await vm.options.onChange(query)
      // ListViewTable 执行查询
      await vm.field.$view.doQuery(query)
    }
  }
}
</script>
