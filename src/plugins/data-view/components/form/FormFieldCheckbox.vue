<template>
  <div class="field-item field-item-checkbox"
       :style="{width: field.final.width || 'auto'}">
    <checkbox-group v-model="value"
                    :type="field.radio_group_type"
                    :size="field.size"
                    :vertical="!!field.vertical"
                    @input="onChange">
      <checkbox v-for="(choice, i) in choices"
                :key="i"
                :disabled="choice.value!==field.value&&(field.disabled||choice.disabled)"
                :label="choice.value">{{ choice.text }}
      </checkbox>
    </checkbox-group>
  </div>
</template>

<script>
export default {
  name: 'FormFieldCheckbox',
  props: {
    field: {
      type: Object,
      default: () => {
      }
    }
  },
  data () {
    return {
      value: null,
      choices: null
    }
  },
  async mounted () {
    const vm = this
    vm.choices = vm.wrapChoices(await vm.finalize(vm.field.choices))
    vm.value = vm.field.value || vm.field.default || []
  },
  methods: {
    async onChange (value) {
      const vm = this
      if (!vm.field.value) {
        vm.field.value = value
      } else {
        vm.field.value.splice(0, vm.field.value.length, ...value)
      }
      vm.$emit('input', value)
    }
  }
}
</script>
