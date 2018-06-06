export default {
  hooks: {
    // 所有的主线动作都要带钩
    async action_load_data () {
      const vm = this
      return vm.config.hooks.action_list_view_load_data.apply(vm)
    },
    async action_load_data_single (id) {
      const vm = this
      return vm.config.hooks.action_edit_view_load_data.apply(vm, [id])
    },
    async filter_item_before_render (item) {
      return item
    },
    async filter_item_before_render_single (item) {
      return item
    },
    async action_edit (item) {
      const vm = this
      const pk = await vm.finalize(vm.pk, item)
      const id = await vm.evaluate(item, pk)
      vm.$router.push(await vm.getModelEditRoute(vm.model, id))
    },
    async action_delete (item) {
      const vm = this
      const pk = await vm.finalize(vm.pk, item)
      const id = await vm.evaluate(item, pk)
      await vm.api().delete({ id })
    },
    async action_create () {
      const vm = this
      vm.$router.push(await vm.getModelEditRoute(vm.model, 0))
    },
    async action_redirect_list () {
      const vm = this
      vm.$router.push(await vm.getModelListRoute(vm.model))
    }
  }
}
