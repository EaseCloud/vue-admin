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
      value: {},
      field: {
        type: Object,
        default: () => {
        }
      }
    },
    data () {
      return {
        status: 'finished',
        percentage: 0
      }
    },
    methods: {
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
    border: 1px solid transparent;
    border-radius: 4px;
    overflow: hidden;
    background: #fff;
    position: relative;
    /*box-shadow: 0 1px 1px rgba(0, 0, 0, .2);*/
    margin-right: 4px;
    img {
      width: @sz;
      height: @sz;
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
    /*box-shadow: 0 1px 1px rgba(0, 0, 0, .2);*/
    margin-right: 4px;
  }

  .block-upload /deep/ .ivu-upload-drag {
    width: @sz - 2;
    height: @sz - 2;
    line-height: @sz - 2;
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
