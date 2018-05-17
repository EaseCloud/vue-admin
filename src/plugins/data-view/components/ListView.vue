<template>
  <card class="page-content list-view">
    <div slot="title" class="page-header">
      <h3 class="title">{{title}}</h3>
      <h4 class="subtitle">{{subtitle}}</h4>
      <div class="controls">
        <i-button @click="redirectCreate" type="success">新建</i-button>
        <i-button @click="closeCurrentPage">关闭</i-button>
      </div>
    </div>
    <list-view-table v-bind="listViewOptions"
                     ref="table"></list-view-table>
    <div class="page-footer">
      <page :total="$refs.table && $refs.table.pager.count"
            :current="Number($route.query.page) || 1"
            :page-size="Number($route.query.page_size) || 10"
            show-sizer
            show-total
            @on-change="pageTo(Number($event))"
            @on-page-size-change="pageSizeTo(Number($event))"></page>
    </div>
  </card>
</template>

<script>
  import defaults from '../defaults'
  import ListViewTable from './ListViewTable.vue'

  export default {
    name: 'ListView',
    props: ListViewTable.props,
    computed: {
      listViewOptions () {
        const vm = this
        return {
          ...vm.$attrs,
          ...vm.$props,
          page: Number(vm.$route.query.page) || 1,
          pageSize: Number(vm.$route.query.page_size) || 10
        }
      },
      hooks () {
        const vm = this
        return { ...defaults.hooks, ...(vm.$attrs.hooks || {}) }
      }
    },
    methods: {
      reload () {
        // const vm = this
        window.vv = this
      },
      pageTo (page) {
        const vm = this
        vm.$router.replace({ query: { ...vm.$route.query, page } })
        vm.$refs.table.pageTo(page)
      },
      pageSizeTo (pageSize) {
        const vm = this
        vm.$router.replace({ query: { ...vm.$route.query, page_size: pageSize } })
        vm.$refs.table.pageSizeTo(pageSize)
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "../../../style/defines";

  .page-content.list-view {
    position: absolute;
    top: 10px;
    left: 10px;
    right: 10px;
    bottom: 10px;
    padding-bottom: 60px;
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
    .page-footer {
      position: absolute;
      text-align: right;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 14px 16px;
      border-top: 1px solid rgb(233, 234, 236);
    }
  }
</style>
