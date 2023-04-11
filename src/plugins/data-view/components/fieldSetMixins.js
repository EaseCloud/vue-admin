export default {
  methods: {
    /**
     * 固化计算单个字段
     */
    async finalizeField (field) {
      const vm = this
      const final = {}
      // 支持 finalize 的所有属性名称
      const attrs = [
        'label', 'placeholder', 'htmlType', 'width', 'labelWidth', 'type',
        'required', 'display', 'disabled', 'readonly', 'choices', 'filtering',
        'editable', 'size', 'style'
      ]
      await Promise.all(attrs.map(async attr => {
        if (field[attr] !== void 0) {
          final[attr] = await vm.finalize(field[attr], field)
        }
      }))
      vm.$set(field, 'final', final)
    },
    /**
     * 固化计算所有字段，将所有配置项例如 label 等固化到 field.final 对象中
     * @returns {Promise<void>}
     */
    async finalizeFields () {
      const vm = this
      return Promise.all(vm.fields.map(field => vm.finalizeField(field)))
    }
  }
}
