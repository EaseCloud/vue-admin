<template>
  <div class="x-icon"
       @click="$emit('click', $event)"
       :style="{
       color: 'inherit',
       fontSize:!!size&&size+'px',
       paddingTop:!!(height) && (height-fontSize)*0.5+'px',
       width:!!(width||size)&&(width||size)+'px',
       height:!!(height||size)&&(height||size)+'px'}">
    <i :class="name" style="display: block; margin: 0 auto;"></i>
  </div>
</template>

<script>
  export default {
    data () {
      return { fontSize: 0 }
    },
    props: {
      name: { type: String },
      size: { type: Number },
      width: { type: Number },
      height: { type: Number }
    },
    mounted () {
      const vm = this
      vm.fontSize = parseFloat(window.getComputedStyle(vm.$el).fontSize)
    }
  }
</script>

<style type="less" scoped>
  .x-icon {
    display: inline-block;
    vertical-align: middle;
    text-align: center;
  }
</style>
