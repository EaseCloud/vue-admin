<template>
  <div class="field-item field-item-rate"
       :style="{width: field.final.width || 'auto'}">
    <rate :value="field.value"
          :allow-half="field.allow_half"
          :show-text="field.show_text"
          :clearable="field.clearable"
          :disabled="field.disabled"
          :count="field.count || 5"
          @input="$emit('input', $event)"></rate>
  </div>
</template>

<script>
  export default {
    name: 'FormFieldStar',
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
