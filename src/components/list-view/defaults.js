export default {
  hooks: {
    // 所有的主线动作都要带钩
    action_load_data () {
    },
    action_redirect_edit (item) {
    },
    filter_item_before_render (item) {
      return Promise.resolve(item)
    }
  }
}
