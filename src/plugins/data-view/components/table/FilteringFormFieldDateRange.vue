<script>
export default {
  name: 'FilteringFormFieldDateRange',
  props: {
    field: { type: Object },
    options: { type: Object }
  },
  data () {
    const vm = this
    const key = vm.options.key
    let value = vm.field.$view.query[key] || ''
    if (vm.options.refiner) value = vm.options.refiner(value)
    return {
      value,
      calendarProps: {
        type: 'daterange',
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
    return h('div', {
      style: {
        display: 'inline-block',
        'margin-right': '12px',
        'margin-bottom': '12px'
      }
    }, [
      h('label', {
        style: {
          'font-size': '12px'
        }
      }, this.field.final.label),
      h('date-picker', {
        style: {
          width: '220px'
        },
        props: vm.calendarProps,
        on: {
          async 'on-change' (data) {
            valGte = data[0]
            valLte = data[1]
            await vm.emitQuery(valGte, valLte)
          }
        }
      }, [])
    ])
    // return h('date-picker', {
    //   style: { marginLeft: '8px' },
    //   class: { collapsible: !hasQuery },
    //   props: vm.calendarProps,
    //   on: {
    //     async 'on-change' (data) {
    //       valGte = data[0]
    //       valLte = data[1]
    //     },
    //     async 'on-clear' () {
    //       vm.calendarProps.open = false
    //       vm.reset()
    //     },
    //     async 'on-ok' () {
    //       vm.calendarProps.open = false
    //       await vm.query(valGte, valLte)
    //     }
    //   }
    // }, [
    //   h('a', {
    //     on: {
    //       click () {
    //         vm.calendarProps.open = !vm.calendarProps.open
    //       }
    //     }
    //   }, [h('x-icon', {
    //     props: { name: 'fa fa-calendar' }
    //   })])
    // ])
  },
  methods: {
    async query (valGte, valLte) {
      const vm = this
      const [keyGte, keyLte] = vm.options.key
      const query = {}
      query[keyGte] = valGte
      query[keyLte] = valLte
      // ListViewTable 执行查询
      vm.field.$view.doQuery(query)
    },
    async emitQuery (valGte, valLte) {
      const [keyGte, keyLte] = this.options.key
      const query = {}
      query[keyGte] = valGte || null
      query[keyLte] = valLte || null
      console.log(query)
      // ListViewTable 执行查询
      this.$emit('query', query)
    }
  }
}
</script>
