<template>
  <div>
    <i-table v-if="initialized"
             :columns="columns"
             :size="size"
             :data="data">
    </i-table>
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
          show_actions: true
        })
      },
      // TODO: 斟酌一下分页的传入用何种方式比较合适
      pager: {
        type: Object,
        default: () => ({
          page: 1,
          page_count: 1,
          page_size: 10
        })
      },
      filters: { type: Object, default: () => ({}) },
      // hooks: {
      //   type: Object
      // },
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
        // 经过渲染预处理的 iView table 猎头数据
        columns: [],
        // 经过渲染预处理的数据
        data: [],
        // 原始获得的原始数据
        items: [],
        // 选中的项目列表，主键 pk 的列表
        selectedItems: [],
        query: { ...vm.filters },
        total: 0
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
        // console.log(vm.hooks)
        const { page, count, results } = await vm.hooks.action_load_data.apply(vm)
        vm.total = count
        // 整除：https://stackoverflow.com/a/4228528/2544762
        vm.pager.page_count = ~~(count / vm.pager.page_size)
        vm.pager.page = page
        // 预处理所有数据
        const items = []
        await Promise.all(results.map(async function (item, i) {
          items[i] = await vm.hooks.filter_item_before_render.apply(vm, [item])
        }))
        vm.items = items
        // 预渲染
        await vm.preRenderData()
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
          } else if (type === 'render') {
          }
        }))
        return row
      },
      renderCell (type, value, index, h, field) {
        // const vm = this
        // CHECKLIST: <data-view-types> <list-view>
        // console.log(`RENDER[${index}]:`, type, value)
        if (type === 'label' || type === 'text') {
          return h(tableComponents.TableFieldText, { props: { value } })
        } else if (type === 'html') {
          return h(tableComponents.TableFieldHtml, { props: { value } })
        } else if (type === 'tag') {
          // TODO: 尚未实现
          return h('div', `TODO:${type}`)
        } else if (type === 'link') {
          // TODO: 尚未实现
          return h('div', `TODO:${type}`)
        } else if (type === 'image') {
          // TODO: 尚未实现
          return h('div', `TODO:${type}`)
        } else if (type === 'image-text') {
          // TODO: 尚未实现
          return h('div', `TODO:${type}`)
          // } else if (type === 'switch') {
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
      /**
       * 根据指定的 field 选项以及数据行的对象，渲染出具体的 iView
       * table 列定义对象
       * @param type
       * @param value
       * @param h
       */
      // renderColumn (field, index) {
      //   const vm = this
      //   const type =  vm.finalize(field.type, item) || 'text'
      //   if (type === 'label' || type === 'text') {
      //   } else if (type === 'html') {
      //   } else if (type === 'render') {
      //   }
      // },
      //     setProperty(item, keyStr, value) {
      //       const vm = this
      //       // 缺省 keyStr 的时候直接返回 item
      //       if (!keyStr) return item;
      //       // 执行 keyStr 级联求值
      //       let obj = item;
      //       if (typeof (keyStr || '') !== 'string') {
      //         console.warn('getProperty 属性的 key 取值不规范');
      //         console.log('keyStr:', keyStr);
      //         console.log('item:', item);
      //       }
      //       const keys = keyStr.split('.')
      //       for (let i = 0; i < keys.length - 1; ++i) {
      //         const key = keys[i]
      //         if (!obj[key]) vm.$set(obj, key, {})
      //         obj = obj[key]
      //       }
      //       vm.$set(obj, keys[keys.length - 1], value)
      //     },
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
      //     dateformat(date, format = 'yyyy-mm-dd') {
      //       return dateformat(date, format);
      //     },
      //     echo(obj) {
      //       console.log(obj);
      //     },
      //     waitFor(obj, prop, timeout = 5000) {
      //       const vm = this;
      //       let timedOut = false;
      //       return new Promise((resolve, reject) => {
      //         let timerTimeout = setTimeout(() => {
      //           timedOut = true;
      //           reject();
      //         }, timeout);
      //         const func = () => {
      //           let value = vm.getProperty(obj, prop)
      //           if (value) {
      //             clearTimeout(timerTimeout);
      //             resolve(value);
      //           } else if (!timedOut) setTimeout(func, 200);
      //         };
      //         func();
      //       });
      //     },
      //   },
      // };
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
                  controls.push(h(
                    'Button', {
                      props: { size: 'small', type: 'ghost' },
                      on: { click: () => vm.actionEdit(vm.items[index]) }
                    }, '编辑'
                  ))
                } else if (action === 'delete') {
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
                  // General actions
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
      vm.initialize()
    }
  }
</script>
