<template>
  <div class="list-view-table">
    <i-table ref="table"
             v-if="initialized"
             :columns="columns"
             :loading="loading"
             :row-class-name="rowClassNameRaw"
             :size="size"
             :data="data">
      <slot name="footer" slot="footer"></slot>
    </i-table>
    <div class="list-view-table-footer">
      <page v-if="options.show_pager"
            :total="pager.count"
            :current="pager.page"
            :page-size="pager.pageSize"
            :page-size-opts="pageSizeOpts"
            size="small"
            show-sizer
            show-total
            @on-change="pageTo(Number($event))"
            @on-page-size-change="pageSizeTo(Number($event))"></page>
    </div>
  </div>
</template>

<script>
  // TODO: 动态表头处理
  // TODO: 字段类型(text/label/expand)
  // TODO: 与 batchActions

  // TODO: export 导出

  // TODO: 渲染函数，需要全面支持 Promise 异步
  import defaults from '../defaults'

  import tableComponents from '../components/table'
  import fieldSetMixins from './fieldSetMixins'

  export default {
    name: 'ListViewTable',
    components: { ...tableComponents },
    mixins: [fieldSetMixins],
    props: {
      model: { type: String, required: true },
      title: { type: String, default: '列表视图' },
      subtitle: { type: String, default: 'ListView' },
      pk: { type: String, default: 'id' },
      fields: { type: Array, required: true },
      // 行级操作按钮
      actions: { type: Array, default: () => [] },
      // 页面级操作按钮
      listActions: { type: Array, default: () => [] },
      options: {
        type: Object,
        default: () => ({
          can_select: false,
          can_create: true,
          can_delete: true,
          can_edit: true,
          show_actions: true,
          show_pager: false,
          selector_column_width: 40
        })
      },
      pageSize: {
        type: Number,
        default: 10
      },
      page: {
        type: Number,
        default: 1
      },
      filters: { type: Object, default: () => ({}) },
      initQuery: { type: Object, default: () => ({}) },
      rowClassName: { type: Function },
      size: {
        default: 'small',
        validator (value) {
          return ['large', 'default', 'small'].indexOf(value) > -1
        }
      }
    },
    data () {
      const vm = this
      return {
        // 是否已初始化
        initialized: false,
        // 是否正在加载中
        loading: true,
        // 经过渲染预处理的 iView table 猎头数据
        columns: [],
        // 经过渲染预处理的数据
        data: [],
        // 原始获得的原始数据
        items: [],
        // 选中的项目列表，主键 pk 的列表
        selectedIndices: [],
        // 固化查询条件
        query: { ...vm.filters, ...vm.initQuery },
        // 固化分页条件
        pager: {
          page: vm.page,
          pageSize: vm.pageSize,
          pageCount: 1,
          count: 0
        }
        // TODO: 改为 plugins 实现
        // preview_image: null
      }
    },
    computed: {
      hooks () {
        const vm = this
        return { ...defaults.hooks, ...(vm.$attrs.hooks || {}) }
      },
      pageSizeOpts () {
        const vm = this
        const opts = [10, 20, 30, 40]
        if (opts.indexOf(Number(vm.pageSize)) === -1) opts.push(vm.pageSize)
        opts.sort((a, b) => a - b)
        return opts
      },
      selectedItems () {
        const vm = this
        return vm.selectedIndices.map(i => vm.items[i])
      }
    },
    methods: {
      rowClassNameRaw (row, index) {
        const vm = this
        return vm.rowClassName ? vm.rowClassName(vm.items[index], index) : ''
      },
      async reload () {
        const vm = this
        vm.loading = true
        const { page, count, results } = await vm.hooks.action_load_data.apply(vm)
        // 整除：https://stackoverflow.com/a/4228528/2544762
        vm.pager.pageCount = ~~((count - 1) / vm.pager.pageSize) + 1
        vm.pager.page = page
        vm.pager.count = count
        // 预处理所有数据
        const items = []
        await Promise.all(results.map(async function (item, i) {
          items[i] = await vm.hooks.filter_item_before_render.apply(vm, [item])
        }))
        vm.items = items
        // 预渲染
        await vm.preRenderData()
        vm.loading = false
        // 发送读取完成事件
        vm.$emit('loaded', items)
      },
      /**
       * 预渲染所有的已获得对象
       * 即将从 API 获得的原始数据对象 vm.items
       * 转化成传入到 iView Table 的 props 属性 data 的数据属性 vm.data
       */
      async preRenderData () {
        const vm = this
        const data = []
        await Promise.all(vm.items.map(async function (item, i) {
          data[i] = await vm.preRenderDataRow(item)
        }))
        vm.data = data
      },
      /**
       * 预渲染单个数据行
       * @param item
       */
      async preRenderDataRow (item) {
        const vm = this
        const row = {}
        await Promise.all(vm.fields.map(async function (field, i) {
          const key = `__column${i}__`
          const type = await vm.finalize(field.type, vm)
          // CHECKLIST: <data-view-types> <list-view>
          if (type === 'label' || type === 'text') {
            row[key] = await vm.getFieldValue(field, item)
          } else if (type === 'html') {
            row[key] = await vm.getFieldValue(field, item)
          } else if (type === 'image') {
            row[key] = await vm.getFieldValue(field, item)
          } else if (type === 'switch') {
            row[key] = await vm.getFieldValue(field, item)
          } else if (type === 'render') {
            row[key] = item
          } else {
            console.warn('尚未定义 ListViewTable 的 preRenderDataRow 字段处理类型：', type)
            row[key] = await vm.getFieldValue(field, item)
          }
        }))
        return row
      },
      renderHeader (type, column, index, h, field) {
        if (field.renderHeader) return field.renderHeader(h, field)
        const children = []
        // 插入过滤筛选器
        if (field.final.filtering) {
          // TODO: 为何这里会搞成平方复杂度？性能有问题，需要调试优化
          children.push(h(tableComponents.FilteringHeader, { props: { field } }))
        }
        return h(
          tableComponents.TableHeaderField,
          { props: { column, field } },
          children
        )
      },
      /**
       * 渲染单个单元格
       */
      renderCell (type, value, index, h, field) {
        const vm = this
        // CHECKLIST: <data-view-types> <list-view>
        // console.log(`RENDER[${index}]:`, type, value)
        if (type === 'label' || type === 'text') {
          return h(tableComponents.TableFieldText, { props: { value, field } })
        } else if (type === 'html') {
          return h(tableComponents.TableFieldHtml, { props: { value, field } })
        } else if (type === 'tag') {
          // TODO: 尚未实现
          return h('div', `TODO:${type}`)
        } else if (type === 'link') {
          const text = field.text(value)
          const route = field.route(value)
          return h('router-link', { props: { to: route } }, text)
        } else if (type === 'image') {
          return h(tableComponents.TableFieldImage, { props: { value, field } })
          // } else if (type === 'image-text') {
          // TODO: 尚未实现
          // return h('div', `TODO:${type}`)
        } else if (type === 'switch') {
          return h(tableComponents.TableFieldSwitch, {
            props: { value, field, index, vmTable: vm }
          })
          //   // TODO: 尚未实现
          //   return h('div', `TODO:${type}`)
          // } else if (type === 'html') {
          //   // TODO: 尚未实现
          //   return h('div', `TODO:${type}`)
          // } else if (type === 'html') {
          //   // TODO: 尚未实现
          //   return h('div', `TODO:${type}`)
        } else if (type === 'render') {
          return field.render(h, value, field, index)
        } else {
          return h(`未定义的字段类型: ${type}`)
        }
      },
      // /**
      //  * 根据指定的 field 选项以及数据行的对象，渲染出具体的 iView
      //  * table 列定义对象
      //  * @param type
      //  * @param value
      //  * @param h
      //  */
      // renderColumn (field, index) {
      //   const vm = this
      //   const type =  vm.finalize(field.type, item) || 'text'
      //   if (type === 'label' || type === 'text') {
      //   } else if (type === 'html') {
      //   } else if (type === 'render') {
      //   }
      // },
      //     setQueryKey(key, value) {
      //       const vm = this;
      //       vm.$router.replace({
      //         query: Object.assign(vm.$route.query, { [key]: value }),
      //       });
      //       vm.reload();
      //     },
      //     removeQueryKey(key) {
      //       const vm = this;
      //       const query = { ...vm.$route.query };
      //       delete query[key];
      //       vm.$router.replace({ query });
      //       vm.reload();
      //     },
      //   },
      // };
      /**
       * 修改当前查询集的查询条件并且刷新数据
       */
      async doQuery (query, forceReload = false, reloadHeader = true) {
        const vm = this
        let updated = false
        vm._.forEach(query, (value, key) => {
          // 删除查询条件机制
          if (value === null || value === void 0) {
            if (key in vm.query) {
              delete vm.query[key]
              updated = true
            }
          } else {
            if (vm.query[key] !== value) {
              vm.query[key] = value
              updated = true
            }
          }
        })
        // // TODO: 添加文档
        // vm.$emit('query', query)
        // // TODO: 为何这里要加 nextTick，另外为何不是先 reload 再 emit
        // vm.$nextTick(() => {
        //   vm.reload()
        // })
        // 如果全部参数都是一样的情况下，不做刷新
        if (forceReload || updated) {
          // 修改查询条件的话跳回第一页并加载数据
          await vm.pageTo(1, true)
          // 所有 FilteringHeader 需要刷新渲染（Ugly implementation）
          if (reloadHeader) {
            vm.initialized = false
            vm.$nextTick(() => {
              vm.initialized = true
            })
          }
          // 通知父组件
          vm.$emit('query', query)
        }
      },
      async pageTo (page, forceReload = false) {
        const vm = this
        if (forceReload || Number(vm.pager.page) !== Number(page)) {
          vm.pager.page = page
          await vm.reload()
          vm.$emit('page_to', page)
        }
      },
      async pageSizeTo (pageSize, forceReload = false) {
        const vm = this
        if (forceReload || Number(vm.pager.pageSize) !== Number(pageSize)) {
          vm.pager.pageSize = pageSize
          await vm.reload()
          vm.$emit('page_size_to', pageSize)
        }
      },
      /**
       * 初始化所有的行列配置以适配 iView Table 组件的输入格式
       * @returns {Promise<void>}
       */
      async initialize () {
        const vm = this
        const columns = []
        await Promise.all(vm.fields.map(async function (field, i) {
          vm.setListViewFieldDefault(field)
          // 计算所有字段选项值
          const key = `__column${i}__`
          await vm.finalizeFields(field)
          // const label = await vm.finalize(field.label, vm)
          // const type = await vm.finalize(field.type, vm)
          columns[i] = {
            title: field.final.label,
            render (h, { row, index }) {
              // 如果 key 为 '@index' 的话，渲染
              let value = row[key]
              if (field.key === '@index') {
                value = index + 1 + vm.pager.pageSize * ((vm.pager.page || 1) - 1)
              }
              return vm.renderCell(field.final.type, value, index, h, field)
            },
            // 渲染列头
            renderHeader (h, { column, index }) {
              return vm.renderHeader(field.final.type, column, index, h, field)
            }
          }
          // 其他动态属性（实际上当页宽很小的时候，使用 maxWidth 效果更好）
          if (field.width) columns[i].maxWidth = field.width
          // 指定其他宽度
          if (field.minWidth) columns[i].minWidth = field.minWidth
          if (field.maxWidth) columns[i].maxWidth = field.maxWidth
        }))
        if (vm.options.show_actions === void 0 || vm.options.show_actions) {
          const columnActions = {
            title: '操作',
            width: vm.options.action_column_width,
            render (h, { row, index }) {
              const controls = []
              const item = vm.items[index]
              vm.actions.forEach(action => {
                if ((action.display instanceof Function && !action.display.apply(vm, [item])) ||
                  (!action.display && action.display !== void 0)) {
                  return
                }
                controls.push(h(
                  'i-button', {
                    props: {
                      size: 'small',
                      type: action.buttonType,
                      shape: action.buttonShape,
                      icon: action.buttonIcon
                    },
                    on: {
                      click: () => {
                        const result = action.action.apply(vm, [item])
                        // result.catch && result.catch(_ => _)
                      }
                    }
                  }, action.label
                ))
                // 为避免按钮粘在一起，加一个空格以分开
                controls.push(vm._v(' '))
              })
              if (vm.options.can_edit === void 0 || vm.finalizeSync(vm.options.can_edit, item)) {
                controls.push(h(
                  'Button', {
                    props: { size: 'small' },
                    on: { click: () => vm.actionEdit(item) }
                  }, '编辑'
                ))
                controls.push(vm._v(' '))
              }
              if (vm.options.can_delete === void 0 || vm.finalizeSync(vm.options.can_delete, item)) {
                controls.push(h('Poptip', {
                  props: {
                    confirm: true,
                    title: '确认删除这项数据？',
                    placement: 'left'
                  },
                  on: { 'on-ok': () => vm.actionDelete(item).then(() => vm.reload()) }
                }, [h(
                  'Button', {
                    props: { size: 'small', type: 'dashed' }
                  }, '删除'
                )]))
                controls.push(vm._v(' '))
              }
              return h('div', controls)
            }
          }
          if (vm.options.action_column_render_header) {
            columnActions.renderHeader = vm.options.action_column_render_header
          }
          columns.push(columnActions)
        }
        // 初始化勾选列
        if (vm.options.can_select) {
          columns.unshift({
            key: '__selector__',
            width: vm.options.selector_column_width || 40,
            renderHeader (h, { column, index }) {
              return h('checkbox', {
                props: {
                  value: vm.selectedIndices.length > 0 &&
                  vm.selectedIndices.length === vm.items.length
                },
                on: {
                  input (value) {
                    vm.selectedIndices = value ? vm._.range(vm.items.length) : []
                    vm.$emit('select', vm.selectedIndices)
                  }
                }
              })
            },
            render (h, { column, index, row }) {
              return h('checkbox', {
                props: {
                  value: vm.selectedIndices.indexOf(index) > -1
                },
                on: {
                  input (value) {
                    vm.selectedIndices = (value
                        ? vm._.union(vm.selectedIndices, [index])
                        : vm._.without(vm.selectedIndices, index)
                    ).sort((a, b) => a - b)
                    vm.$emit('select')
                  }
                }
              })
            }
          })
        }
        vm.columns = columns
        // vm.columns = [{
        //   title: 'Fuck',
        //   key: 'id',
        //   render (h, params) {
        //     console.log(params.row.id, params.index)
        //     return h('div', 123)
        //   }
        // }]
        vm.initialized = true
      }
    },
    mounted () {
      const vm = this
      vm.fields.forEach(field => {
        field.$view = vm
      })
      vm.initialize()
    }
  }
</script>

<style lang="less" scoped>
  @import "../../../style/defines";

  .list-view-table-footer {
    margin: 10px 0;
    .clearfix();
    .ivu-page {
      float: right;
    }
  }

  .list-view-table /deep/ th,
  .list-view-table /deep/ .ivu-table-wrapper,
  .list-view-table /deep/ .ivu-table,
  .list-view-table /deep/ .ivu-table-header {
    overflow: visible;
  }

  .list-view-table /deep/ th > .ivu-table-cell {
    display: block;
    overflow: visible;
  }
</style>
