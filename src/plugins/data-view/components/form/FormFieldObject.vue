<template>
  <div class="field-item field-item-object"
       :style="{width: field.final.width || 'auto'}">
    <template v-if="item">
      <i-button type="text" v-if="item" size="small"
                @click="navigate(item)">{{item[field.displayName||'name']}}
      </i-button>
      <i-button type="dashed" @click="reset()" size="small">置空</i-button>
    </template>
    <i-button @click="pick" size="small">选择</i-button>
  </div>
</template>

<script>
  export default {
    name: 'FormFieldObject',
    props: {
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
      vm.field.$el = this
    },
    methods: {
      async reload () {
        const vm = this
        const item = vm.field.value
          ? await vm.config.hooks.action_model_get_item.apply(
            vm, [vm.field.listViewOptions.model, vm.field.value])
          : null
        vm.setItem(item)
      },
      async pick () {
        const vm = this
        const item = await vm.pickObject(vm.field.listViewOptions, vm.field.modalOptions || {})
        vm.setItem(item)
        vm.$emit('input', vm.item.id)
      },
      async navigate (item) {
        const vm = this
        if (vm.field.navigate instanceof Function) {
          vm.field.navigate(item)
        } else {
          const model = vm.field.listViewOptions.model
          const route = await vm.config.hooks.action_get_model_edit_route.apply(vm, [model, item.id])
          vm.$router.push(route)
        }
      },
      async reset () {
        const vm = this
        vm.setItem(null)
        vm.$emit('input', null)
      },
      async setItem (item) {
        const vm = this
        vm.item = item
        vm.setProperty(vm.field, 'context._object', item)
      }
    }
  }
</script>
