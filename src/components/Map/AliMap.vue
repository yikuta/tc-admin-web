<template>
  <div class="wrapper">
    <el-amap
      ref="map"
      :vid="vid"
      :amap-manager="amapManager"
      :center="center"
      :zoom="zoom"
      :events="events"
      class="amap-container"
      :style="{height,width}"
    >
    <!-- <el-amap-circle
      vid="circle"
      :center="center"
      :radius="20"
      fill-opacity="0.2"
      strokeColor="#38f"
      strokeOpacity="0.8"
      strokeWeight="1"
      fillColor="#38f"
      >
    </el-amap-circle> -->
    <el-amap-marker
      v-for="(marker, index) in markers"
      :position="marker"
      :vid="index"
      :key="index"
      :draggable='true'
      :events='markerEvents'
    ></el-amap-marker>
    </el-amap>
  </div>
</template>

<script>
import VueAMap from 'vue-amap'
export default {
  name: 'AliMap',
  props: {
    vid: {
      // 同一页面使用多个map组件时，需要给每一个map组件指定vid
      type: String,
      default: 'amap'
    },
    center: {
      type: Array,
      required: true
    },
    zoom: {
      // 缩放范围[3-18]
      type: Number,
      default: 16.5
    },
    height: {
      type: String,
      default: '200px'
    },
    width: {
      type: String,
      default: '360px'
    },
    markers: {
      type: Array,
      default: () => [
        {
          position: ['104.06306', '30.54574']
        }
      ]
    },
    events: {
      type: Object,
      default: () => {}
    },
    markerEvents: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      amapManager: new VueAMap.AMapManager()
    }
  }
}
</script>

<style lang='scss' scoped>
</style>
