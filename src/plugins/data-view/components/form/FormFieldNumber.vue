<template>
  <div class="field-item field-item-number"
       v-if="display"
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
                  ref="input"
    ></input-number>
  </div>
</template>

<script>
  export default {
    name: 'FormFieldNumber',
    data () {
      return {
        display: true
      }
    },
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
    },
    methods: {
      reload () {
        const vm = this
        vm.display = false
        vm.$nextTick(() => { vm.display = true })
      }
    }
  }
</script>
