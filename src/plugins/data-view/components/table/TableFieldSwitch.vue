<template>
  <div class="table-field-switch">
    <i-switch :value="value"
              @input="update"
              :disabled="disabled">
      <template slot="open">{{ field.textOpen }}</template>
      <template slot="close">{{ field.textClose }}</template>
    </i-switch>
  </div>
</template>

<script>
export default {
  name: 'TableFieldSwitch',
  props: {
    value: {},
    field: {type: Object},
    index: {type: Number},
    vmTable: {type: Object},
    item: {type: Object}
  },
  computed: {
    disabled () {
      const vm = this
      if (vm.field.disabled instanceof Function) {
        return vm.field.disabled.apply(vm.vmTable, [vm.item])
      } else {
        return !!vm.field.disabled
      }
    }
  },
  methods: {
    update (value) {
      const vm = this
      const onUpdate = vm.field.onUpdate || async function (field, value, item) {
        await vm.vmTable.api().patch({id: item[vm.vmTable.pk]}, {[field.key]: value})
        return vm.vmTable.reload()
      }
      onUpdate.apply(vm.vmTable, [vm.field, value, vm.item])
    }
  }
}
</script>
