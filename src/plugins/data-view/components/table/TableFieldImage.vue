<template>
  <a class="table-field-image" v-if="value"
     @click="previewImages([value])">
    <img :src="value" :style="field.style||{}"/>
  </a>
</template>

<script>
  export default {
    name: 'TableFieldImage',
    props: {
      value: {
        type: String,
        required: false,
        objectFit: 'cover'
      },
      field: {
        type: Object
      }
    }
  }
</script>

<style type="less" scoped>
  .table-field-image {
    display: inline-block;
    vertical-align: middle;
    padding: 8px 0;
  }

  img {
    display: block;
  }
</style>
