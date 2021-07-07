<template>
  <div class="field-item field-item-item-list"
       :style="{width: !!field.final.width && field.final.width}">
    <div>
    </div>
    <div class="ivu-table-wrapper ivu-table-wrapper-with-border">
      <div class="ivu-table ivu-table-small ivu-table-border">
        <div class="ivu-table-header">
          <table cellspacing="0" cellpadding="0" border="0" style="width: 599px;">
            <thead>
            <tr>
              <th class="ivu-table-column-2Gkwny" v-if="!rawMode">
                <div class="ivu-table-cell">
                  <div>Key</div>
                </div>
              </th>
              <th class="ivu-table-column-CJnaEd" v-if="!rawMode">
                <div class="ivu-table-cell">
                  <div>Value</div>
                </div>
              </th>
              <th class="ivu-table-column-2ZMNEV">
                <div class="ivu-table-cell" v-if="rawMode">
                  批量编辑，每行一个，格式 [key: val]
                </div>
                <div class="ivu-table-cell" v-else>
                  <i-button size="small" @click="addItem()">添加</i-button>
                </div>
                <div class="ivu-table-cell" style="float: right">
                  <i-switch size="large" v-model="rawMode">
                    <span slot="open">批量</span>
                    <span slot="close">列表</span>
                  </i-switch>
                </div>
              </th>
            </tr>
            </thead>
          </table>
        </div>
        <div class="ivu-table-body" v-show="!rawMode">
          <table cellspacing="0" cellpadding="0" border="0" style="width: 599px;">
            <tbody class="ivu-table-tbody">
            <tr draggable="false" class="ivu-table-row" v-for="(item, index) in items">
              <td class="ivu-table-column-2Gkwny">
                <div class="ivu-table-cell">
                  <span>{{item.key}}</span>
                </div>
              </td>
              <td class="ivu-table-column-CJnaEd">
                <div class="ivu-table-cell">
                  <span>{{item.value}}</span>
                </div>
              </td>
              <td class="ivu-table-column-2ZMNEV">
                <div class="ivu-table-cell">
                  <div class="ivu-table-cell-slot">
                    <i-button size="small" @click="editItem(index)">编辑</i-button>
                    <i-button size="small" @click="removeItem(index)">删除</i-button>
                  </div>
                </div>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <div class="code-block" style="line-height: 20px">
      <codemirror v-if="rawMode"
                  class="form-field-input"
                  ref="input"
                  v-model="rawText"
                  :options="{theme: 'default', ...(field.codeOptions || {})}"/>

    </div>
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
        items: [],
        rawMode: false
      }
    },
    computed: {
      rawText: {
        get () {
          const vm = this
          return vm.items.map(x => `${x.key}: ${x.value}`).join('\n')
        },
        set (value) {
          const vm = this
          console.log(arguments)
          const items = []
          value.split('\n').forEach(line => {
            const pos = line.indexOf(':')
            if (pos === -1) return
            const key = line.substr(0, pos).trim()
            const value = line.substr(pos + 1).trim()
            if (!key) return
            items.push({key, value})
          })
          vm.items = items
          vm.$emit('input', vm.items)
        }
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
        vm.items = vm.field.value
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
        vm.items.splice(index, 1, item)
        vm.$emit('input', vm.items)
      }
    }
  }
</script>


