<template>
  <card class="page-content">
    <div slot="title" class="page-header">
      <h3 class="title">ListView 列表标题</h3>
      <h4 class="subtitle">副标题</h4>
      <div class="controls">
        <i-button>保存</i-button>
        <i-button>关闭</i-button>
      </div>
    </div>
    <list-view-table v-bind="listViewOptions"></list-view-table>
  </card>
</template>

<script>
  import ListViewTable from './ListViewTable.vue'

  export default {
    name: 'ListView',
    props: ListViewTable.props,
    computed: {
      listViewOptions () {
        const vm = this
        return { ...vm.$attrs, ...vm.$props }
      }
    },
    methods: {
      reload () {
        // const vm = this
        // console.log(vm.$props)
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "../../style/defines";

  .page-content {
    position: absolute;
    top: 10px;
    left: 10px;
    right: 10px;
    bottom: 10px;
    .page-header {
      .clearfix();
      .title {
        .title();
        display: inline-block;
        line-height: 32px;
      }
      .subtitle {
        .text();
        display: inline-block;
        line-height: 32px;
        margin-left: 1em;
      }
      .controls {
        float: right;
      }
    }
  }
</style>
