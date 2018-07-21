<template>
  <div class="field-item field-item-switch"
       :style="{width: field.final.width || '250px'}">
    <input-number :value="field.value"
                  @input="$emit('input', $event)"
                  :id="field.id"
                  :max="field.max"
                  :min="field.min"
                  :step="field.step"
                  :precision="field.precision"
                  :placeholder="field.placeholder"
                  :formatter="field.formatter"
                  :parser="field.parser"
                  :disabled="field.disabled"
                  :readonly="field.readonly"
                  :edittable="field.editable"
    ></input-number>
  </div>
</template>

<script>
  export default {
    name: 'FormFieldNumber',
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
