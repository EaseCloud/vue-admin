<template>
  <div style="display: inline-block; margin-right: 12px; margin-bottom: 12px">
    <label style="font-size: 12px">{{field.final.label}}</label>
    <Input type="text" v-model="value" @input="emitQuery()" style="width: 130px" size="small"/>
  </div>
</template>

<script>
export default {
  name: 'FilteringHeaderKeyword',
  data () {
    const vm = this
    const key = vm.options.key
    let value = vm.field.$view.query[key] || ''
    if (vm.options.refiner) value = vm.options.refiner(value)
    return {
      value
    }
  },
  props: {
    field: { type: Object },
    options: { type: Object }
  },
  methods: {
    async query () {
      const vm = this
      const key = vm.options.key
      let text = vm.value
      if (vm.options.mapper) text = await vm.options.mapper.apply(vm, [text])
      // ListViewTable 执行查询
      if (text) vm.field.$view.doQuery({ [key]: text })
    },
    async emitQuery () {
      const vm = this
      const key = vm.options.key
      let text = vm.value
      if (vm.options.mapper) text = await vm.options.mapper.apply(vm, [text])
      // ListViewTable 执行查询
      vm.$emit('query', { [key]: text || null })
    }
  }
}
</script>
