<script>
  export default {
    name: 'FilteringHeaderRange',
    props: {
      field: { type: Object },
      options: { type: Object }
    },
    render (h) {
      const vm = this
      const [keyGte, keyLte] = vm.options.key
      const valGte = vm.field.$view.query[keyGte] === void 0
        ? void 0 : Number(vm.field.$view.query[keyGte])
      const valLte = vm.field.$view.query[keyLte] === void 0
        ? void 0 : Number(vm.field.$view.query[keyLte])

      if (valGte !== void 0 || valLte !== void 0) {
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
        }, valGte === void 0 ? `≤ ${valLte}` : valLte === void 0 ? `≥ ${valGte}` : `${valGte}~${valLte}`)
      } else {
        return h('a', {
          style: { marginLeft: '8px' },
          class: { collapsible: true },
          on: {
            async click () {
              await vm.query(valGte, valLte)
            }
          }
        }, [
          h('icon', {
            props: { type: 'ios-code' }
          })
        ])
      }
    },
    methods: {
      async query (valGte, valLte) {
        const vm = this
        const [keyGte, keyLte] = vm.options.key
        let { gte, lte } = await vm.modalForm({
          fields: [{
            key: 'gte',
            label: '大于',
            type: 'number',
            placeholder: '不限',
            default: valGte === void 0 ? null : valGte
          }, {
            key: 'lte',
            label: '小于',
            type: 'number',
            placeholder: '不限',
            default: valLte === void 0 ? null : valLte
          }]
        }, {
          title: '根据数值范围筛选'
        })
        const query = {}
        if (gte !== null) query[keyGte] = Number(gte)
        if (lte !== null) query[keyLte] = Number(lte)
        // ListViewTable 执行查询
        vm.field.$view.doQuery(query)
      },
      async reset () {
        const vm = this
        const [keyGte, keyLte] = vm.options.key
        // ListViewTable 执行查询
        vm.field.$view.doQuery({ [keyGte]: null, [keyLte]: null })
      }
    }
  }
</script>
