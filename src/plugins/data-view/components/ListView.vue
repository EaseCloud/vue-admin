<template>
  <card class="page-content list-view">
    <div slot="title" class="page-header">
      <h3 class="title">{{title}}</h3>
      <h4 class="subtitle">{{subtitle}}</h4>
      <div class="controls">
        <i-button v-for="(action, i) in listActions" :key="i"
                  :type="action.buttonType"
                  @click="action.action.apply(this)">{{action.label}}
        </i-button>
        <i-button v-if="options.can_create===void 0 || options.can_create"
                  @click="redirectCreate" type="success">新建
        </i-button>
        <i-button @click="refresh" type="ghost">刷新</i-button>
        <i-button @click="closeCurrentPage">关闭</i-button>
      </div>
    </div>
    <!-- TODO: 从内部 emit 出来的 page_to 同样要在 url 上处理 -->
    <list-view-table v-bind="listViewOptions"
                     @loaded="onLoaded"
                     @query="onQuery"
                     @page_to="pageTo"
                     @page_size_to="pageSizeTo"
                     ref="table">
      <slot name="footer" slot="footer"></slot>
    </list-view-table>
    <div class="page-footer" v-if="listViewOptions.showPager">
      <page ref="pager"
            :total="$refs.table && $refs.table.pager.count"
            :current="$refs.table && $refs.table.pager.page"
            show-sizer
            show-total
            :page-size="Number(listViewOptions.pageSize) || 10"
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
        const initQuery = { ...vm.$route.query }
        delete initQuery.page
        delete initQuery.page_size
        return {
          showPager: true,
          ...vm.$attrs,
          ...vm.$props,
          page: Number(vm.$route.query.page) || vm.$props.page,
          pageSize: Number(vm.$route.query.page_size) || vm.$props.pageSize,
          initQuery
        }
      },
      hooks () {
        const vm = this
        return { ...defaults.hooks, ...(vm.$attrs.hooks || {}) }
      }
    },
    methods: {
      refresh () {
        const vm = this
        vm.$refs.table.reload()
      },
      onLoaded (items) {
        const vm = this
        vm.$emit('loaded', items)
      },
      onQuery (queryChange) {
        // console.log('onQuery', queryChange)
        const vm = this
        const query = { ...vm.$route.query }
        vm._.forEach(queryChange, (value, key) => {
          // 删除查询条件机制
          if (value === null || value === void 0) {
            delete query[key]
          } else {
            query[key] = value
          }
        })
        vm.$router.replace({ query })
      },
      async pageTo (page) {
        const vm = this
        // 需要的时候才跳转，跳转后交由 $watch.$route 接管
        if (Number(vm.$route.query.page || 1) !== Number(page)) {
          vm.$router.replace({ query: { ...vm.$route.query, page } })
        }
      },
      async pageSizeTo (pageSize) {
        const vm = this
        // 需要的时候才跳转，跳转后交由 $watch.$route 接管
        if (Number(vm.$route.query.page_size || 10) !== Number(pageSize)) {
          vm.$router.replace({ query: { ...vm.$route.query, page_size: pageSize } })
        }
      }
    },
    watch: {
      async $route (routeTo, routeFrom) {
        const vm = this
        // console.log('>>> route', routeFrom, routeTo)
        // 本页 query 参数跳转处理，传递参数变化进 ListViewTable
        if (routeFrom.path === routeTo.path) {
          const $table = await vm.waitFor(vm.$refs, 'table')
          // 先剔除 page_size 和 page 的 query 参数
          if (routeTo.query.page_size && Number(routeTo.query.page_size) !== Number(routeFrom.query.page_size)) {
            $table.pageSizeTo(Number(routeTo.query.page_size))
          }
          if (routeTo.query.page && Number(routeTo.query.page) !== Number(routeFrom.query.page)) {
            $table.pageTo(Number(routeTo.query.page))
          }
          // 强制变更查询条件
          const query = { ...vm.$route.query }
          delete query.page
          delete query.page_size
          $table.doQuery(query)
        }
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
      background: white;
      z-index: 2;
    }
    & /deep/ .ivu-card-body {
      position: absolute;
      top: 62px;
      left: 0;
      right: 0;
      bottom: 0;
      padding-bottom: 60px;
    }
    .list-view-table {
      position: absolute;
      top: 0;
      bottom: 62px;
      left: 0;
      right: 0;
      padding: 16px;
      overflow-y: auto;
    }
  }
</style>
