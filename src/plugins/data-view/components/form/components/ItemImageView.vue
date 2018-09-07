<template>
  <div class="block-image-wrapper">
    <div class="move move-left" v-if="index>0 && !readonly && !disabled">
      <icon type="ios-arrow-back"
            @click="move(index-1)"></icon>
    </div>
    <div class="block-image">
      <img :src="urls[index]">
      <div class="block-image-cover">
        <icon type="ios-eye" @click.native="previewImages(urls, index)"></icon>
        <icon type="ios-trash" @click.native="removeImage(index)"
              v-if="!readonly && !disabled"></icon>
      </div>
    </div>
    <div class="move move-right" v-if="index<urls.length-1 && !readonly && !disabled">
      <icon type="ios-arrow-forward"
            @click="move(index)"></icon>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      urls: { type: Array },
      index: { type: Number, default: 0 },
      readonly: { type: Boolean, default: false },
      disabled: { type: Boolean, default: false }
    },
    methods: {
      removeImage (index) {
        const vm = this
        vm.$emit('input', {
          action: 'remove',
          index
        })
      },
      move (index) {
        const vm = this
        vm.$emit('input', {
          action: 'move',
          index
        })
      }
    }
  }
</script>

<style lang="less">
  @import "../../../../../../src/style/defines";

  .block-image-wrapper .move {
    .transition(all 0.2s ease-in-out);
  }
</style>

<style lang="less" scoped>
  @import "../../../../../../src/style/defines";

  @sz: 75px;

  .field-item-gallery {
    display: inline-block;
    .clearfix();
  }

  .block-image-wrapper {
    float: left;
    margin-right: 10px;
    .move {
      width: 0;
      .transition(all 0.2s ease-in-out);
      overflow: hidden;
      height: @sz;
      float: left;
      i.ivu-icon {
        cursor: pointer;
        float: left;
        line-height: @sz;
      }
    }
    &:hover .move {
      .transition(all 0.2s ease-in-out);
      width: auto;
    }
  }

  .block-image {
    float: left;
    width: @sz;
    height: @sz;
    text-align: center;
    line-height: @sz;
    border: 1px solid #eeeeee;
    border-radius: 4px;
    overflow: hidden;
    position: relative;
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
</style>
