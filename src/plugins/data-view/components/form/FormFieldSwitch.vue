<template>
  <div class="field-item field-item-switch"
       :style="{width: field.final.width || '250px'}">
    <i-switch :value="field.value"
              :disabled="field.final.disabled || field.final.readonly"
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
      field: {
        type: Object,
        default: () => {
        }
      }
    },
    mounted () {
      const vm = this
      vm.field.$el = this
    }
  }
</script>
