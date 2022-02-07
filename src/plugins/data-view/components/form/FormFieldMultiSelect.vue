<template>
  <div class="field-item field-item-multi-select"
       :style="{width: field.final.width || '250px'}">
    <i-select class="form-field-multi-select" multiple
              v-if="choices"
              :allow-create="field.allowCreate"
              @on-create="onCreate"
              :loading="loading"
              :max-tag-count="field.maxCount"
              :filterable="field.filterable!==false"
              :default="field.final.default||[]"
              :placeholder="field.placeholder"
              :value="field.value"
              :remoteMethod="doQuery"
              @set-default-options="doQuery()"
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
      loading: false,
      choices: null
    }
  },
  async mounted () {
    const vm = this
    vm.field.$el = this
    await vm.doQuery()
  },
  methods: {
    onCreate (val) {
      const vm = this
      vm.choices.push({value: val, label: val})
    },
    async doQuery (keyword = '') {
      const vm = this
      vm.loading = true
      if (vm.field.asyncChoices) {
        vm.choices = await vm.field.asyncChoices(keyword)
      } else {
        vm.choices = vm.wrapChoices(await vm.finalize(vm.field.choices))
      }
      vm.loading = false
    }
  }
}
</script>
