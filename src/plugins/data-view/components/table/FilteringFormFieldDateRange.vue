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

    // const hasQuery = valGte !== void 0 || valLte !== void 0
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
        props: {
          ...vm.calendarProps,
          value: [valGte, valLte]
        },
        on: {
          async 'on-change' (data) {
            valGte = data[0]
            valLte = data[1]
            await vm.emitQuery(valGte, valLte)
          }
        }
      }, [])
    ])
  },
  methods: {
    async query (valGte, valLte) {
      const vm = this
      const [keyGte, keyLte] = vm.options.key
      const query = {}
      query[keyGte] = valGte
      query[keyLte] = valLte
      // ListViewTable 执行查询
      await vm.field.$view.doQuery(query)
    },
    async emitQuery (valGte, valLte) {
      const vm = this
      const [keyGte, keyLte] = vm.options.key
      const query = {}
      query[keyGte] = valGte || null
      query[keyLte] = valLte || null
      // console.log(query)
      // ListViewTable 执行查询
      await vm.$emit('query', query)
    }
  }
}
</script>
