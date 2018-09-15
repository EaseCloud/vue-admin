<template>
  <div class="field-item field-item-upload"
       :style="{width: !!field.final.width && field.final.width}">
    <upload v-if="!field.readonly && !field.disabled && !(!field.multiple && value.length)"
            :drag="!!field.drag"
            :accept="field.accept"
            :multiple="!!field.multiple"
            action=""
            :before-upload="handleUpload">
      <i-button size="small">上传文件</i-button>
    </upload>
    <ul class="list-file" v-if="value.length">
      <li class="item-file" v-for="(item, i) in value" :key="i">
        <a class="link-file" :href="item.url" target="_blank">
          <x-icon :name="getIcon(item.name)"></x-icon>
          {{item.name}}
        </a>
        <x-icon class="link-remove" name="fa fa-times-circle"
                :height="22"
                @click="onRemove(i)"></x-icon>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    name: 'FormFieldUpload',
    props: {
      field: {
        type: Object,
        default: () => {
        }
      }
    },
    data () {
      return {
        value: []
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
      handleUpload (file) {
        const vm = this
        vm.$emit('input', { file, action: 'add' })
        return false
      },
      onRemove (index) {
        const vm = this
        vm.$emit('input', { index, action: 'remove' })
      },
      getIcon (fileName) {
        if (/.(?:png|jpg|jpeg|tif|bmp|gif)$/.test(fileName)) {
          return 'far fa-image'
        } else if (/.(?:pdf)$/.test(fileName)) {
          return 'far fa-pdf'
        } else if (/.docx?$/.test(fileName)) {
          return 'far fa-file-word'
        } else if (/.xlsx?$/.test(fileName)) {
          return 'far fa-file-excel'
        } else if (/.pptx?$/.test(fileName)) {
          return 'far fa-file-powerpoint'
        } else if (/.(?:zip|gz|gzip|tar|bz2|7z|rar)$/.test(fileName)) {
          return 'far fa-file-archive'
        }
        return 'fa fa-paperclip'
      }
    }
  }
</script>

<style lang="less">
  @import "../../../../libs/less-template/template-defines";

  .field-item-upload {
    width: 100%;
    max-width: 420px;
  }

  ul.list-file {
    list-style-type: none;
    display: block;
    border: 1px solid #eee;
    padding: 3px;
    .rounded-corners(4px);
    li.item-file {
      .clearfix();
      display: block;
      line-height: 24px;
      padding: 0 5px;
      .rounded-corners(4px);
      &:hover {
        background: #f5f5f5;
      }
      .link-file {
        float: left;
        .x-icon {
          margin-right: 4px;
        }
      }
      .link-remove {
        cursor: pointer;
        float: right;
      }
    }
  }
</style>
