<template>
  <div class="field-item field-item-gallery"
       style="margin-bottom: -8px;"
       :style="{width: !!field.final.width && field.final.width}">
    <!-- 图片浏览块 -->
    <item-image-view
      style="margin-bottom: 8px;"
      v-for="(url, i) in value" :key="url"
      :urls="value" :index="i"
      @input="handleInput"
      :readonly="field.readonly"
      :disabled="field.disabled"></item-image-view>
    <!-- 上传块 -->
    <item-image-uploader
      style="margin-bottom: 8px;"
      v-if="!field.readonly && !field.disabled && !field.max || value.length < field.max"
      :action="field.action || ''"
      :supportUpload="field.supportUpload === void 0 || field.supportUpload"
      :supportLink="field.supportLink === void 0 || field.supportLink"
      @input="$emit('input', $event)"></item-image-uploader>
    <!-- 禁用修改时 -->
    <div v-if="(field.readonly || field.disabled) && !field.value.length">（无）</div>
  </div>
</template>

<script>
  import ItemImageUploader from './components/ItemImageUploader.vue'
  import ItemImageView from './components/ItemImageView.vue'

  export default {
    name: 'FormFieldGallery',
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
        value: [],
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
      handleInput (data) {
        const vm = this
        vm.$emit('input', data)
      }
    }
  }
</script>
