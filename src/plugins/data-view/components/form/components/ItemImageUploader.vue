<template>

  <div class="block-upload">

    <!-- TODO: 不重要：上传进度效果未实现 -->
    <!--<template v-else>-->
    <!--<progress v-if="field.showProgress" :percent="percentage" hide-info></progress>-->
    <!--</template>-->
    <!--:on-success="handleSuccess"-->
    <!--:on-format-error="handleFormatError"-->
    <!--:on-exceeded-size="handleMaxSize"-->
    <!--action="//jsonplaceholder.typicode.com/posts/"-->
    <!--:default-file-list="defaultList"-->

    <upload
      ref="upload"
      :show-upload-list="false"
      :format="['jpg','jpeg','png']"
      :max-size="2048"
      :before-upload="handleUpload"
      :action="action || ''"
      multiple
      :style="{width: '75px', height: '75px', boxSizing: 'content-box'}">
    </upload>
    <div class="block-upload-cover">
      <icon type="ios-camera" size="20" v-if="supportUpload"
            @click="triggerUpload()"></icon>
      <icon type="ios-link" size="20" v-if="supportLink"
            @click="addImageLink()"></icon>
    </div>
  </div>

</template>

<script>
  export default {
    name: 'ItemImageUploader',
    props: {
      action: {
        // 上传地址
        type: String,
        default: ''
      },
      supportUpload: {
        // 是否支持上传
        type: Boolean,
        default: true
      },
      supportLink: {
        // 是否支持粘贴外链
        type: Boolean,
        default: true
      }
    },
    methods: {
      triggerUpload () {
        const vm = this
        vm.$refs.upload.$el.getElementsByTagName('input')[0].click()
      },
      handleUpload (file) {
        const vm = this
        vm.addImage(file)
        return false
      },
      async addImageLink () {
        const vm = this
        vm.$emit('input', {
          action: 'add',
          url: await vm.$prompt('请输入图片链接')
        })
      },
      addImage (value) {
        const vm = this
        vm.$emit('input', {
          action: 'add',
          file: value
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "../../../../../../src/style/defines";

  @sz: 75px;

  .block-upload {
    display: block;
    float: left;
    width: @sz;
    height: @sz;
    text-align: center;
    border: 1px solid #eeeeee;
    border-radius: 4px;
    overflow: hidden;
    background: #fff;
    position: relative;
    /*margin-top: 10px;*/
    .block-upload-cover {
      display: block;
      background: none;
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      padding: (-26px+75px)*0.5 0;
      i {
        display: inline-block;
        vertical-align: top;
        font-size: 24px;
        width: 24px;
        height: 24px;
        cursor: pointer;
      }
    }
  }

  .block-upload /deep/ .ivu-upload {
    width: @sz;
    height: @sz;
    line-height: @sz;
    border: 0;
  }
</style>
