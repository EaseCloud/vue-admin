<template>
  <div class="field-item field-item-input"
       :style="{width: field.width || '250px'}">
    <i-input class="form-field-input"
             :value="field.value"
             @input="$emit('input', $event)"
             :type="field.final.htmlType || 'text'"
             :rows="field.rows || 5"
             :disabled="field.final.disabled"
             :readonly="field.final.readonly"
             :placeholder="field.final.placeholder"></i-input>
  </div>
</template>

<script>
  export default {
    name: 'FormFieldInput',
    props: {
      field: {
        type: Object,
        default: () => {
        }
      }
    }
  }
</script>
