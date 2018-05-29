<template>
  <div class="field-item field-item-switch"
       :style="{width: field.final.width || '250px'}">
    <i-switch :value="value"
              @input="$emit('input', $event)">
      <template slot="open">{{field.textOpen}}</template>
      <template slot="close">{{field.textClose}}</template>
    </i-switch>
  </div>
</template>

<script>
  export default {
    name: 'FormFieldSwitch',
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
