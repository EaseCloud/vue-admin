<template>
  <div class="field-item field-item-color">
    <color-picker v-model="field.value"
                  :alpha="!!field.alpha"
                  @input="$emit('input', $event)"
                  :hue="field.hue===void 0 || field.hue"
                  :size="field.size||'default'"
                  :recommend="field.recommend===void 0 || field.recommend"
                  :colors="field.colors||[]"
    ></color-picker>
  </div>
</template>

<script>
  export default {
    name: 'FormFieldColor',
    data () {
      return {
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
      reload () {
        // const vm = this
      }
    }
  }
</script>
