<template>
  <div class="table-field-html"
       :style="field.style || {}"
       v-html="value"></div>
</template>

<script>
  export default {
    name: 'TableFieldHtml',
    props: {
      value: {},
      item: {},
      field: {
        type: Object
      }
    }
  }
</script>

<style type="less" scoped>
  .table-field-html {
    white-space: pre-wrap;
  }
</style>
