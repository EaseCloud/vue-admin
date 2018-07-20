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
      const valGte = vm.$route.query[keyGte]
      const valLte = vm.$route.query[keyLte]

      if (valGte !== void 0 || valLte !== void 0) {
        return h('tag', {
          style: { marginLeft: '8px' },
          props: {
            closable: true,
            color: 'blue',
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
            props: { type: 'code' }
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
            default: valGte || ''
          }, {
            key: 'lte',
            label: '小于',
            type: 'number',
            placeholder: '不限',
            default: valLte || ''
          }]
        }, {
          title: '根据数值范围筛选'
        })
        const query = {}
        if (gte !== '') query[keyGte] = Number(gte)
        if (lte !== '') query[keyLte] = Number(lte)
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
