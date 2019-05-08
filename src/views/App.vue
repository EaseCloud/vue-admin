<template>
  <div id="main" class="app-main" v-if="ready">
    <router-view></router-view>
  </div>
</template>

<script type="text/babel">
  export default {
    data () {
      return {
        // theme: this.$store.state.app.themeColor
        ready: false
      }
    },
    async mounted () {
      const vm = this
      await vm.config.hooks.action_root_mounted.apply(vm)
      vm.ready = true
    },
    beforeDestroy () {
    },
    methods: {}
  }
</script>

<style>
  html, body {
    width: 100%;
    height: 100%;
    background: #f0f0f0;
    overflow: hidden;
  }

  .app-main {
    width: 100%;
    height: 100%;
  }
</style>
