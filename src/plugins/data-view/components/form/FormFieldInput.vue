<template>
  <div class="field-item field-item-input"
       :style="{width: field.final.width || '250px'}" >
    <i-input class="form-field-input"
             :value="value"
             @input="$emit('input', $event)"
             :type="field.final.htmlType || 'text'"
             :disabled="field.final.disabled"
             :readonly="field.final.readonly"
             :placeholder="field.final.placeholder"></i-input>
  </div>
</template>

<script>
  export default {
    name: 'FormFieldInput',
    props: {
      value: {},
      field: {
        type: Object,
        default: () => {
        }
      }
    }
  }
</script>
