<template>
  <div class="list-view-table">
    <i-table v-if="initialized"
             :columns="columns"
             :loading="loading"
             :size="size"
             :data="data">
    </i-table>
    <div class="list-view-table-footer">
      <page v-if="options.show_pager"
            :total="pager.count"
            :current="pager.page"
            :page-size="pager.pageSize"
            size="small"
            show-sizer
            show-total
            @on-change="pageTo(Number($event))"
            @on-page-size-change="pageSizeTo(Number($event))"></page>
    </div>
  </div>
</template>

<script>
  // TODO: selectable 可选中/批量操作
  // TODO: 动态表头处理
  // TODO: 字段类型(text/label/expand)
  // TODO: actions/listActions 与 batchActions

  // TODO: export 导出

  // TODO: 渲染函数，需要全面支持 Promise 异步
  import defaults from '../defaults'

  import tableComponents from '../components/table'

  export default {
    name: 'ListViewTable',
    components: { ...tableComponents },
    props: {
      model: { type: String, required: true },
      title: { type: String, default: '列表视图' },
      subtitle: { type: String, default: 'ListView' },
      pk: { type: String, default: 'id' },
      fields: { type: Array, required: true },
      // 行级操作按钮
      actions: { type: Array, default: () => ['edit', 'delete'] },
      // 页面级操作按钮
      listActions: { type: Array, default: () => [] },
      options: {
        type: Object,
        default: () => ({
          can_create: true,
          can_delete: true,
          can_edit: true,
          show_actions: true,
          show_pager: false
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
        selectedItems: [],
        // 固化查询条件
        query: { ...vm.filters },
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
      }
    },
    methods: {
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
          } else {
            console.warn('尚未定义 ListViewTable 的 preRenderDataRow 字段处理类型：', type)
            row[key] = await vm.getFieldValue(field, item)
          }
        }))
        return row
      },
      renderHeader (type, column, index, h, field) {
        return h(tableComponents.TableHeaderField, { props: { column, field } })
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
          // TODO: 尚未实现
          return h('div', `TODO:${type}`)
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
          // TODO: 尚未实现
          return h('div', `TODO:${type}`)
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
      async doQuery (query) {
        const vm = this
        vm._.forEach(query, (value, key) => {
          // 删除查询条件机制
          if (value === null || value === void 0) {
            delete vm.query[key]
          } else {
            vm.query[key] = value
          }
        })
        // // TODO: 添加文档
        // vm.$emit('query', query)
        // // TODO: 为何这里要加 nextTick，另外为何不是先 reload 再 emit
        // vm.$nextTick(() => {
        //   vm.reload()
        // })
        await vm.reload()
        vm.$emit('query', vm.query)
      },
      async pageTo (page) {
        const vm = this
        vm.pager.page = page
        await vm.reload()
        vm.$emit('page_to', page)
      },
      async pageSizeTo (pageSize) {
        const vm = this
        vm.pager.pageSize = pageSize
        await vm.reload()
        vm.$emit('page_size_to', pageSize)
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
          const key = `__column${i}__`
          const label = await vm.finalize(field.label, vm)
          const type = await vm.finalize(field.type, vm)
          columns[i] = {
            title: label,
            render (h, { row, index }) {
              return vm.renderCell(type, row[key], index, h, field)
            },
            // 渲染列头
            renderHeader (h, { column, index }) {
              return vm.renderHeader(type, column, index, h, field)
            }
          }
        }))
        // console.log(columns)
        // TODO: 初始化勾选列
        // TODO: 初始化操作列
        if (vm.options.show_actions) {
          columns.push({
            title: '操作',
            render (h, { row, index }) {
              const controls = []
              vm.actions.forEach(action => {
                if (action === 'edit') {
                  if (!vm.options.can_edit) return
                  controls.push(h(
                    'Button', {
                      props: { size: 'small', type: 'ghost' },
                      on: { click: () => vm.actionEdit(vm.items[index]) }
                    }, '编辑'
                  ))
                } else if (action === 'delete') {
                  if (!vm.options.can_delete) return
                  controls.push(h('Poptip', {
                    props: {
                      confirm: true,
                      title: '确认删除这项数据？'
                    },
                    on: { 'on-ok': () => vm.actionDelete(vm.items[index]) }
                  }, [h(
                    'Button', {
                      props: { size: 'small', type: 'dashed' }
                    }, '删除'
                  )]))
                } else {
                  controls.push(h(
                    'Button', {
                      props: { size: 'small', type: action.buttonType },
                      on: { click: () => action.action(vm.items[index]) }
                    }, action.label
                  ))
                }
                // 为避免按钮粘在一起，加一个空格以分开
                controls.push(vm._v(' '))
              })
              return h('div', controls)
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
</style>
