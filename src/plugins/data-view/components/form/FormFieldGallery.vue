<template>
  <div class="field-item field-item-gallery"
       :style="{width: !!field.final.width && field.final.width}">
    <div class="block-image" v-for="(url, i) in value" :key="url">
      <img :src="url">
      <div class="block-image-cover">
        <icon type="eye" @click.native="previewImages(value, i)"></icon>
        <icon type="trash-a" @click.native="removeImage(i)"
              v-if="!field.readonly && !field.disabled"></icon>
      </div>
    </div>
    <!-- TODO: 不重要：上传进度效果未实现 -->
    <!--<template v-else>-->
    <!--<progress v-if="field.showProgress" :percent="percentage" hide-info></progress>-->
    <!--</template>-->
    <!--:on-success="handleSuccess"-->
    <!--:on-format-error="handleFormatError"-->
    <!--:on-exceeded-size="handleMaxSize"-->
    <!--action="//jsonplaceholder.typicode.com/posts/"-->
    <!--:default-file-list="defaultList"-->
    <upload v-if="!field.readonly && !field.disabled && !field.max || value.length < field.max"
            ref="upload"
            :show-upload-list="false"
            :format="['jpg','jpeg','png']"
            :max-size="2048"
            :before-upload="handleUpload"
            :action="field.action || ''"
            multiple
            type="drag"
            :style="{width: '75px', height: '75px', boxSizing: 'content-box'}"
            class="block-upload">
      <div class="block-upload-cover">
        <icon type="camera" size="20"></icon>
      </div>
    </upload>
    <div v-if="(field.readonly || field.disabled) && !field.value.length">（无）</div>
  </div>
</template>

<script>
  export default {
    name: 'FormFieldGallery',
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
    },
    methods: {
      reload () {
        const vm = this
        vm.value = vm.field.value
      },
      addImage (value) {
        const vm = this
        vm.$emit('input', {
          action: 'add',
          file: value
        })
      },
      removeImage (index) {
        const vm = this
        vm.$emit('input', {
          action: 'remove',
          index
        })
      },
      handleUpload (file) {
        const vm = this
        vm.addImage(file)
        return false
      }
    }
  }
</script>

<style lang="less" scoped>
  @sz: 75px;

  .field-item {
    display: block;
  }

  .block-image {
    display: block;
    float: left;
    width: @sz;
    height: @sz;
    text-align: center;
    line-height: @sz;
    border: 1px solid #eeeeee;
    border-radius: 4px;
    overflow: hidden;
    position: relative;
    &:hover {
      box-shadow: 1px 1px 2px rgba(0, 0, 0, .1);
    }
    margin-right: 10px;
    // TODO: 多图产生换行的时候间距没有了，有空的时候再改
    /*margin-top: 10px;*/
    padding: 4px;
    background: white;
    box-sizing: border-box;
    img {
      width: -10px+@sz;
      height: -10px+@sz;
      display: block;
      object-fit: cover;
    }
    &:hover .block-image-cover {
      display: block;
    }
  }

  .block-image-cover {
    display: none;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, .4);
    i {
      color: #fff;
      display: inline-block;
      vertical-align: middle;
      font-size: 24px;
      width: 24px;
      height: 24px;
      cursor: pointer;
    }
  }

  .block-upload {
    display: block;
    float: left;
    width: @sz;
    height: @sz;
    text-align: center;
    border: none;
    border-radius: 4px;
    overflow: hidden;
    background: #fff;
    position: relative;
    /*margin-top: 10px;*/
    &:hover {
      box-shadow: 1px 1px 2px rgba(0, 0, 0, .1);
    }
  }

  .block-upload /deep/ .ivu-upload-drag {
    width: @sz;
    height: @sz;
    line-height: @sz;
  }

  .block-upload-cover {
    i {
      display: inline-block;
      vertical-align: middle;
      font-size: 24px;
      width: 24px;
      height: 24px;
      cursor: pointer;
    }
  }
</style>
