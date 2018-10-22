<template>
  <div class="field-item field-item-image"
       :style="{width: !!field.final.width && field.final.width}">
    <!-- 图片浏览块 -->
    <item-image-view
      v-if="value"
      :urls="[value]"
      :readonly="field.readonly"
      :disabled="field.disabled"
      @input="handleInput"></item-image-view>
    <!-- 上传块 -->
    <item-image-uploader
      v-else-if="!field.readonly && !field.disabled"
      :action="field.action || ''"
      :supportUpload="field.supportUpload === void 0 || field.supportUpload"
      :supportLink="field.supportLink === void 0 || field.supportLink"
      @input="handleInput"></item-image-uploader>
    <!-- 禁用修改时 -->
    <div v-else>（无）</div>
  </div>
</template>

<script>
  import ItemImageUploader from './components/ItemImageUploader.vue'
  import ItemImageView from './components/ItemImageView.vue'

  export default {
    name: 'FormFieldImage',
    components: { ItemImageView, ItemImageUploader },
    props: {
      field: {
        type: Object,
        default: () => {
        }
      }
    },
    data () {
      return {
        value: null,
        status: 'finished',
        percentage: 0
      }
    },
    mounted () {
      const vm = this
      vm.field.$el = this
      // 默认不进行回写
      if (vm.field.onWriteField === void 0) vm.field.onWriteField = () => null
    },
    methods: {
      reload () {
        const vm = this
        vm.value = vm.field.value
      },
      update (value) {
        const vm = this
        vm.$emit('input', value)
      },
      handleUpload (file) {
        const vm = this
        vm.update(file)
        return false
      },
      handleInput (data) {
        const vm = this
        vm.$emit('input', data)
      }
    }
  }
</script>
