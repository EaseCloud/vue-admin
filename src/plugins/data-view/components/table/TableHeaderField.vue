<template>
  <div class="table-header-field"
       :style="field.headerStyle || {}">
    {{column.title}}
    <div class="appendix">
      <slot></slot>
    </div>
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

<style lang="less">
  .table-header-field {
    .appendix {
      position: relative;
      display: inline-block;
      color: #AAAAAA;
    }
    .collapsible {
      transition-duration: 0.2s;
      opacity: 0;
    }
  }

  thead:hover .collapsible {
    opacity: 1;
  }
</style>
