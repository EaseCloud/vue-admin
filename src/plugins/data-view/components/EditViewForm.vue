<template>
  <!-- 如果是新建的话需要 EmbedForm 自动 init 对象，否则设置 noInit 等待数据载入 -->
  <embed-form :fields="fields"
              :noInit="!!id"
              @update="$emit('update', $event)"
              ref="form"></embed-form>
</template>

<script>
  import defaults from '../defaults'

  export default {
    name: 'EditViewForm',
    props: {
      // TODO: 所有属性支持的 finalize 函数格式需要确定并且文档化
      id: { type: Number, default: 0 },
      model: { type: String, required: true },
      title: { type: [String, Function], default: '编辑视图' },
      subtitle: { type: [String, Function], default: 'EditView' },
      pk: { type: String, default: 'id' },
      fields: { type: Array, required: true },
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
      size: {
        default: 'small',
        validator (value) {
          return ['large', 'default', 'small'].indexOf(value) > -1
        }
      }
    },
    computed: {
      hooks () {
        const vm = this
        return { ...defaults.hooks, ...(vm.$attrs.hooks || {}) }
      },
      item () {
        const vm = this
        return vm.$refs.form.item
      }
    },
    data () {
      const vm = this
      return {
        id_: vm.id,
        loading: false,
        initialized: false
      }
    },
    methods: {
      async reload () {
        const vm = this
        // 要支持外部更新 id 之后重载内容
        vm.id_ = vm.id
        const $form = await vm.waitFor(vm.$refs, 'form')
        // 手动调用（非 mounted 首次加载）时，手动触发 $form 的 reload
        if (vm.initialized) await $form.reload()
        // 获取主体信息，如果 id_ 为 0 即为新增，不获取数据
        if (vm.id_) await vm.loadItem()
        // 首次加载进来是 false，只要跑过一次 reload 就变成 true
        vm.initialized = true
      },
      // async setField (key, value) {
      //   const vm = this
      //   // TODO: 试下这个 waitFor 是不是多余的
      //   vm.waitFor(vm.$refs, 'form').then(form => {
      //     form.setField(key, value)
      //   })
      // },
      async loadItem () {
        const vm = this
        vm.loading = true
        const $form = await vm.waitFor(vm.$refs, 'form')
        let item
        item = await vm.hooks.action_load_data_single.apply(vm, [vm.id_])
        item = await vm.hooks.filter_item_before_render_single.apply(vm, [item])
        await $form.setItem(item)
        vm.$emit('loaded', item)
        vm.loading = false
      },
      async deleteItem () {
        const vm = this
        await vm.actionDelete(vm.item)
      },
      async save () {
        const vm = this
        let itemToSave = vm.item
        const isCreate = !vm.id_
        itemToSave = await vm.config.hooks.filter_edit_view_pre_save.apply(vm, [vm.item])
        vm.$emit('pre_save', itemToSave)
        let itemAfterSave
        if (isCreate) {
          // 新建的情况
          itemAfterSave = await vm.config.hooks.action_edit_view_create_item.apply(vm, [itemToSave])
        } else {
          // 编辑的情况
          itemAfterSave = await vm.config.hooks.action_edit_view_update_item.apply(vm, [itemToSave])
        }
        vm.id_ = itemAfterSave[await vm.finalize(vm.pk)]
        await vm.config.hooks.action_edit_view_post_save.apply(vm, [itemAfterSave])
        vm.$emit('post_save', itemAfterSave)
        return itemAfterSave
      },
      async erase () {
        const vm = this
        return vm.config.action_data_view_delete_item.apply(vm, [vm.item])
      },
      async validate () {
        const vm = this
        return vm.$refs.form.validate()
      }
    }
  }
</script>
