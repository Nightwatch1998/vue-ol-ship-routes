<template>
    <div id="map"></div>
</template>

<script>
import {ref, watch, onMounted} from 'vue'
import AMapLoader from '@amap/amap-jsapi-loader'
import {shallowRef} from 'vue'

export default {
  name:'Amap',
  components: {},
  props: {},
  setup(props){
    const map = shallowRef(null)
    return {
      map
    }
  },
  methods:{
    initMap(){
      var map = new AMap.Map('map',{
        viewMode:"3D",
        zoom:8,
        center:[119.232096,38.533195],
        mapStyle:'amap://styles/darkblue'
      })
      // 异步加载插件
      AMap.plugin('AMap.ToolBar',function(){
        var toolbar = new AMap.ToolBar();
        map.addControl(toolbar);
      })
    }
  },
  mounted(){
    this.initMap()
  }
}
</script>

<style lang='scss' scoped>
  #map{
    width: 100%;
    height: 100%;
  }
</style>