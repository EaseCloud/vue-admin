<template>
  <div class="block-image-wrapper">
    <div class="move move-left" v-if="index>0 && !readonly && !disabled">
      <x-icon name="fa fa-chevron-left"
              :size="12" :height="75"
              @click="move(index-1)"></x-icon>
    </div>
    <div class="block-image">
      <img :src="urls[index]">
      <div class="block-image-cover">
        <div class="actions">
          <x-icon name="fa fa-eye" :width="24" :height="24" @click.native="previewImages(urls, index)"></x-icon>
          <x-icon name="fa fa-trash" :width="24" :height="24" @click.native="removeImage(index)"
                  v-if="!readonly && !disabled"></x-icon>
        </div>
      </div>
    </div>
    <div class="move move-right" v-if="index<urls.length-1 && !readonly && !disabled">
      <x-icon name="fa fa-chevron-right"
              :size="12" :height="75"
              @click="move(index)"></x-icon>
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
      .x-icon {
        cursor: pointer;
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
    .actions {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      height: 24px;
      margin: auto;
      color: #fff;
      .x-icon {
        font-size: 14px;
        cursor: pointer;
        vertical-align: top;
      }
    }
  }
</style>
