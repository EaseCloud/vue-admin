<template>
  <div class="field-item field-item-map"
       v-if="display && data" :style="{width: field.final.width || '640px'}">
    {{data.label}} ({{data.lng}}, {{data.lat}})
    <template v-if="lock">
      <i-button size="small"
                @click="setLock(false)">修改
      </i-button>
    </template>
    <template v-else>
      <i-button size="small"
                @click="setPosition(field.value.lng, field.value.lat);
                map.setZoom(zoom);setLock(true)">取消
      </i-button>
      <i-button size="small" type="primary"
                @click="$emit('input', data);setLock(true)">确定
      </i-button>
    </template>
    <div style="position: relative; height: 400px">
      <!--<el-amap-search-box :search-option="{citylimit:false}"-->
      <!--:on-search-result="echo"></el-amap-search-box>-->
      <el-amap vid="form_field_map_embed" :zoom="zoom"
               :plugin="mapPlugins" ref="map" :events="mapEvents">
        <el-amap-marker :position="position"></el-amap-marker>
      </el-amap>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FormFieldMap',
  data () {
    const vm = this
    return {
      display: true,
      lock: true,
      zoom: 15,
      data: null,
      mapPlugins: [{
        // pName: 'Scale',
        // }, {
        pName: 'ToolBar',
      }, {
        pName: 'Geolocation',
        events: {
          init (o) {
            // o 是高德地图定位插件实例
            if (vm.data && vm.data.lat && vm.data.lng) {
              vm.setPosition(vm.data.lng, vm.data.lat)
            } else {
              o.getCurrentPosition((status, result) => {
                if (result && result.position) {
                  vm.setPosition(result.position.lng, result.position.lat)
                }
              })
            }
          },
        }
      }],
      mapEvents: {
        moveend () {
          if(vm.lock) {
            vm.map.setCenter([vm.field.value.lng, vm.field.value.lat])
          } else {
            vm.setPosition(...vm.$refs.map.$$getCenter())
          }
        },
        click (e) {
          if (vm.lock) return
          const { lng, lat } = e.lnglat
          vm.setPosition(lng, lat)
        }
      }
    }
  },
  computed: {
    position () {
      const vm = this
      return [vm.data.lng || 0, vm.data.lat || 0]
    },
    map () {
      const vm = this
      return vm.$refs.map.$$getInstance()
    },
    coincide () {
      // 当前位置是否与初始位置重合
      const vm = this
      return vm.data.lat === vm.field.value.lat
        && vm.data.lng === vm.field.value.lng
    }
  },
  props: {
    field: {
      type: Object,
      default: () => ({ lat: 0, lng: 0, label: '尚未定位', info: null })
    }
  },
  async mounted () {
    const vm = this
    vm.field.$el = this
    vm.zoom = vm.field.zoom || vm.zoom
    if (!vm.field.value) vm.$set(vm.field, 'value', { lat: 0, lng: 0, label: '尚未定位', info: null })
    if (!vm.field.value.lat) vm.$set(vm.field.value, 'lat', 0)
    if (!vm.field.value.lng) vm.$set(vm.field.value, 'lng', 0)
    if (!vm.field.value.label) vm.$set(vm.field.value, 'label', '尚未定位')
    if (!vm.field.value.info) vm.$set(vm.field.value, 'info', null)
    vm.data = JSON.parse(JSON.stringify(vm.field.value))
    await vm.setLock(true)
  },
  methods: {
    // reload () {
    //   const vm = this
    //   vm.display = false
    //   vm.$nextTick(() => {
    //     vm.display = true
    //   })
    // }
    setPosition (lng, lat) {
      const vm = this
      vm.data.lng = lng
      vm.data.lat = lat
      const oldCenter = vm.map.getCenter()
      // 如果中心点不在这里，移动过去
      if (lng !== oldCenter.lng || lat !== oldCenter.lat) vm.map.setCenter([lng, lat])
      // 这里通过高德 SDK 完成。
      if (window.AMap.Geocoder) {
        const geocoder = new window.AMap.Geocoder({ radius: 1000, extensions: 'all' })
        geocoder.getAddress([lng, lat], function (status, result) {
          if (status === 'complete' && result.info === 'OK') {
            if (result && result.regeocode) {
              vm.data.info = result.regeocode.addressComponent
              vm.data.label = result.regeocode.formattedAddress
            }
          }
        })
      } else {
        console.warn('AMap.Geocoder 没有加载成功')
      }
    },
    async setLock (lock) {
      const vm = this
      await vm.waitFor(vm.$refs, 'map')
      vm.lock = lock
      const enabled = !lock
      vm.map.setStatus({
        showIndoorMap: enabled,
        resizeEnable: enabled,
        dragEnable: enabled,
        keyboardEnable: enabled,
        doubleClickZoom: enabled,
        zoomEnable: enabled,
        rotateEnable: enabled
      })
    }
  }
}
</script>
