<template>
  <card class="page-content empty-view">
    <div slot="title" class="page-header">
      <h3 class="title">{{title}}<slot name="title"></slot></h3>
      <h4 class="subtitle">{{subtitle}}<slot name="subtitle"></slot></h4>
      <div class="controls">
        <template v-for="(action, i) in actions"
                  v-if="action.display===void 0||finalizeSync(action.display)">
          <i-button :key="i"
                    :type="action.buttonType"
                    @click="doAction(action.action)">{{action.label}}
          </i-button>
          <i :key="'_'+i"><!--避免按钮之间粘在一起--></i>
        </template>
        <i-button v-if="options.can_close===void 0 || options.can_close"
                  @click="closeCurrentPage">关闭
        </i-button>
      </div>
    </div>
    <div class="page-body">
      <slot></slot>
    </div>
  </card>
</template>

<script>
  export default {
    name: 'EmptyView',
    props: {
      title: { type: [String, Function], default: '新的页面' },
      subtitle: { type: [String, Function], default: '' },
      // 操作按钮
      actions: { type: Array, default: () => [] },
      options: {
        type: Object,
        default: () => ({
          can_create: true,
          can_delete: true,
          can_edit: true,
          can_close: true,
          can_refresh: true,
          show_actions: true,
        })
      },
    },
    computed: {},
    data () {
      return {}
    },
    methods: {}
  }
</script>

<style lang="less" scoped>
  @import "../../../style/defines";

  .page-content.empty-view {
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
    .page-body {
      position: absolute;
      top: 61px;
      left: 0;
      right: 0;
      bottom: 0;
      padding: 15px;
      overflow-y: auto;
    }
  }

  .empty-view /deep/ .page-content > .ivu-card-body {
    position: absolute;
    top: 62px;
    left: 0;
    bottom: 0;
    right: 0;
    overflow: auto;
  }

</style>
