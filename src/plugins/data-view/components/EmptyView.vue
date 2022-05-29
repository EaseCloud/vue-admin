<template>
  <card class="page-content" :class="viewClass">
    <div slot="title" class="page-header">
      <slot name="title"><h3 class="title">{{title}}</h3></slot>
      <slot name="subtitle"><h4 class="subtitle">{{subtitle}}</h4></slot>
      <slot name="extra-title"></slot>
      <div class="controls">
        <template v-for="(action, i) in actions"
                  v-if="action.display===void 0||finalizeSync(action.display)">
          <i-button :key="i"
                    :type="action.buttonType"
                    @click="doAction(action.action)">{{action.label}}
          </i-button>&#32;
        </template>
        <i-button v-if="options.can_close===void 0 || options.can_close"
                  @click="closeCurrentPage">关闭
        </i-button>
      </div>
    </div>
    <div class="page-body">
      <slot></slot>
    </div>
    <div class="page-footer" v-if="options.show_footer">
      <slot name="footer"></slot>
    </div>
  </card>
</template>

<script>
export default {
  name: 'EmptyView',
  props: {
    title: {type: [String, Function], default: '新的页面'},
    subtitle: {type: [String, Function], default: ''},
    viewClass: {type: String, default: 'empty-view'},
    // 操作按钮
    actions: {type: Array, default: () => []},
    options: {
      type: Object,
      default: () => ({
        can_create: true,
        can_delete: true,
        can_edit: true,
        can_close: true,
        can_refresh: true,
        show_actions: true,
        show_footer: false,
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
