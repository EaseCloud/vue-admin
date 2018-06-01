<template>
  <div class="field-item field-item-image"
       :style="{width: !!field.final.width && field.final.width}">
    <div class="block-image" v-if="value">
      <img :src="value">
      <div class="block-image-cover">
        <icon type="eye" @click.native="previewImages([value])"></icon>
        <icon type="trash-a" @click.native="update(null)"></icon>
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
    <upload v-else
            ref="upload"
            :show-upload-list="false"
            :format="['jpg','jpeg','png']"
            :max-size="2048"
            :before-upload="handleUpload"
            :action="field.action || ''"
            type="drag"
            :style="{width: '75px', height: '75px', boxSizing: 'content-box'}"
            class="block-upload">
      <div class="block-upload-cover">
        <icon type="camera" size="20"></icon>
      </div>
    </upload>
  </div>
</template>

<script>
  export default {
    name: 'FormFieldImage',
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
      vm.field.el = this
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
    margin-right: 4px;
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
    &:hover {
      box-shadow: 1px 1px 2px rgba(0, 0, 0, .1);
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
