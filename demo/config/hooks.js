export default {
  /**
   * For json-server protocol
   * @returns {Promise<{page: *, count: *, results: *}>}
   */
  async action_list_view_load_data () {
    const vm = this
    const resp = await vm.api().get({}, {
      _page: vm.pager.page,
      _limit: vm.pager.pageSize,
      ...vm.query
    })
    return {
      page: vm.pager.page,
      count: Number(resp.headers['x-total-count'] || 0),
      results: resp.data
    }
  }
}
