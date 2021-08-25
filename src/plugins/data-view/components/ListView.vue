<template>
  <card class="page-content list-view" :class="{'no-footer': !(listViewOptions.showPager&&pager)}">
    <div slot="title" class="page-header">
      <h3 class="title">{{ title }}</h3>
      <h4 class="subtitle">{{ subtitle }}</h4>
      <slot name="title"></slot>
      <div class="controls">
        <template v-for="(action, i) in batchActions">
          <i-button :key="i"
                    v-if=" action.display === void 0 ||
                          typeof(action.display) === 'function' && action.display(this) ||
                          typeof(action.display) !== 'function' && !!action.display"
                    :type="action.buttonType"
                    @click="doAction(action.action, [$refs.table.selectedItems])">{{ action.label }}
          </i-button>
          <i :key="'_'+i"><!--避免按钮之间粘在一起--></i>
        </template>
        <template v-for="(action, i) in listActions">
          <i-button :key="i"
                    v-if=" action.display === void 0 ||
                          typeof(action.display) === 'function' && action.display(this) ||
                          typeof(action.display) !== 'function' && !!action.display"
                    :type="action.buttonType"
                    @click="doAction(action.action, $refs.table)">{{ action.label }}
          </i-button>
          <i :key="'_'+i"><!--避免按钮之间粘在一起--></i>
        </template>
        <i-button v-if="options.can_create===void 0 || options.can_create"
                  @click="redirectCreate" type="success">新建
        </i-button>
        <i-button v-if="options.can_refresh===void 0 || options.can_refresh"
                  @click="refresh">刷新
        </i-button>
        <i-button v-if="options.can_close===void 0 || options.can_close"
                  @click="closeCurrentPage">关闭
        </i-button>
      </div>
    </div>
    <!-- TODO: 从内部 emit 出来的 page_to 同样要在 url 上处理 -->
    <list-view-table v-bind="listViewOptions"
                     @loaded="onLoaded"
                     @query="onQuery"
                     @select="$emit('select', $event)"
                     @page_to="pageTo"
                     @page_size_to="pageSizeTo"
                     ref="table">
      <slot name="footer" slot="footer"></slot>
    </list-view-table>
    <div class="page-footer" v-if="listViewOptions.showPager&&pager">
      <page ref="pager"
            :total="pager.count"
            :current="pager.page"
            :page-size-opts="pageSizeOpts"
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
    data () {
      return {
        pager: null
      }
    },
    computed: {
      listViewOptions () {
        const vm = this
        const initQuery = {...vm.$route.query}
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
      activeHooks () {
        const vm = this
        return {
          ...defaults.hooks,
          ...vm.config.hooks,
          ...(vm.$attrs.hooks || {})
        }
      },
      pageSizeOpts () {
        const vm = this
        const opts = [10, 20, 30, 40]
        if (opts.indexOf(Number(vm.pageSize)) === -1) opts.push(vm.pageSize)
        opts.sort((a, b) => a - b)
        return opts
      }
    },
    methods: {
      refresh () {
        const vm = this
        vm.$refs.table.reload()
      },
      onLoaded (items) {
        const vm = this
        vm.pager = vm.$refs.table.pager
        vm.$emit('loaded', items)
      },
      onQuery (queryChange) {
        // console.log('onQuery', queryChange)
        const vm = this
        const query = {...vm.$route.query}
        vm._.forEach(queryChange, (value, key) => {
          // 删除查询条件机制
          if (value === null || value === void 0) {
            delete query[key]
          } else {
            query[key] = value
          }
        })
        vm.$router.replace({query}).catch(_ => _)
      },
      async pageTo (page) {
        const vm = this
        // 需要的时候才跳转，跳转后交由 $watch.$route 接管
        if (Number(vm.$route.query.page || 1) !== Number(page)) {
          await vm.$router.replace({query: {...vm.$route.query, page}}).catch(_ => _)
        }
      },
      async pageSizeTo (pageSize) {
        const vm = this
        // 需要的时候才跳转，跳转后交由 $watch.$route 接管
        if (Number(vm.$route.query.page_size || 10) !== Number(pageSize)) {
          await vm.$router.replace({query: {...vm.$route.query, page_size: pageSize}}).catch(_ => _)
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
          const query = {...vm.$route.query}
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
      //z-index: 2;
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

    &.no-footer {
      padding-bottom: 0;

      & /deep/ .ivu-card-body {
        padding-bottom: 0;
      }

      .list-view-table {
        bottom: 2px;
      }
    }
  }
</style>
