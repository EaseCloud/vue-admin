<template>
  <embed-form v-if="initialized"
              :fields="fields"
              @update="onUpdate"
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
      title: { type: String, default: '编辑视图' },
      subtitle: { type: String, default: 'EditView' },
      pk: { type: String, default: 'id' },
      fields: { type: Array, required: true },
      // 操作按钮
      actions: { type: Array, default: () => ['edit', 'delete'] },
      options: {
        type: Object,
        default: () => ({
          can_create: true,
          can_delete: true,
          can_edit: true,
          show_actions: true
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
      }
    },
    data () {
      const vm = this
      // 为了避免在没有任何动作之前点击保存提交的表单会有字段 undefined 的情况
      // 所有指定的 default 值的字段都会先手动设置进去
      const defaultItem = {}
      vm.fields.forEach(field => {
        // write init field value
        if (field.value === void 0 && field.default !== void 0) {
          vm.$set(field, 'value', field.default)
        }
        vm.writeField(field, defaultItem)
      })
      return {
        id_: vm.id,
        loading: false,
        initialized: false,
        item: defaultItem
      }
    },
    methods: {
      async reload () {
        const vm = this
        // 获取主体信息，如果 id_ 为 0 即为新增，不获取数据
        if (vm.id_) {
          vm.loading = true
          let item = await vm.hooks.action_load_data_single.apply(vm, [vm.id_])
          item = await vm.hooks.filter_item_before_render_single.apply(vm, [item])
          vm.item = item
          await vm.render()
          vm.$emit('loaded')
        }
        return vm.render()
      },
      async setField (key, value) {
        const vm = this
        // TODO: 试下这个 waitFor 是不是多余的
        vm.waitFor(vm.$refs, 'form').then(form => {
          form.setField(key, value)
        })
      },
      /**
       * 如果 field 发生了变动（从 EmbedForm 中传递出来）
       * 需要根据字段类型，将对应的数据返写到 item 对象中
       * @param field
       * @param item
       */
      async writeField (field, item) {
        const vm = this
        if (field.type === 'label' || field.type === 'link') {
          // skip readonly fields
        } else if (field.type === 'geo') {
          // vm.setProperty(item, field.key && field.key.lat || 'geo_lat', field.value.lat)
          // vm.setProperty(item, field.key && field.key.lng || 'geo_lng', field.value.lng)
          // vm.setProperty(item, field.key && field.key.label || 'geo_label', field.value.label)
        } else if (field.type === 'image') {
          // vm.setProperty(item, field.key.read, field.value);
          // vm.setProperty(item, field.key.write, field.value && field.value.id);
        } else if (field.type === 'gallery') {
          // vm.setProperty(item, field.key.read, field.value || []);
          // vm.setProperty(item, field.key.write, (field.value || []).map(image => image.id));
        } else {
          vm.setProperty(item, field.key, field.value)
        }
      },
      /**
       * 接受并控制从 EmbedForm 中传出的 update 事件
       * @param field
       * @returns {Promise<void>}
       */
      async onUpdate (field) {
        const vm = this
        await vm.writeField(field, vm.item)
        await vm.renderField(field)
        vm.$emit('update', field)
      },
      /**
       * 将 item 中的数据根据 field 类型计算数据到 field 的取值
       * @param field
       * @returns {Promise<void>}
       */
      async renderField (field) {
        const vm = this
        let value
        const type = await vm.finalize(field.type, vm.item)
        // CHECKLIST: <data-view-types> <edit-view>
        if (type === 'geo') {
          // TODO: 尚未实现
          throw new Error(`尚未实现的表单字段：${type}`)
        } else if (type === 'image') {
          // TODO: 尚未实现
          throw new Error(`尚未实现的表单字段：${type}`)
        } else if (type === 'gallery') {
          // TODO: 尚未实现
          throw new Error(`尚未实现的表单字段：${type}`)
        } else if (type === 'link') {
          // TODO: 尚未实现
          throw new Error(`尚未实现的表单字段：${type}`)
        } else if (type === 'object') {
          // TODO: 尚未实现
          throw new Error(`尚未实现的表单字段：${type}`)
        } else {
          value = await vm.evaluate(vm.item, field.key)
        }
        // 填充默认值
        if (value === void 0 && field.default !== void 0) {
          value = field.default
        }
        // 根据 filter 过滤
        if (field.filter) {
          value = await field.filter.apply(vm, [value])
        }
        // 根据 mapper 过滤
        const mapper = await vm.finalize(field.mapper, vm)
        if (mapper) value = mapper[value]
        // Update，会直接影响到内层 EmbedForm 的绑定值
        vm.$set(field, 'value', value)
      },
      async render () {
        const vm = this
        await Promise.all(vm.fields.map(field => {
          vm.$set(field, 'context', { item: vm.item })
          return vm.renderField(field)
        }))
        vm.initialized = true
      },
      // TODO:
      async validate () {
      },
      async save () {
        const vm = this
        let itemToSave = vm.item
        const isCreate = !vm.id_
        itemToSave = await vm.config.hooks.filter_edit_view_pre_save.apply(vm, [vm.item])
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
      },
      async erase () {
        const vm = this
        return vm.config.action_data_view_delete_item.apply(vm, [vm.item])
      }
    }
  }
</script>
