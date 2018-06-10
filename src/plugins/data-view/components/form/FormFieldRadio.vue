<template>
  <div class="field-item field-item-radio"
       :style="{width: field.final.width || 'auto'}">
    <radio-group :value="field.value"
                 :type="field.radio_group_type"
                 :size="field.size"
                 :vertical="!!field.vertical"
                 @input="$emit('input', choice.value)">
      <radio v-for="(choice, i) in choices"
             :key="i"
             :disabled="choice.value!==field.value&&(field.disabled||choice.disabled)"
             :label="choice.value">{{choice.text}}
      </radio>
    </radio-group>
  </div>
</template>

<script>
  export default {
    name: 'FormFieldRadio',
    props: {
      value: {},
      field: {
        type: Object,
        default: () => {
        }
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
    }
  }
</script>
