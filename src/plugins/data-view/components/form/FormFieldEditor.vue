<template>
  <div class="field-item field-item-editor"
       :style="{width: field.final.width || 'auto'}">
    <quill-editor :value="field.value"
                  :style="field.style"
                  @change="change"
                  ref="editor"
                  :options="field.editorOptions"
    ></quill-editor>
  </div>
</template>

<script>
  export default {
    name: 'FormFieldEditor',
    props: {
      value: {},
      field: {
        type: Object,
        default: () => {
        }
      }
    },
    data () {
      return {
        item: null
      }
    },
    mounted () {
      const vm = this
      vm.field.$el = this
    },
    methods: {
      async reload () {
        // const vm = this
      },
      change ({ quill, html, text }) {
        const vm = this
        vm.$emit('input', html)
      }
    }
  }
</script>
