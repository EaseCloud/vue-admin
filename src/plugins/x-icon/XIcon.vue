<template>
  <div class="x-icon"
       :style="{
       color: 'inherit',
       fontSize:!!size&&size+'px',
       paddingTop:!!(height&&size) && (height-size)*0.5+'px',
       width:!!(width||size)&&(width||size)+'px',
       height:!!(height||size)&&(height||size)+'px'}">
    <i :class="name" style="display: block; margin: 0 auto;"></i>
  </div>
</template>

<script>
  export default {
    props: {
      name: { type: String },
      size: { type: Number },
      width: { type: Number },
      height: { type: Number }
    }
  }
</script>

<style type="less" scoped>
  .x-icon {
    display: inline-block;
    text-align: center;
  }
</style>
