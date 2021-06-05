<template>
  <div class="field-item field-item-item-list"
       :style="{width: !!field.final.width && field.final.width}">
    <i-table ref="table" border v-if="initialized" :columns="columns"
             size="small" :data="items">
      <template slot-scope="{row, index}" slot="__action__">
        <!-- TODO: 后续如果有需要可以加上类似的 actions 接口 -->
        <!--<template v-for="(action, i) in field.actions"-->
        <!--v-if="$refs.form && (action.display===void 0||finalizeSync(action.display, items.item))">-->
        <!--<i-button :key="i"-->
        <!--:type="action.buttonType"-->
        <!--@click="doAction(action.action, [$refs.form.item])">{{action.label}}-->
        <!--</i-button>-->
        <!--<i :key="'_'+i">&lt;!&ndash;避免按钮之间粘在一起&ndash;&gt;</i>-->
        <!--</template>-->
        <i-button size="small" @click="editItem(index)">编辑</i-button>
        <i-button size="small" @click="removeItem(index)">删除</i-button>
      </template>
    </i-table>
  </div>
</template>

<script>
  export default {
    name: 'FormFieldItemList',
    props: {
      field: {
        type: Object,
        default: () => {
        }
      }
    },
    data () {
      return {
        initialized: false,
        items: [],
        columns: []
      }
    },
    mounted () {
      const vm = this
      vm.field.$el = this
      // 默认不进行回写
      if (vm.field.onWriteField === void 0) vm.field.onWriteField = () => null
    },
    methods: {
      async reload () {
        const vm = this
        vm.initialized = false
        await vm.$nextTick()
        vm.items = vm.field.value
        const cols = vm.field.fields.map(({key, label}) => ({
          key,
          title: label,
          renderHeader (h, {column, index}) {
            return h('div', column.title)
          }
        }))
        cols.push({
          title: '操作',
          slot: '__action__',
          renderHeader (h, {column, index}) {
            return h('i-button', {
              props: {size: 'small'},
              on: {click: () => vm.addItem()}
            }, '添加')
          },
        })
        vm.columns = cols
        vm.initialized = true
      },
      async addItem () {
        const vm = this
        const item = await vm.modalForm({fields: vm.field.fields}, {title: '添加对象'})
        vm.items.push(item)
        vm.$emit('input', vm.items)
      },
      async removeItem (index) {
        const vm = this
        vm.items.splice(index, 1)
        vm.$emit('input', vm.items)
      },
      async editItem (index) {
        const vm = this
        let item = vm.items[index]
        const fields = vm.field.fields.map(field => ({
          ...field, default: item[field.key]
        }))
        item = await vm.modalForm({fields}, {title: '修改对象'})
        vm.items.splice(index)
        vm.$emit('input', vm.items)
      }
    }
  }
</script>


