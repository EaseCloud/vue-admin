<template>
  <div class="table-field-text" :style="field.style || {}">{{value}}</div>
</template>

<script>
  export default {
    name: 'TableFieldText',
    props: {
      value: {},
      field: {
        type: Object
      }
    }
  }
</script>
