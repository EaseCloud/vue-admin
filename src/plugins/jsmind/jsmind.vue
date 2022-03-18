<template>
  <div class="jsmind-container" v-dragscroll:nochilddrag></div>
</template>

<script>
import Vue from 'vue'
// TODO: import 放在一个 install 里面，不装不引入
import './JsMindPro/style/jsmind.css'
import './JsMindPro/style/jsmind.theme-xmind.css'
import JsMind from './JsMindPro/js/jsmindpro/JsMind'

import './JsMindPro/js/jsmindpro/extensions/JsMindExtensionDraggable'
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
    data: {required: true}
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
      editable: true,
      theme: 'xmind',
      mode: 'side',           // 显示模式
      support_html: true,    // 是否支持节点里的HTML元素
      render_node (el, node) {
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
        handles: {},         // 命名的快捷键事件处理器
        mapping: {           // 快捷键映射
          addchild: 9,    // <Tab>
          addbrother: 13,    // <Enter>
          editnode: 113,   // <F2>
          delnode: 46,    // <Delete>
          toggle: 32,    // <Space>
          left: 37,    // <Left>
          up: 38,    // <Up>
          right: 39,    // <Right>
          down: 40,    // <Down>
        }
      }
    }
    // 保留引用
    vm.$options.jm = await JsMind.show(options, {
      meta: vm.meta,
      format: vm.format,
      data: vm.data
    })

    // TODO: DEBUG
    window.jm = vm.jm

    vm.jm.add_event_listener((eventType, params) => {
      if (eventType === JsMind.event_type.edit) {
        const {evt, data, node} = params
        if (vm[evt] instanceof Function) {
          vm[evt](...data)
        } else {
          console.log(params)
        }
      } else if (eventType === JsMind.event_type.select) {
        vm.$emit('select_node', vm.jm.get_selected_node())
      } else {
        // console.log(eventType, params)
      }
    })
  },
  methods: {
    async add_node (parentId, nodeId, topic, data) {
      const vm = this
      const node = vm.jm.get_node(nodeId)
      vm.$emit('add_node', node)
    },
    async insert_node_after (prevId, nodeId, topic, data) {
      const vm = this
      const node = vm.jm.get_node(nodeId)
      const prevNode = vm.jm.get_node(prevId)
      vm.$emit('add_node', node, prevNode)
    },
    async update_node (nodeId, topic) {
      const vm = this
      const node = vm.jm.get_node(nodeId)
      vm.$emit('update_node', node)
    },
    async remove_node (nodeId) {
      const vm = this
      vm.$emit('remove_node', nodeId)
    },
    async move_node (node, prevId, parent, direction) {
      const vm = this
      const prevNode = prevId === '_last_' ? null : vm.jm.get_node(prevId)
      vm.$emit('move_node', node, parent, prevNode)
    }
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

