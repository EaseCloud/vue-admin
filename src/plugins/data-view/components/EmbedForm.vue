<template>
  <i-form v-if="initialized" class="embed-form">
    <form-item v-for="(field, i) in fields"
               v-if="field.final.display === void 0 || field.final.display"
               :key="field.key+'_'+i"
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
      <!-- type: radio -->
      <form-field-radio v-else-if="field.type==='radio'"
                        v-model="field.value"
                        :field="field"
                        @input="updateField(field, $event)"></form-field-radio>
      <!-- type: rate -->
      <form-field-rate v-else-if="field.type==='rate'"
                       v-model="field.value"
                       :field="field"
                       @input="updateField(field, $event)"></form-field-rate>
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
      <!-- type: district -->
      <form-field-district v-else-if="field.type==='district'"
                           v-model="field.value"
                           :field="field"
                           @input="updateField(field, $event)"></form-field-district>
      <!-- type: editor -->
      <form-field-editor v-else-if="field.type==='editor'"
                         v-model="field.value"
                         :field="field"
                         @input="updateField(field, $event)"></form-field-editor>
      <!-- type: object -->
      <form-field-object v-else-if="field.type==='object'"
                         v-model="field.value"
                         :field="field"
                         @input="updateField(field, $event)"></form-field-object>
      <!-- type: list-view -->
      <form-field-list-view v-else-if="field.type==='list-view'"
                            v-model="field.value"
                            :field="field"
                            @input="updateField(field, $event)"></form-field-list-view>
      <!-- type: render -->
      <form-field-render v-else-if="field.type==='render'"
                         v-model="field.value"
                         :field="field"
                         @input="updateField(field, $event)"></form-field-render>
      <!-- type: undefined -->
      <div v-else>未实现的字段类型：{{field.type}}</div>

      <!-- description -->
      <div v-if="field.description" style="color: #80848f"
           :style="field.descriptionStyle">{{field.description}}
      </div>
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
        initialized: false,
        item: null
      }
    },
    mounted () {
    },
    methods: {
      async reload () {
        const vm = this
        await vm.finalizeFields()
        await vm.initData()
        vm.initialized = true
      },
      async initData () {
        const vm = this
        // 为了避免在没有任何动作之前点击保存提交的表单会有字段 undefined 的情况
        // 所有指定的 default 值的字段都会先手动设置进去
        const item = {}
        vm.fields.forEach((field, i) => {
          // 设置默认值
          if (field.key) vm.setProperty(item, field.key, field.default)
        })
        vm.setItem(item)
      },
      async setItem (item) {
        const vm = this
        vm.item = item
        vm.render()
      },
      /**
       * 将所有的 item 字段按属性写入所有字段的 field.value
       */
      async render () {
        const vm = this
        await Promise.all(vm.fields.map(field => {
          vm.$set(field, 'context', { item: vm.item })
          return vm.renderField(field)
        }))
        vm.initialized = true
      },
      /**
       * 将 item 中的数据根据 field 类型计算数据到 field 的取值
       * @param field
       * @returns {Promise<void>}
       */
      async renderField (field) {
        const vm = this
        // 获取初始值
        let value = await vm.evaluate(vm.item, field.key, field.default)
        // 根据 filter 过滤
        if (field.filter) {
          value = await field.filter.apply(vm, [value])
        }
        // 根据 mapper 过滤
        const mapper = await vm.finalize(field.mapper, vm)
        if (mapper) {
          value = hasOwnProperty(mapper, value) ? mapper[value] : mapper.__default__
        }
        // Update，会直接影响到内层 EmbedForm 的绑定值
        vm.$set(field, 'value', value)
        // 主动更新控件
        if (field.$el) field.$el.reload()
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
        } else if (field.type === 'image' || field.type === 'gallery') {
          // do nothing
        } else if (field.type === 'geo') {
          // vm.setProperty(item, field.key && field.key.lat || 'geo_lat', field.value.lat)
          // vm.setProperty(item, field.key && field.key.lng || 'geo_lng', field.value.lng)
          // vm.setProperty(item, field.key && field.key.label || 'geo_label', field.value.label)
        } else {
          vm.setProperty(item, field.key, field.value)
        }
      },
      // TODO:
      async validate () {
      },
      getField (key) {
        const vm = this
        return vm._.find(vm.fields, { key })
      },
      // setField (key, value) {
      //   const vm = this
      //   const field = vm.getField(key)
      //   if (field) {
      //     field.value = value
      //     vm.updateField(field, value)
      //   }
      // },
      async updateField (field, data) {
        const vm = this
        if (field.onUpdate) await field.onUpdate.apply(vm, [field, data])
        await vm.writeField(field, vm.item)
        await vm.renderField(field)
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
