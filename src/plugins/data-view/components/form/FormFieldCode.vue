<template>
  <div class="field-item field-item-code"
       :style="{width: field.width || 'auto'}">
    <codemirror class="form-field-input"
                ref="input"
                v-model="field.value"
                :options="{theme: 'default', ...(field.options || {})}"
                @input="$emit('input', $event)"/>
  </div>
</template>

<script>
  export default {
    name: 'FormFieldCode',
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

<style lang="less">
  .field-item-code {
    line-height: 20px;
    .form-field-input {
      width: 100%;
      max-width: 800px;
      height: auto;
    }
  }

  .CodeMirror {
    height: auto;
    max-height: 150px;
    border-radius: 4px;
    border: 1px solid rgb(220, 222, 226);
  }
</style>
