<template>
  <div class="field-item field-item-cascade"
       :style="{width: field.final.width || '250px'}">
    <cascader :data="field.final.choices"
              class="form-field-cascade"
              :clearable="!!field.clearable"
              :placeholder="field.placeholder"
              :disabled="field.disabled || field.readonly"
              :value="value"
              :default="field.final.default"
              @input="onInput">
    </cascader>
  </div>
</template>

<script>
  export default {
    name: 'FormFieldCascade',
    props: {
      field: {
        type: Object,
        default: () => {
        }
      }
    },
    computed: {
      value () {
        // 因为 iView Cascader 控件接受的 value 参数是一个 path 数组，但是我们的
        // FormFieldCascade 可以支持只选择最终级别的值，因此 需要做一个参数转换
        const vm = this
        const path = []
        // 通过在选项中搜索当前值计算 Cascader 格式的路径数据
        const searchPath = item => {
          if (!item) return false
          path.push(item.value)
          if (item.value === vm.field.value) return true
          if ((item.children || []).some(sub => searchPath(sub))) return true
          path.pop()
          return false
        }
        vm.field.final.choices.forEach(item => path.length || searchPath(item))
        searchPath()
        return path
      }
    },
    data () {
      return {
        choices: null
      }
    },
    async mounted () {
      const vm = this
      vm.choices = vm.wrapChoices(await vm.finalize(vm.field.choices))
      vm.field.$el = this
    },
    methods: {
      onInput (value) {
        const vm = this
        vm.$emit(value.length ? value[value.length - 1] : null)
      }
    }
  }
</script>
