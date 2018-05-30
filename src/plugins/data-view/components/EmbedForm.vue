<template>
  <i-form v-if="initialized" class="embed-form">
    <form-item v-for="field in fields"
               v-if="field.final.display === void 0 || field.final.display"
               :key="field.key"
               :label="field.final.label"
               :required="field.final.required"
               label-position="left">
      <!-- type: input -->
      <form-field-input v-if="(field.type||'input')==='input'"
                        v-model="field.value"
                        :field="field"
                        @input="updateField(field, $event)"></form-field-input>
      <!-- type: number -->
      <form-field-number v-else-if="field.type==='number'"
                         v-model="field.value"
                         :field="field"
                         @input="updateField(field, $event)"></form-field-number>
      <!-- type: label -->
      <form-field-label v-else-if="field.type==='label'"
                        v-model="field.value"
                        :field="field"
                        @input="updateField(field, $event)"></form-field-label>
      <!-- type: select -->
      <form-field-select v-else-if="field.type==='select'"
                         v-model="field.value"
                         :field="field"
                         @input="updateField(field, $event)"></form-field-select>
      <!-- type: image -->
      <form-field-image v-else-if="field.type==='image'"
                        v-model="field.value"
                        :field="field"
                        @input="updateField(field, $event)"></form-field-image>
      <!-- type: gallery -->
      <form-field-gallery v-else-if="field.type==='gallery'"
                        v-model="field.value"
                        :field="field"
                        @input="updateField(field, $event)"></form-field-gallery>
      <!-- type: switch -->
      <form-field-switch v-else-if="field.type==='switch'"
                         v-model="field.value"
                         :field="field"
                         @input="updateField(field, $event)"></form-field-switch>
      <div v-else-if="field.type === 'label'"
           :style="{width: field.final.width || false}">
        {{field.value}}
      </div>
      <div v-else>未实现的字段类型：{{field.type}}</div>
    </form-item>

  </i-form>
</template>

<script>
  import formComponents from '../components/form'

  export default {
    name: 'EmbedForm',
    components: { ...formComponents },
    props: {
      fields: {
        type: Array,
        default: () => []
      }
    },
    data () {
      return {
        initialized: false
      }
    },
    methods: {
      async reload () {
        const vm = this
        // console.log(JSON.parse(JSON.stringify(vm.fields)))
        await vm.finalizeFields()
        vm.initialized = true
      },
      setField (key, value) {
        const vm = this
        const field = vm._.find(vm.fields, { key })
        if (field) {
          field.value = value
          vm.updateField(field, value)
        }
      },
      async updateField (field, data) {
        const vm = this
        if (field.onUpdate) await field.onUpdate.apply(vm, [field, data])
        vm.$emit('update', field)
      },
      /**
       * 固化计算单个字段
       */
      async finalizeField (field) {
        const vm = this
        const final = {}
        // 支持 finalize 的所有属性名称
        const attrs = [
          'label', 'placeholder', 'htmlType', 'labelWidth',
          'required', 'display', 'disabled', 'readonly'
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
        return Promise.all(vm.fields.map(field => {
          vm.finalizeField(field)
        }))
      }
    }
  }
</script>

<style lang="less" scoped>
  @label-width: 25%;
  .embed-form /deep/ .ivu-form-item-label {
    width: @label-width;
  }

  .embed-form /deep/ .ivu-form-item-content {
    margin-left: @label-width;
  }

  .field-item {
    display: inline-block;
  }
</style>
