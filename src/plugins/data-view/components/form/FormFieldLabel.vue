<template>
  <div class="field-item field-item-label"
       :style="{width: field.final.width || 'auto'}">
    {{field.value}}
  </div>
</template>

<script>
  export default {
    name: 'FormFieldLabel',
    props: {
      field: {
        type: Object,
        default: () => {
        }
      }
    },
    mounted () {
      const vm = this
      vm.field.$el = this
      // 默认不进行回写
      if (vm.field.onWriteField === void 0) vm.field.onWriteField = () => null
    }
  }
</script>
