<template>
  <div class="table-field-html" v-html="value"></div>
</template>

<script>
  export default {
    name: 'TableFieldHtml',
    props: {
      value: {}
    }
  }
</script>

<style type="less" scoped>
  .table-field-html {
    white-space: pre-wrap;
  }
</style>
