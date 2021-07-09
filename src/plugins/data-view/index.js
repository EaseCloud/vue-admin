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
          return vm.activeHooks.action_edit.apply(vm, [item])
        },
        /**
         * 弹窗行级编辑动作
         * @param item
         * @returns {Promise<void>}
         */
        async actionInlineEdit (item) {
          const vm = this
          return vm.activeHooks.action_inline_edit.apply(vm, [item])
        },
        /**
         * 行级删除动作
         * @param item
         * @returns {Promise<void>}
         */
        async actionDelete (item) {
          const vm = this
          return vm.activeHooks.action_delete.apply(vm, [item])
        },
        /**
         * 跳转到列表
         * @returns {Promise<void>}
         */
        async redirectList () {
          const vm = this
          return vm.activeHooks.action_redirect_list.apply(vm, [vm.model])
        },
        /**
         * 跳转到创建页面
         * @returns {Promise<void>}
         */
        async redirectCreate () {
          const vm = this
          return vm.activeHooks.action_create.apply(vm)
        },
        /**
         * 在本页面弹窗创建
         * @returns {Promise<void>}
         */
        async inlineCreate () {
          const vm = this
          return vm.activeHooks.action_inline_create.apply(vm)
        },
        async pickObject (listViewOptions = {}, {
          title = '选取对象',
          width = 800,
          okText = '确认',
          cancelText = '取消',
          scrollable = true,
          multiple = false,
          noSelect = false, // 隐藏选择按钮
          onSelect = null,
          onOpen = null
        } = {}) {
          const vm = this
          const loading = noSelect
          return new Promise((resolve, reject) => {
            let el
            const modalListViewOptions = {
              ...listViewOptions,
              options: {
                can_select: multiple,
                can_edit: false,
                can_delete: false,
                action_column_width: 80,
                show_actions: !multiple,
                ...(listViewOptions.options || {})
              },
              actions: [...(listViewOptions.actions || []), ...(noSelect ? [] : [{
                label: '选择',
                async action (item) {
                  if (onSelect) await onSelect(item, dialog)
                  dialog.close()
                  resolve(item)
                }
              }])]
            }
            // 默认情况下要显示分页
            if (vm.evaluate(modalListViewOptions, 'options.show_pager') === void 0) {
              vm.setProperty(modalListViewOptions, 'options.show_pager', true)
            }
            const dialog = vm.openDialog({
              title,
              width,
              okText,
              cancelText,
              scrollable,
              loading,
              render (h) {
                el = h('list-view-table', {
                  style: {marginTop: '16px'},
                  props: modalListViewOptions
                })
                return el
              },
              onOk () {
                if (!multiple) {
                  reject()
                } else {
                  resolve(el.componentInstance.selectedItems)
                }
                if (loading) dialog.close()
              },
              onCancel: reject
            })
            if (onOpen) onOpen(dialog)
          })
        }
      }
    })
  }
}
