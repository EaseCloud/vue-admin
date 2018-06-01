<template>
  <card class="page-content edit-view">
    <div slot="title" class="page-header">
      <h3 class="title">{{title}}</h3>
      <h4 class="subtitle">{{subtitle}}</h4>
      <div class="controls">
        <!-- TODO: custom actions -->
        <i-button v-for="(action, i) in actions" :key="i"
                  :type="action.buttonType"
                  @click="action.action">{{action.label}}
        </i-button>
        <i-button @click="save">保存并继续编辑</i-button>
        <i-button type="primary" @click="submit">保存</i-button>
        <i-button @click="refresh">刷新</i-button>
        <i-button @click="closeCurrentPage">关闭</i-button>
      </div>
    </div>
    <edit-view-form v-bind="editViewOptions" ref="form">
    </edit-view-form>
  </card>
</template>

<script>
  import EditViewForm from './EditViewForm.vue'

  export default {
    name: 'EditView',
    props: {
      ...EditViewForm.props
    },
    computed: {
      editViewOptions () {
        const vm = this
        return {
          ...vm.$attrs,
          ...vm.$props,
          id: Number(vm.$route.params.id)
        }
      }
    },
    data () {
      return {
        cacheName: '',
        cachePath: ''
      }
    },
    methods: {
      async refresh () {
        const vm = this
        const form = await vm.waitFor(vm.$refs, 'form')
        await form.reload()
      },
      async save () {
        // TODO: 提交之前应该实现 validate 验证方法，以校验 required 等字段的情况
        const vm = this
        const isCreate = !vm.$refs.form.id_
        await vm.$refs.form.save()
        // 保存之后
        if (isCreate) {
          // 如果是创建要跳转页面
          const route = await vm.getModelEditRoute(vm.model, vm.$refs.form.id_)
          await vm.replacePage(route)
          vm.$router.push(route)
        }
        await vm.refresh()
      },
      async submit () {
        const vm = this
        await vm.save()
        vm.closeCurrentPage()
      }
    },
    mounted () {
      const vm = this
      vm.cacheName = vm.$route.name
      vm.cachePath = vm.$route.path
    },
    watch: {
      $route (to) {
        const vm = this
        // 使用 cacheName 和 cachePage 缓存属性来避免同组件跳转时的内容不更新
        if (to.name === vm.cacheName && to.path !== vm.cachePath) {
          vm.cachePath = to.path
          vm.$nextTick(() => {
            vm.$refs.form.reload()
          })
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "../../../style/defines";

  .page-content.edit-view {
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
  }

  .edit-view /deep/ .ivu-card-body {
    position: absolute;
    top: 62px;
    left: 0;
    bottom: 0;
    right: 0;
    overflow: auto;
  }
</style>
