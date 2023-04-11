<template>
  <div class="table-field-text" :style="finalizeSync(field.style || {}, item)">{{value}}</div>
</template>

<script>
  export default {
    name: 'TableFieldText',
    props: {
      value: {},
      item: {},
      field: {
        type: Object
      }
    }
  }
</script>
