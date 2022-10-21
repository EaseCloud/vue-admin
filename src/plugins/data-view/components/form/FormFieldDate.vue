<template>
  <div class="field-item field-item-date"
       :style="{width: field.final.width || 'auto'}">
    <!-- dateType: date/daterange/datetime/datetimerange/year/month -->
    <date-picker :value="field.value"
                 :type="field.dateType || 'date'"
                 :format="field.format"
                 :placement="field.placement"
                 :options="field.dateOptions"
                 :split-panels="field.splitPanels"
                 :multiple="field.multiple"
                 :show-week-numbers="field.showWeekNumbers"
                 :start-date="field.startDate"
                 :confirm="field.confirm"
                 :open="field.open"
                 :size="field.final.size"
                 :disabled="field.final.disabled"
                 :readonly="field.final.readonly"
                 :editable="field.final.editable"
                 :clearable="field.final.size"
                 :transfer="field.transfer"
                 :time-picker-options="field.timePickerOptions"
                 :placeholder="field.final.placeholder"
                 @on-change="$emit('input', $event || null)"
                 @on-clear="$emit('input', null)"></date-picker>
  </div>
</template>

<script>
  export default {
    name: 'FormFieldDate',
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
