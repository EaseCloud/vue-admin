<template>
  <div class="field-item field-item-time"
       :style="{width: field.final.width || 'auto'}">
    <time-picker :value="field.value"
                 :type="field.timeType || 'time'"
                 :format="field.format"
                 :step="field.step"
                 :placement="field.placement"
                 :confirm="field.confirm"
                 :open="field.open"
                 :size="field.final.size"
                 :disabled="field.final.disabled"
                 :readonly="field.final.readonly"
                 :editable="field.final.editable"
                 :clearable="field.final.size"
                 :transfer="field.transfer"
                 :placeholder="field.final.placeholder"
                 @on-change="$emit('input', $event)"
                 @on-clear="$emit('input', null)"></time-picker>
  </div>
</template>

<script>
  export default {
    name: 'FormFieldTime',
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
