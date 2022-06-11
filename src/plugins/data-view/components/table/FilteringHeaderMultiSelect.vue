<script>
export default {
  name: 'FilteringHeaderMultiSelect',
  props: {
    field: { type: Object },
    options: { type: Object }
  },
  data () {
    return {
      selectValue: []
    }
  },
  render (h) {
    const vm = this
    const key = vm.options.key
    let value = vm.field.$view.query[key] || ''
    value = String(value)
    if (vm.options.refiner) value = vm.options.refiner(value)

    if (value) {
      return h('tag', {
        style: { marginLeft: '4px' },
        props: {
          closable: true,
          color: '#CCCCCC',
          fade: false
        },
        on: {
          'on-close': vm.reset
        }
      }, `选中${value.split(',').length}个`)
    } else {
      return h('a', {
        on: {
          click: vm.multiSelect
        }
      }, [
        h('x-icon', {
          props: {name: 'fa fa-ellipsis-h'}
        })
      ])
    }
  },
  methods: {
    async query () {
      const vm = this
      const key = vm.options.key
      let value = vm.selectValue.join(',')
      value = vm.options.filter ? await vm.options.filter(value) : value
      const query = {[key]: value}
      // 字段修改的拦截钩子
      if (vm.options.onChange) await vm.options.onChange(query)
      // ListViewTable 执行查询
      await vm.field.$view.doQuery(query)
    },
    async reset () {
      const vm = this
      const key = vm.options.key
      vm.selectValue = []
      const query = {[key]: null}
      // 字段修改的拦截钩子
      if (vm.options.onChange) await vm.options.onChange(query)
      // ListViewTable 执行查询
      await vm.field.$view.doQuery(query)
    },
    async multiSelect () {
      const vm = this
      await vm.openDialog({
        title: '请选择',
        width: 300,
        onOk: async () => {
          await vm.query()
        },
        render (h) {
          return h('Select', {
            props: {
              multiple: true,
              filterable: true,
              value: vm.selectValue
            },
            on: {
              input: (value) => {
                vm.selectValue = value
              }
            }
          }, vm.options.choices.map(choice => h('Option', {
            props: {
              value: choice.value
            }
          }, choice.text)))
        }
      })
    }
  }
}
</script>
