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
      const value = vm.field.$view.query[key] || ''

      if (value) {
        console.log(vm.renderText(value))
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
          props: { trigger: 'click' },
          on: {
            'on-click': async value => {
              await vm.query(value)
            }
          }
        }, [
          h('a', { class: { collapsible: true } }, [h('icon', { props: { type: 'ios-more' } })]),
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
        // ListViewTable 执行查询
        vm.field.$view.doQuery({ [key]: value })
      },
      async reset () {
        const vm = this
        const key = vm.options.key
        // ListViewTable 执行查询
        vm.field.$view.doQuery({ [key]: null })
      },
      renderText (value) {
        const vm = this
        const choices = vm.options.choices
        if (vm.options.render_text) return vm.options.render_text(value)
        console.log(choices, value, vm._.find(choices, { value }))
        return vm._.find(choices, x => x.value.toString() === value.toString()).text
      }
    }
  }
</script>
