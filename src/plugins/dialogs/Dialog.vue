<template>
  <modal v-bind="options" :value="value"
         @on-ok="onOk" @on-cancel="onCancel"
         @on-visible-change="onVisibleChange">
    <template v-if="options.render">
      <render-component ref="content" :render="options.render"></render-component>
    </template>
    <template v-else>{{ options.content }}</template>
    <template v-slot:footer>
      <template v-if="options.renderFooter">
        <render-component ref="footer" :render="options.renderFooter"></render-component>
      </template>
      <template v-else>
        <!-- 位置可控，默认情况下放在“取消”、“确认”前面 -->
        <i-button v-for="(action, i) in (options.actions||[]).filter(a => a.position!=='end')"
                  v-if="action.display === void 0 ||
                        typeof(action.display) === 'function' && action.display(this) ||
                        typeof(action.display) !== 'function' && !!action.display"
                  :type="action.buttonType"
                  :ref="action.ref" :key="'start-'+i"
                  :style="{float: action.position==='start'?'left':void 0}"
                  @click="doAction(action.action)">{{ action.label }}
        </i-button>
        <i-button type="text" @click="onCancel()">{{ options.cancelText || '取消' }}</i-button>
        <i-button type="primary" @click="onOk()" v-if="options.onOk">{{ options.okText || '确认' }}</i-button>
        <!-- 位置可控，如果指定了 position: 'end' -->
        <i-button v-for="(action, i) in (options.actions||[]).filter(a => a.position==='end')"
                  v-if="action.display === void 0 ||
                        typeof(action.display) === 'function' && action.display(this) ||
                        typeof(action.display) !== 'function' && !!action.display"
                  :type="action.buttonType"
                  :ref="action.ref" :key="'end-'+i"
                  @click="doAction(action.action)">{{ action.label }}
        </i-button>
      </template>
    </template>
  </modal>
</template>

<script>
export default {
  data () {
    return {value: true}
  },
  props: {
    options: Object
  },
  async mounted () {
    const vm = this
    // 记录对话框打开前的焦点，销毁之后返还焦点
    vm.$options.$elActive = document.activeElement
    // 如果定义了 options.noFocus，则 Enter 键提交会被
    if (vm.options.supportEnter) {
      // 获取焦点，避免触发原有焦点上的事件
      vm.$el.tabIndex = 0
      vm.$el.focus()
      vm.$el.addEventListener('keydown', async e => {
        if (e.key === 'Enter') await vm.onOk()
      })
    }
  },
  async destroyed () {
    const vm = this
    // 销毁后返还焦点
    vm.$options.$elActive.focus()
  },
  methods: {
    async onOk () {
      const vm = this
      vm.options.onOk && await vm.options.onOk.apply(vm)
      if (!vm.options.loading) vm.close()
    },
    async onCancel () {
      const vm = this
      vm.options.onCancel && await vm.options.onCancel.apply(vm)
      if (!vm.options.loading) vm.close()
    },
    close () {
      const vm = this
      vm.$destroy()
      vm.$el.parentElement.removeChild(vm.$el)
    },
    async onVisibleChange (value) {
      const vm = this
      vm.options.onVisibleChange && await vm.options.onVisibleChange.apply(vm, [value])
    }
  }
}
</script>
