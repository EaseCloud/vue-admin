<script>
  export default {
    name: 'FilteringHeaderDateRange',
    props: {
      field: { type: Object },
      options: { type: Object }
    },
    data () {
      const vm = this
      return {
        calendarProps: {
          open: false,
          type: vm.options.showTime ? 'datetimerange' : 'daterange',
          // 支持覆盖 iview calendar 属性
          ...(vm.options.calendarOptions || {
            size: 'small',
            confirm: true,
            clearable: false,
            // placement: 'bottom',
            transfer: true
          })
        }
      }
    },
    render (h) {
      const vm = this
      const [keyGte, keyLte] = vm.options.key
      let valGte = vm.field.$view.query[keyGte]
      let valLte = vm.field.$view.query[keyLte]
      const hasQuery = valGte !== void 0 || valLte !== void 0
      return h('date-picker', {
        style: { marginLeft: '8px' },
        class: { collapsible: !hasQuery },
        props: {
          value: [valGte, valLte],
          ...vm.calendarProps
        },
        on: {
          async 'on-change' (data) {
            valGte = data[0]
            valLte = data[1]
          },
          async 'on-clear' () {
            vm.calendarProps.open = false
            vm.reset()
          },
          async 'on-ok' () {
            vm.calendarProps.open = false
            await vm.query(valGte, valLte)
          }
        }
      }, [
        h('a', {
          on: {
            click () {
              vm.calendarProps.open = !vm.calendarProps.open
            }
          }
        }, [h('x-icon', {
          props: { name: 'fa fa-calendar' }
        })])
      ])
    },
    methods: {
      async query (valGte, valLte) {
        const vm = this
        const [keyGte, keyLte] = vm.options.key
        const query = {}
        query[keyGte] = valGte
        query[keyLte] = valLte
        // 字段修改的拦截钩子
        if (vm.options.onChange) await vm.options.onChange(query)
        // ListViewTable 执行查询
        await vm.field.$view.doQuery(query)
      },
      async reset () {
        const vm = this
        const [keyGte, keyLte] = vm.options.key
        const query = { [keyGte]: null, [keyLte]: null }
        // 字段修改的拦截钩子
        if (vm.options.onChange) await vm.options.onChange(query)
        // ListViewTable 执行查询
        await vm.field.$view.doQuery(query)
      }
    }
  }
</script>
