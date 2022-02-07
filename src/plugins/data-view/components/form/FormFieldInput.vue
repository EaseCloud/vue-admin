<template>
  <div class="field-item field-item-input"
       :style="{width: field.width || '250px'}">
    <i-input class="form-field-input"
             ref="input"
             v-model="field.value"
             @input="$emit('input', $event)"
             :type="field.final.htmlType || 'text'"
             :size="field.size"
             :rows="field.rows || 5"
             :disabled="field.final.disabled"
             :readonly="field.final.readonly"
             :placeholder="field.final.placeholder"></i-input>
  </div>
</template>

<script>
  export default {
    name: 'FormFieldInput',
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
      async reload () {
        const vm = this
        // 支持 onWrite 回写到控件，其他尚未实现的控件可以用同样方法支持
        if (vm.$refs.input) {
          vm.$refs.input.setCurrentValue(vm.field.value)
        }
      }
    }
  }
</script>
