/**
 * 数据驱动组件
 */
// import config from '../../config'
import components from './components'

export default {
  install (Vue, options = {}) {
    Vue.mixin({
      components,
      computed: {},
      methods: {
        /**
         * 计算获取某个对象的某个字段显示取值
         * @param field 字段设置（逻辑上对应于列）
         * @param item 数据对象（逻辑上对应于行）
         */
        async getFieldValue (field, item) {
          const vm = this
          // 0. 首先，field.key 可能是函数或者 Promise，要先通过
          // finalize 获取计算获得的 key 值
          const key = await vm.finalize(field.key, item)
          // 1. 根据 field.key 定位初始的取值
          let value = vm.evaluate(item, key)
          // 2. 根据 filter 过滤
          if (field.filter) {
            value = await field.filter.apply(vm, [value])
          }
          // 3. 根据 mapper 过滤
          if (field.mapper) {
            const mapper = await vm.finalize(field.mapper, item)
            value = (value in mapper && mapper[value]) ||
              mapper.__default__ || value
          }
          return value
        },
        /**
         * 设置列表字段的默认值
         * @param field
         */
        setListViewFieldDefault (field) {
          const vm = this
          const defaults = {
            type: 'text'
          }
          Object.keys(defaults).forEach(key => {
            const value = defaults[key]
            if (field[key] === void 0) {
              vm.$set(field, key, value)
            }
          })
        },
        /**
         * 根据数据模型名称获取列表页面路由
         * @param model
         * @returns {Promise<{name: string, params: {id: *}}>}
         */
        async getModelListRoute (model) {
          const vm = this
          return vm.config.hooks.action_get_model_list_route.apply(vm, [model])
        },
        /**
         * 根据数据模型名称和 id 获取编辑页面路由
         * @param model
         * @param pk
         * @returns {Promise<{name: string, params: {id: *}}>}
         */
        async getModelEditRoute (model, pk) {
          const vm = this
          return vm.config.hooks.action_get_model_edit_route.apply(vm, [model, pk])
        },
        /**
         * 行级编辑动作
         * @param item
         * @returns {Promise<void>}
         */
        async actionEdit (item) {
          const vm = this
          return vm.hooks.action_edit.apply(vm, [item])
        },
        /**
         * 行级删除动作
         * @param item
         * @returns {Promise<void>}
         */
        async actionDelete (item) {
          const vm = this
          return vm.hooks.action_delete.apply(vm, [item])
        },
        /**
         * 跳转到列表
         * @returns {Promise<void>}
         */
        async redirectList () {
          const vm = this
          return vm.hooks.action_redirect_list.apply(vm, [vm.model])
        },
        /**
         * 跳转到创建页面
         * @returns {Promise<void>}
         */
        async redirectCreate () {
          const vm = this
          return vm.hooks.action_create.apply(vm)
        },
        async pickObject (listViewOptions, {
          title = '选取对象',
          width = 540,
          okText = '确认',
          cancelText = '取消',
          scrollable = true
        } = {}) {
          const vm = this
          return new Promise((resolve, reject) => {
            let el
            listViewOptions.options = listViewOptions.options || {}
            listViewOptions.options.show_pager = true
            listViewOptions.options.show_actions = true
            listViewOptions.actions = [{
              label: '选择',
              action (item) {
                resolve(item)
                vm.$Modal.remove()
              }
            }]
            vm.$Modal.confirm({
              title,
              width,
              okText,
              cancelText,
              scrollable,
              render (h) {
                el = h('list-view-table', {
                  style: { marginTop: '16px' },
                  props: listViewOptions
                })
                return el
              },
              onOk: reject,
              onCancel: reject
            })
          })
        }
      }
    })
  }
}
