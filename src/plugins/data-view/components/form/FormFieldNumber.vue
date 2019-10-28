<template>
  <div class="field-item field-item-number"
       v-if="display"
       :style="{width: field.final.width || '250px'}" >
    <!--@on-change="$emit('input', $event)"-->
    <input-number :value="field.value"
                  :id="field.id"
                  :max="field.max"
                  :min="field.min"
                  :step="field.step"
                  @on-change="$emit('input',$event)"
                  :precision="field.precision"
                  :placeholder="field.placeholder"
                  :formatter="field.formatter"
                  :parser="field.parser"
                  :disabled="field.final.disabled"
                  :readonly="field.final.readonly"
                  :edittable="field.final.editable"
                  ref="input"
    ></input-number>
  </div>
</template>

<script>
export default {
  name: 'FormFieldNumber',
  data () {
    return {
      display: true
    }
  },
  props: {
    field: {
      type: Object,
      default: () => {
      }
    }
  },
  mounted () {
    const vm = this
    vm.field.$el = this
  },
  methods: {
    // reload () {
    //   const vm = this
    //   vm.display = false
    //   vm.$nextTick(() => {
    //     vm.display = true
    //   })
    // }
  }
}
</script>
