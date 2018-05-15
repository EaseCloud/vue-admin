export default {
  hooks: {
    // 所有的主线动作都要带钩
    async action_load_data () {
    },
    async filter_item_before_render (item) {
      return Promise.resolve(item)
    },
    async action_edit (item) {
      const vm = this
      const pk = await vm.finalize(vm.pk, item)
      const id = await vm.evaluate(item, pk)
      vm.$router.push(await vm.getModelEditRoute(vm.model, id))
    },
    async action_delete (item) {
      const vm = this
      console.log(vm.model)
      const pk = await vm.finalize(vm.pk, item)
      const id = await vm.evaluate(item, pk)
      await vm.api().delete({ id })
      return vm.reload()
    }
  }
}
