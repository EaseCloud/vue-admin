<template>
  <div class="field-item field-item-switch"
       :style="{width: field.final.width || 'auto'}">
    <template v-if="item">
      <i-button type="text" v-if="item"
                @click="navigate(item)">{{item[field.displayName||'name']}}
      </i-button>
      <i-button @click="$emit('input', null)">置空</i-button>
    </template>
    <i-button v-else @click="pick">选择</i-button>
  </div>
</template>

<script>
  export default {
    name: 'FormFieldSwitch',
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
        item: null
      }
    },
    mounted () {
      const vm = this
      vm.field.el = this
    },
    methods: {
      async reload () {
        const vm = this
        vm.item = vm.field.value
          ? await vm.config.hooks.action_model_get_item.apply(
            vm, [vm.field.listViewOptions.model, vm.field.value])
          : null
      },
      async pick () {
        const vm = this
        vm.item = await vm.pickObject(vm.field.listViewOptions)
        vm.$emit('input', vm.item.id)
      },
      async navigate (item) {
        const vm = this
        if (vm.field.navigate instanceof Function) {
          vm.field.navigate(item)
        } else {
          const model = vm.field.listViewOptions.model
          const route = await vm.config.hooks.action_get_model_edit_route.apply(
            vm, [model, item.id])
          vm.$router.push(route)
        }
      }
    }
  }
</script>
