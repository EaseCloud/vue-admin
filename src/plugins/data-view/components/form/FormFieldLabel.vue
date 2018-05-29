<template>
  <div class="field-item field-item-label"
       :style="{width: field.final.width || '250px'}">
    {{value}}
  </div>
</template>

<script>
  export default {
    name: 'FormFieldLabel',
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
