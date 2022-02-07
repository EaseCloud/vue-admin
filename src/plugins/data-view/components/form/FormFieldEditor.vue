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
    change ({quill, html, text}) {
      const vm = this
      vm.$emit('input', html)
    }
  }
}
</script>

<!-- 参考例子（含图片上传）
<template>
  <embed-form :fields="fields" ref="form"></embed-form>
</template>

<script>
import _ from 'lodash'
import {quillEditor, Quill} from 'vue-quill-editor'
import {ImageExtend, QuillWatch} from '@/vue-admin/src/libs/quill-image-extend-module'
import ImageResize from '@/vue-admin/src/libs/quill-image-resize-module/ImageResize'

Quill.register('modules/ImageExtend', ImageExtend)
Quill.register('modules/ImageResize', ImageResize)

export default {
  data () {
    const vm = this
    return {
      fields: [{
        key: 'content',
        label: '内容',
        type: 'editor',
        width: '100%',
        description: '请填写回答者需要了解的所有问题相关的信息',
        editorOptions: {
          placeholder: '在这里填写问题的详细内容...',
          modules: {
            toolbar: {
              container: [
                ['bold', 'italic', 'underline', 'strike'],
                ['blockquote', 'code-block'],
                [{'header': 1}, {'header': 2}],
                [{'list': 'ordered'}, {'list': 'bullet'}],
                ['clean'], ['link', 'image']
              ],
              handlers: {
                image () {
                  QuillWatch.emit(this.quill.id)
                }
              }
            },
            ImageExtend: {
              loading: true,
              name: 'image', // 上传图片的字段 formData 的 key
              size: 1, // 单位为 M
              action: '/api/image/', // 上传图片 POST 请求的地址
              response: resp => resp.image // 从响应中提取 URL 的方法
            },
            ImageResize: {
              modules: ['Resize', 'DisplaySize'], // Toolbar 有点问题，不用也罢
              handleStyles: {
                backgroundColor: 'blue',
                width: '6px',
                height: '6px',
                border: 'none',
                color: 'white'
              }
            }
          }
        }
      }]
    }
  }
}
</script>
-->

