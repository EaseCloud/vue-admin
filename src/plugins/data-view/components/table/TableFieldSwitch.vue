<template>
  <div class="table-field-switch">
    <i-switch :value="value" @input="change"
              :disabled="!!field.disabled">
      <template slot="open">{{field.textOpen}}</template>
      <template slot="close">{{field.textClose}}</template>
    </i-switch>
  </div>
</template>

<script>
  export default {
    name: 'TableFieldSwitch',
    props: {
      value: {},
      field: {
        type: Object
      },
      index: {
        type: Number
      },
      vmTable: {
        type: Object
      }
    },
    methods: {
      change (value) {
        const vm = this
        const onChange = vm.field.onChange || async function (val, field, index) {
          const vmTable = this
          const item = vmTable.items[index]
          await vmTable.api().patch({ id: item.id }, { is_active: val })
          vmTable.reload()
        }
        onChange.apply(vm.vmTable, [value, vm.field, vm.index])
      }
    }
  }
</script>
