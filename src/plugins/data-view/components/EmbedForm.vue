<template>
  <i-form v-if="initialized" class="embed-form"
          :label-position="options.labelPosition"
          @submit.native.prevent>
    <form-item v-for="(field, i) in fields"
               v-if="field.final && (field.final.display === void 0 || field.final.display)"
               :key="field.key+'_'+i"
               :label="options.labelPosition==='left'&&field.fullWidth?'':field.final.label"
               :required="field.final.required"
               :label-width="options.labelPosition==='left'?
                   (field.fullWidth?0:field.labelWidth||180):void 0">
      <div v-if="field.fullWidth" class="field-title-full">
        <h3 class="field-label" v-if="field.final.label"
            :style="options.labelStyle||field.labelStyle"
        >{{ field.final.label }}</h3>
        <div class="field-actions">
          <template v-for="(action, i) in field.actions"
                    v-if="action.display===void 0||finalizeSync(action.display, field.context.item)">
            <i-button :key="i"
                      size="small"
                      :type="action.buttonType"
                      @click="doFieldAction(action, field)">{{ action.label }}
            </i-button>
            <i :key="'_'+i"><!--避免按钮之间粘在一起--></i>
          </template>
        </div>
      </div>

      <!-- description -->
      <div v-if="field.description && options.descriptionPosition==='top'"
           class="field-description"
           style="color: #80848f; margin-bottom: 10px;"
           :style="field.descriptionStyle">{{ field.description }}
      </div>

      <!-- type: input -->
      <form-field-input v-if="(field.type||'input')==='input'"
                        :field="field"
                        @input="updateField(field, $event)"></form-field-input>
      <!-- type: number -->
      <form-field-number v-else-if="field.type==='number'"
                         :field="field"
                         @input="updateField(field, $event)"></form-field-number>
      <!-- type: map -->
      <form-field-map v-else-if="field.type==='map'"
                      :field="field"
                      @input="updateField(field, $event)"></form-field-map>
      <!-- type: label -->
      <form-field-label v-else-if="field.type==='label'"
                        :field="field"
                        @input="updateField(field, $event)"></form-field-label>
      <!-- type: select -->
      <form-field-select v-else-if="field.type==='select'"
                         :field="field"
                         @input="updateField(field, $event)"></form-field-select>
      <!-- type: multi-select -->
      <form-field-multi-select v-else-if="field.type==='multi-select'"
                               :field="field"
                               @input="updateField(field, $event)"></form-field-multi-select>
      <!-- type: cascade -->
      <form-field-cascade v-else-if="field.type==='cascade'"
                          :field="field"
                          @input="updateField(field, $event)"></form-field-cascade>
      <!-- type: date -->
      <form-field-date v-else-if="field.type==='date'"
                       :field="field"
                       @input="updateField(field, $event)"></form-field-date>
      <!-- type: time -->
      <form-field-time v-else-if="field.type==='time'"
                       :field="field"
                       @input="updateField(field, $event)"></form-field-time>
      <!-- type: radio -->
      <form-field-radio v-else-if="field.type==='radio'"
                        :field="field"
                        @input="updateField(field, $event)"></form-field-radio>
      <!-- type: checkbox -->
      <form-field-checkbox v-else-if="field.type==='checkbox'"
                           :field="field"
                           @input="updateField(field, $event)"></form-field-checkbox>
      <!-- type: rate -->
      <form-field-rate v-else-if="field.type==='rate'"
                       :field="field"
                       @input="updateField(field, $event)"></form-field-rate>
      <!-- type: color -->
      <form-field-color v-else-if="field.type==='color'"
                        :field="field"
                        @input="updateField(field, $event)"></form-field-color>
      <!-- type: upload -->
      <form-field-upload v-else-if="field.type==='upload'"
                         :field="field"
                         @input="updateField(field, $event)"></form-field-upload>
      <!-- type: image -->
      <form-field-image v-else-if="field.type==='image'"
                        :field="field"
                        @input="updateField(field, $event)"></form-field-image>
      <!-- type: gallery -->
      <form-field-gallery v-else-if="field.type==='gallery'"
                          :field="field"
                          @input="updateField(field, $event)"></form-field-gallery>
      <!-- type: switch -->
      <form-field-switch v-else-if="field.type==='switch'"
                         :field="field"
                         @input="updateField(field, $event)"></form-field-switch>
      <!-- type: district -->
      <form-field-district v-else-if="field.type==='district'"
                           :field="field"
                           @input="updateField(field, $event)"></form-field-district>
      <!-- type: editor -->
      <form-field-editor v-else-if="field.type==='editor'"
                         :field="field"
                         @input="updateField(field, $event)"></form-field-editor>
      <!-- type: code -->
      <form-field-code v-else-if="field.type==='code'"
                       :field="field"
                       @input="updateField(field, $event)"></form-field-code>
      <!-- type: object -->
      <form-field-object v-else-if="field.type==='object'"
                         :field="field"
                         @input="updateField(field, $event)"></form-field-object>
      <!-- type: multi-object -->
      <form-field-multi-object v-else-if="field.type==='multi-object'"
                               :field="field"
                               @input="updateField(field, $event)"></form-field-multi-object>
      <!-- type: list-view -->
      <form-field-list-view v-else-if="field.type==='list-view'"
                            :field="field"
                            @input="updateField(field, $event)"></form-field-list-view>
      <!-- type: item-list -->
      <form-field-item-list v-else-if="field.type==='item-list'"
                            :field="field"
                            @input="updateField(field, $event)"></form-field-item-list>
      <!-- type: render -->
      <form-field-render v-else-if="field.type==='render'"
                         :field="field"
                         @input="updateField(field, $event)"></form-field-render>
      <!-- type: undefined -->
      <div v-else>未实现的字段类型：{{ field.type }}</div>

      <!-- description -->
      <div v-if="field.description && options.descriptionPosition!=='top'"
           class="field-description"
           style="color: #80848f"
           :style="field.descriptionStyle">{{ field.description }}
      </div>
    </form-item>
  </i-form>
</template>

<script>
import formComponents from '../components/form'
import fieldSetMixins from './fieldSetMixins'

export default {
  name: 'EmbedForm',
  components: {...formComponents},
  mixins: [fieldSetMixins],
  props: {
    noInit: {
      // 默认情况下，noInit=false，EmbedForm 自动根据字段设置初始化 item 然后渲染
      // 如果设置 noInit=true，EmbedForm 将挂起渲染行为，直到外部显式调用 setItem 输入对象
      type: Boolean,
      default: false
    },
    options: {
      type: Object,
      default: () => ({
        labelPosition: 'left'
      })
    },
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
  methods: {
    async reload () {
      const vm = this
      await vm.initData()
    },
    async initData () {
      const vm = this
      // 如果指定了 noInit 属性，初始化将跳过设定默认值这一步
      if (vm.noInit) return
      // 为了避免在没有任何动作之前点击保存提交的表单会有字段 undefined 的情况
      // 所有指定的 default 值的字段都会先手动设置进去
      const item = {}
      vm.fields.forEach((field, i) => {
        // 设置默认值
        if (field.key) vm.setProperty(item, field.key, field.default)
      })
      await vm.setItem(item)
      // 向外抛出 item 引用
      vm.$emit('loaded', item)
    },
    async setItem (item) {
      const vm = this
      vm.item = item
      await vm.render()
      // 无论何种形式初始化（initData 或者 noInit + 外部 setItem）
      // 都从这里确认初始化成功，才触发渲染
      vm.initialized = true
    },
    /**
     * 将所有的 item 字段按属性写入所有字段的 field.value
     */
    async render () {
      const vm = this
      await Promise.all(vm.fields.map(field => {
        vm.$set(field, 'context', {item: vm.item, $form: vm})
        return vm.renderField(field)
      }))
      await vm.finalizeFields()
    },
    /**
     * 将 item 中的数据根据 field 类型计算数据到 field 的取值
     * @param field
     * @returns {Promise<void>}
     */
    async renderField (field) {
      const vm = this
      // 前置钩子
      if (field.preRender) {
        await field.preRender.apply(vm, [field])
      }
      // 获取初始值
      let value = await vm.evaluate(vm.item, field.key, field.default)
      // 根据 filter 过滤
      if (field.filter) value = await field.filter.apply(vm, [value])
      // 根据 mapper 过滤
      const mapper = await vm.finalize(field.mapper, vm)
      if (mapper) {
        value = hasOwnProperty(mapper, value) ? mapper[value] : mapper.__default__
      }
      // Update，会直接影响到内层 EmbedForm 的绑定值
      vm.$set(field, 'value', value)
      // 后置钩子
      if (field.postRender) {
        await field.postRender.apply(vm, [field])
      }
      // 主动更新控件
      if (field.$el && field.$el.reload) await field.$el.reload()
    },
    /**
     * 如果 field 发生了变动（从 EmbedForm 中传递出来）
     * 需要根据字段类型，将对应的数据返写到 item 对象中
     * @param field
     * @param item
     */
    async writeField (field, item) {
      const vm = this
      if (field.onWriteField) {
        // Custom write field hook
        await field.onWriteField(field, item)
      } else if (field.type === 'geo') {
        // vm.setProperty(item, field.key && field.key.lat || 'geo_lat', field.value.lat)
        // vm.setProperty(item, field.key && field.key.lng || 'geo_lng', field.value.lng)
        // vm.setProperty(item, field.key && field.key.label || 'geo_label', field.value.label)
      } else {
        if (field.key) {
          vm.setProperty(item, field.key, field.value)
        } else {
          console.error('字段的 key 不存在，无法执行自动写入')
        }
      }
      // 写入完毕之后，要更新所有其他字段的 display 值
      await Promise.all(vm.fields.map(f => vm.finalizeField(f)))
    },
    /**
     * 校验表单，通过 Promise 返回校验结果
     * 1. 校验所有 required 字段
     * 2. 校验所有 field 中定义的 validator 方法
     *    validator 方法内部 this 指向 EmbedForm
     *    传入第一个参数为根据 field.key 获取的 value
     *    传入第二个参数为 field 本身
     * 3. 如果指定 silent 为 true，则不会弹出相关提示
     */
    async validate (silent = false) {
      const vm = this
      await Promise.all(vm.fields.map(field => new Promise(async (resolve, reject) => {
        // 先校验 required（0 被看做是有数值的），空数组也不行
        if (field.final.required && (
          !field.value && field.value !== 0 ||
          field.value instanceof Array && !field.value.length
        )) {
          const msg = `必须填写【${field.label}】字段`
          if (!silent) vm.$Message.warning(msg)
          reject(new Error(msg))
        }
        // 校验
        if (field.validator) {
          try {
            const value = await vm.evaluate(vm.item, field.key, field.default)
            await field.validator.apply(vm, [value, field])
          } catch (e) {
            if (!silent) vm.$Message.warning(e.message)
            reject(e)
          }
        }
        resolve()
      })))
      return vm.item
    },
    getField (key) {
      const vm = this
      return vm._.find(vm.fields, {key})
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
      // console.log('updateField', field.key, field.)
      // 如果指定 noSync，则不自动写回 field.value，而由托管的 onUpdate 处理所有更新事务
      if (field.data !== data && !field.noSync) field.value = data
      // onUpdate 的返回值可以控制是否执行 writeField，如果返回 === false 将跳过 writeField
      let write = true
      if (field.onUpdate) write = (await field.onUpdate.apply(vm, [field, data])) !== false
      if (write) await vm.writeField(field, vm.item)
      await vm.renderField(field)
      vm.$emit('update', field)
    },
    async doFieldAction (action, field) {
      const vm = this
      await action.action.apply(vm, [field])
    }
  }
}
</script>

<style lang="less" scoped>
@label-width: 25%;

.embed-form {
  /deep/ .ivu-form-item-label {
    width: @label-width;
  }
  /deep/ .ivu-form-item-content {
    margin-left: @label-width;
  }
  .field-item {
    display: inline-block;
  }
}

.field-title-full {
  h3.field-label {
    display: inline-block;
  }

  .field-actions {
    display: inline-block;
    float: right;
  }
}

.field-description {
  line-height: 20px;
  margin-top: 5px;
}
</style>
