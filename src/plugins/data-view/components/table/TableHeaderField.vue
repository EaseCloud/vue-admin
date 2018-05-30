<template>
  <div class="table-header-field"
       :style="field.headerStyle || {}">
    {{column.title}}
    <icon v-if="field.filtering" type="filter"></icon>
  </div>
</template>

<script>
  export default {
    name: 'TableFieldHtml',
    props: {
      column: {},
      field: {
        type: Object
      }
    }
  }
</script>

<style type="less" scoped>
  .table-header-field {
  }
</style>
