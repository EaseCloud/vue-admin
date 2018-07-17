<template>
  <card class="page-content edit-view">
    <div slot="title" class="page-header">
      <h3 class="title">{{title}}</h3>
      <h4 class="subtitle">{{subtitle}}</h4>
      <div class="controls">
        <template v-for="(action, i) in actions"
                  v-if="$refs.form && (action.display===void 0||finalizeSync(action.display, $refs.form.item))">
          <i-button :key="i"
                    :type="action.buttonType"
                    @click="action.action.apply(this, [$refs.form.item])">{{action.label}}
          </i-button>
          <i :key="'_'+i"><!--避免按钮之间粘在一起--></i>
        </template>
        <i-button v-if="$refs.form && (options.can_edit === void 0 || finalizeSync(options.can_edit, $refs.form.item))"
                  @click="save">保存并继续编辑
        </i-button>
        <i-button v-if="$refs.form && (options.can_edit === void 0 || finalizeSync(options.can_edit, $refs.form.item))"
                  type="primary" @click="submit">保存
        </i-button>
        <i-button v-if="Number($route.params.id) && $refs.form &&
                        (options.can_delete === void 0 || finalizeSync(options.can_delete, $refs.form.item))"
                  type="error" @click="remove">删除
        </i-button>
        <i-button @click="refresh">刷新</i-button>
        <i-button @click="closeCurrentPage">关闭</i-button>
      </div>
    </div>
    <slot name="before"></slot>
    <edit-view-form v-bind="editViewOptions"
                    @loaded="$emit('loaded', $event)"
                    ref="form">
    </edit-view-form>
    <slot></slot>
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
          id: Number(vm.$props.id || vm.$route.params.id)
        }
      },
      item () {
        const vm = this
        return vm.$refs.form.item
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
      },
      async remove () {
        const vm = this
        await vm.$confirm('确认删除？')
        await vm.$refs.form.deleteItem()
        vm.closeCurrentPage()
      },
      validate () {
        const vm = this
        return vm.$refs.form.validate()
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
