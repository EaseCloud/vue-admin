<template>
  <div class="field-item field-item-object"
       :style="{width: field.final.width || 'auto'}">
    <template v-if="item">
      <i-button type="text" v-if="item" size="small"
                @click="navigate(item)">{{item[field.displayName||'name']}}
      </i-button>
      <i-button type="dashed" @click="reset()" size="small"
                v-if="!field.final.readonly && !field.final.disabled">置空
      </i-button>
    </template>
    <i-button @click="pick" size="small"
              v-if="!field.final.readonly && !field.final.disabled">选择
    </i-button>
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
        await vm.setItem(item)
      },
      async pick () {
        const vm = this
        let item
        if (vm.field.actionPickObject) {
          item = await vm.field.actionPickObject()
        } else {
          vm.field.listViewOptions.options = Object.assign({}, vm.field.listViewOptions.options || {}, {$el: vm})
          item = await vm.pickObject(vm.field.listViewOptions, vm.field.modalOptions || {})
        }
        await vm.setItem(item)
        vm.$emit('input', vm.item[vm.field.listViewOptions.pk || 'id'])
      },
      async navigate (item) {
        const vm = this
        if (vm.field.navigate instanceof Function) {
          vm.field.navigate(item)
        } else {
          const model = vm.field.listViewOptions.model
          const route = await vm.config.hooks.action_get_model_edit_route.apply(
            vm, [model, item[vm.field.listViewOptions.pk || 'id']])
          await vm.$router.push(route).catch(_ => _)
        }
      },
      async reset () {
        const vm = this
        await vm.setItem(null)
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
