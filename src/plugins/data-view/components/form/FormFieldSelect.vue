<template>
  <div class="field-item field-item-select"
       :style="{width: field.final.width || '250px'}">
    <i-select v-if="choices"
              class="form-field-select"
              :clearable="!!field.clearable"
              :placeholder="field.placeholder"
              :value="field.value"
              :default="field.final.default"
              :disabled="field.final.disabled"
              :filterable="field.filterable"
              @input="$emit('input', $event===void 0 ? null : $event)">
      <template v-for="choice in choices">
        <option-group v-if="choice.children"
                      :key="choice.value !== void 0 ? choice.value : choice.key"
                      :label="choice.text||choice.label">
          <i-option v-for="subChoice in choice.children"
                    :key="subChoice.value !== void 0 ? subChoice.value : subChoice.key"
                    :value="subChoice.value||subChoice.key">{{subChoice.text||subChoice.label}}
          </i-option>
        </option-group>
        <i-option v-else
                  :key="choice.value||choice.key"
                  :value="choice.value !== void 0 ? choice.value : choice.key">{{choice.text||choice.label}}
        </i-option>
      </template>
    </i-select>
  </div>
</template>

<script>
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
        choices: null
      }
    },
    async mounted () {
      const vm = this
      vm.field.$el = this
      vm.reload()
    },
    methods: {
      async reload () {
        const vm = this
        vm.choices = vm.wrapChoices(await vm.finalize(vm.field.choices))
      }
    }
  }
</script>
