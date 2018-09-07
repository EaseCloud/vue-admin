<template>
  <div class="html-viewer" v-show="url">
    <div class="html-wrapper">
      <iframe ref="iframe" v-if="url" :src="url"
              :style="{width: width+'px', height: height+'px'}"></iframe>
    </div>
    <ul class="actions" @click.stop>
      <li>
        <a href="javascript:"
           @click="refresh()">
          <x-icon name="fa fa-sync"></x-icon>
        </a>
      </li>
      <li>
        <a target="_blank" :href="url">
          <x-icon name="fa fa-share-alt"></x-icon>
        </a>
      </li>
      <li>
        <a href="javascript:" @click="close()">
          <x-icon name="fa fa-times"></x-icon>
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        url: null,
        width: 375,
        height: 667
      }
    },
    methods: {
      refresh () {
        const vm = this
        const url = vm.url
        vm.url = null
        vm.$nextTick(() => {
          vm.url = url
        })
      },
      close () {
        const vm = this
        vm.url = null
      }
    }
  }
</script>

<style rel="stylesheet/less" lang="less" scoped>
  .html-viewer {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 1001;
    background: rgba(0, 0, 0, 0.7);
  }

  .html-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 90px;
    right: 0;
    margin: auto;
    max-width: 80%;
    max-height: 80%;
    background: 50% 50% no-repeat;
    background-size: contain;
    overflow: hidden;
    iframe {
      border: 0;
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      margin: auto;
      max-width: 100%;
      max-height: 100%;
      /*width: auto;*/
      /*height: auto;*/
      object-fit: contain;
      -o-object-fit: contain;
      background: white;
    }
  }

  ul.actions {
    position: absolute;
    text-align: center;
    left: 0;
    right: 0;
    height: 60px;
    bottom: 30px;
    line-height: 60px;
    font-size: 36px;
    li {
      display: inline-block;
      margin: 0 20px;
      a {
        color: rgba(255, 255, 255, 0.6);
        &:hover {
          color: white;
        }
        &.disabled {
          cursor: not-allowed;
          color: rgba(255, 255, 255, 0.2);
        }
      }
    }
  }
</style>
