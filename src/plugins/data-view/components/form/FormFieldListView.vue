<template>
  <div class="field-item field-item-list-view"
       :style="{width: field.final.width || 'auto'}">
    <list-view-table @input="$emit('input', $event)"
                     v-bind="field.listViewOptions"></list-view-table>
  </div>
</template>

<script>
  export default {
    name: 'FormFieldListView',
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
