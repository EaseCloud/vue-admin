<script>
  export default {
    name: 'FilteringHeaderSelect',
    props: {
      field: { type: Object },
      options: { type: Object }
    },
    render (h) {
      const vm = this
      const key = vm.options.key
      const choices = vm.options.choices
      let value = vm.field.$view.query[key] || ''
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
        }, vm.renderText(value))
      } else {
        return h('dropdown', {
          style: { marginLeft: '4px' },
          props: { trigger: 'click', transfer: true },
          on: {
            'on-click': async value => {
              await vm.query(value)
            }
          }
        }, [
          h('a', { class: { collapsible: true } }, [h('x-icon', { props: { name: 'fa fa-ellipsis-h' } })]),
          h('dropdown-menu', { slot: 'list' }, choices.map(choice => h(
            'dropdown-item',
            { props: { name: choice.value } },
            [choice.text]
          )))
        ])
      }
    },
    methods: {
      async query (val) {
        const vm = this
        const key = vm.options.key
        let value = vm.options.filter ? await vm.options.filter(val) : val
        const query = {[key]: value}
        // 字段修改的拦截钩子
        if (vm.options.onChange) await vm.options.onChange(query)
        // ListViewTable 执行查询
        await vm.field.$view.doQuery(query)
      },
      async reset () {
        const vm = this
        const key = vm.options.key
        const query = {[key]: null}
        // 字段修改的拦截钩子
        if (vm.options.onChange) await vm.options.onChange(query)
        // ListViewTable 执行查询
        await vm.field.$view.doQuery(query)
      },
      renderText (value) {
        const vm = this
        const choices = vm.options.choices
        if (vm.options.render_text) return vm.options.render_text(value)
        return vm._.find(choices, x => x.value.toString() === value.toString()).text
      }
    }
  }
</script>
