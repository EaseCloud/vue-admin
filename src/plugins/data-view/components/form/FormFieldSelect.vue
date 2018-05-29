<template>
  <div class="field-item field-item-label"
       :style="{width: field.final.width || '250px'}">
    <i-select v-if="choices"
              class="form-field-select"
              :clearable="!!field.clearable"
              :placeholder="field.placeholder"
              :value="value"
              @input="$emit('input', $event)">
      <i-option v-for="choice in choices"
                :key="choice.value||choice.key"
                :value="choice.value||choice.key">{{choice.text||choice.label}}
      </i-option>
    </i-select>
  </div>
</template>

<script>
  export default {
    name: 'FormFieldSelect',
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
      vm.choices = await vm.finalize(vm.field.choices)
    }
  }
</script>
