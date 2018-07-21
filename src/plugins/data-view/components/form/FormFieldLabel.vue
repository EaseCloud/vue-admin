<template>
  <div class="field-item field-item-label"
       :style="{width: field.final.width || '250px'}">
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
    }
  }
</script>
