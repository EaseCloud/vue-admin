<template>
  <div class="jsmind-container" v-dragscroll:nochilddrag
       @contextmenu="$emit('mind-menu', $event)"
  ></div>
</template>

<script>
import Vue from 'vue'
import _ from 'lodash-es'
// TODO: import 放在一个 install 里面，不装不引入
import './JsMindPro/src/style/jsmind.css'
import './JsMindPro/src/style/jsmind.theme-xmind.css'
import JsMind from './JsMindPro/src/js/JsMind'

import './JsMindPro/src/js/extensions/JsMindExtensionDraggable'
import './JsMindPro/src/js/extensions/JsMindExtensionDragScroll'
import RenderComponent from '../../components/RenderComponent'
// import('./JsMindPro/js/jsmind/jsmind.screenshot')

const Render = Vue.extend((RenderComponent))

export default {
  data () {
    return {}
  },
  props: {
    options: {type: Object},
    meta: {
      type: Object,
      default: () => ({name: 'jsMind', author: 'VueAdmin', version: '1.0'})
    },
    format: {
      type: String,
      default: 'node_array',
      validator: s => /node_tree|node_array|freemind/.test(s)
    },
    data: {
      required: true
    }
  },
  computed: {
    jm () {
      return this.$options.jm
    }
  },
  async mounted () {
    const vm = this
    const options = {
      container: vm.$el,
      editable: vm.options.editable === void 0 || vm.options.editable,
      theme: 'xmind',
      mode: 'side',           // 显示模式: both/side
      support_html: true,    // 是否支持节点里的HTML元素
      async render_node (el, node) {
        // destroy old component
        if (node.meta.view.component) {
          node.meta.view.component.$destroy()
          delete node.meta.view.component
        }
        // const attrs = {
        //   nodeid: el.attributes.nodeid,
        //   class: [...el.classList],
        //   style: el.attributes.style.nodeValue
        // }
        const attrs = _.reduce(el.attributes, (obj, param) => {
          obj[param.nodeName] = param.nodeValue
          return obj
        }, {})

        // console.log(attrs)
        const component = new Render({el, render: h => vm.options.renderNode(h, node, attrs)})
        node.meta.view.component = component
        return component.$el
      },
      view: {
        engine: 'svg',   // 思维导图各节点之间线条的绘制引擎
        hmargin: 100,        // 思维导图距容器外框的最小水平距离
        vmargin: 50,         // 思维导图距容器外框的最小垂直距离
        line_width: 1,       // 思维导图线条的粗细
        line_color: '#558ED5'   // 思维导图线条的颜色
      },
      layout: {
        hspace: 20,          // 节点之间的水平间距
        vspace: 15,       // 节点之间的垂直间距
        pspace: 10          // 节点与连接线之间的水平间距（用于容纳节点收缩/展开控制器）
      },
      shortcut: {
        enable: true,        // 是否启用快捷键
        // 命名的快捷键事件处理器
        handles: {
          /**
           * 默认的未捕捉热键处理
           * @param e {KeyboardEvent}
           * @param keyName {String} 按键全名，例如 Ctrl+Alt+1
           */
          default (e, keyName) {
            console.log(keyName)
          },
          // expand_all: e => vm.jm.expand_all(),
          // collapse_all: e => vm.jm.collapse_all()
        },
        // 快捷键映射
        mapping: {
          Insert: 'addchild',
          Tab: 'addchild',
          Enter: 'addbrother',
          NumpadEnter: 'addbrother',
          F2: 'editnode',
          Delete: 'delnode',
          Space: 'toggle',
          ArrowLeft: 'left',
          ArrowRight: 'right',
          ArrowUp: 'up',
          ArrowDown: 'down',
          ...(vm.options.keyMap || {})
        }
      }
    }
    // 保留引用
    vm.$options.jm = await JsMind.show(options, vm.format, vm.data)
    vm.$emit('jsmind', vm.$options.jm)

    // TODO: DEBUG
    window.jm = vm.jm

    // 添加热键事件侦听器
    vm.jm.add_event_listener((eventType, params) => {
      if (eventType === JsMind.EVENT_TYPE.edit) {
        const {evt, data} = params
        if (vm[evt] instanceof Function) {
          vm[evt](...data)
        } else {
          console.log(params)
        }
      } else if (eventType === JsMind.EVENT_TYPE.select) {
        vm.$emit('select_node', params.node, params.nodes)
      } else {
        // console.log(eventType, params)
      }
    })
  },
  async beforeDestroy () {
    const vm = this
  },
  methods: {
    // !!WARNING!! 不要尝试重构下面这些操作方法的命名。
    // 之所以使用下划线，是因为跟 JsMindPro 里面的 shortcut 同步，直接动态映射方法名
    async add_node (node) {
      const vm = this
      vm.$emit('add_node', node)
    },
    async insert_node_after (node, nodeAfter) {
      const vm = this
      vm.$emit('add_node', node, nodeAfter)
    },
    async update_node (nodeId, topic) {
      const vm = this
      const node = vm.jm.get_node(nodeId)
      vm.$emit('update_node', node)
    },
    async remove_node (node) {
      const vm = this
      vm.$emit('remove_node', node)
    },
    async remove_nodes (nodes) {
      const vm = this
      vm.$emit('remove_nodes', nodes)
    },
    async move_node (node, parent, prevNode) {
      const vm = this
      vm.$emit('move_node', node, parent, prevNode)
    },
    // ^^^ WARNING END ^^^
  }
}
</script>

<style lang="less" scoped>

.jsmind-container {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
}
</style>

