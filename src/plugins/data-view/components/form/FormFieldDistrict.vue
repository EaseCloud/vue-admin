<template>
  <div class="field-item field-item-district"
       :style="{width: field.final.width || '250px'}">
    <cascader :data="data"
              :change-on-select="!field.isLeaf"
              :value="[field.value-field.value%10000, field.value-field.value%100, field.value]"
              @input="$emit('input', $event[$event.length-1])"></cascader>
  </div>
</template>

<script>
  import areaData from 'china-area-data'
  import _ from 'lodash'

  function getDataNode (value, label) {
    const node = { value, label }
    if (areaData[value]) {
      node.children = _.map(areaData[value], (name, code) => getDataNode(parseInt(code), name))
    }
    return node
  }

  export default {
    name: 'FormFieldDistrict',
    props: {
      field: {
        type: Object,
        default: () => {
        }
      }
    },
    data () {
      return { data: getDataNode(86, '').children }
    }
  }
</script>
