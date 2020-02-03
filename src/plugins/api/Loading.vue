<template>
  <div class="loading">
    <scale-loader color="#777"></scale-loader>
  </div>
</template>

<script>
import ScaleLoader from 'vue-spinner/src/ScaleLoader'

export default {
  components: { ScaleLoader }
}
</script>

<style lang="less" scoped>
.loading {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
  background: rgba(0, 0, 0, 0.1);
  .v-spinner {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    height: 44px;
    margin: auto;
  }
}
</style>
