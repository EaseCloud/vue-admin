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
    async action_inline_edit (item = null) {
      const vm = this
      const pk = await vm.finalize(vm.pk, item)
      const id = item ? await vm.evaluate(item, pk) : 0
      // const editViewOptions = vm.editViewOptions
      // console.log(editViewOptions)
      // const data = await vm.modalForm({
      //   fields: editViewOptions.fields
      // }, {
      //   title: editViewOptions.title || (item ? '编辑' : '创建') + editViewOptions.modelName,
      //   item
      // })
      // const itemAfterSave = await vm.hooks.action_save.apply(vm, [data])
      const itemAfterSave = await vm.modalEditView({
        id, ...vm.editViewOptions
      }, {
        title: vm.editViewOptions.title || (item ? '编辑' : '创建') + vm.editViewOptions.modelName,
      })
      return itemAfterSave
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
    async action_inline_create () {
      const vm = this
      await vm.hooks.action_inline_edit.apply(vm)
    },
    async action_redirect_list () {
      const vm = this
      vm.$router.push(await vm.getModelListRoute(vm.model))
    },
    async action_save (item) {
      const vm = this
      const pk = await vm.finalize(vm.pk, item)
      const id = await vm.evaluate(item, pk)
      const isCreate = !id
      const itemToSave = await vm.config.hooks.filter_edit_view_pre_save.apply(vm, [item])
      const itemAfterSave = isCreate ?
        await vm.config.hooks.action_edit_view_create_item.apply(vm, [itemToSave]) :
        await vm.config.hooks.action_edit_view_update_item.apply(vm, [itemToSave])
      return await vm.config.hooks.action_edit_view_post_save.apply(vm, [itemAfterSave])
    }
  }
}
