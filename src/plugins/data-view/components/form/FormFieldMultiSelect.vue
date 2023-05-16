<template>
  <div class="field-item field-item-multi-select"
       :style="{width: field.final.width || '250px'}" v-if="field.value!==void 0">
    <i-select class="form-field-multi-select" multiple
              :loading="loading"
              :max-tag-count="field.maxCount"
              :filterable="field.filterable!==false"
              :default="field.final.default||[]"
              :placeholder="field.placeholder"
              :value="field.value"
              :disabled="field.final.disabled"
              :remote-method="field.asyncChoices?doQuery:void 0"
              :allow-create="field.allowCreate"
              @on-create="field.allowCreate?onCreate:void 0"
              @input="$emit('input', $event===void 0 ? null : $event)">
      <template v-for="choice in choices">
        <option-group v-if="choice.children"
                      :key="choice.value"
                      :label="choice.text">
          <i-option v-for="subChoice in choice.children"
                    :key="subChoice.value"
                    :value="subChoice.value">
            {{subChoice.text}}
          </i-option>
        </option-group>
        <!-- TODO: 这里可以结合 i-option 的 slot 提供 render 函数注入自定义样式 -->
        <i-option v-else :key="choice.value" :value="choice.value">
          {{choice.text}}
        </i-option>
      </template>
    </i-select>
  </div>
</template>

<script>
import _ from 'lodash'

export default {
  name: 'FormFieldSelect',
  props: {
    field: {
      type: Object,
      default: () => {
      }
    }
  },
  data () {
    return {
      loading: false,
      choices: []
    }
  },
  async created () {
    const vm = this
    vm.field.$el = this
    // 默认的值
    if (vm.field.value === void 0) {
      vm.$set(vm.field, 'value', [])
    }
    // 默认取一次选项
    await vm.doQuery()
  },
  methods: {
    onCreate (val) {
      const vm = this
      // TODO: 官方样例实在没实践明白，但是远程搜索 + create 用起来是会有问题的，这里不写也没差多少
    },
    async doQuery (keyword = '') {
      // 异步查询的处理
      // TODO: BUG 重现 - 先创建几个，然后输入一个远程搜索有返回的 key，现存标签值会被清空
      // TODO: 如果新输入的 key 是能远程搜索到的，仅当现存的值里面有手动输入值的时候会出事
      const vm = this
      vm.loading = true
      vm.choices = await vm.field.asyncChoices(keyword)
      vm.loading = false
    }
  }
}
</script>
