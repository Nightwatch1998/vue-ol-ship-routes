<template>
  <div class="home">
    <!-- <osm-map></osm-map> -->
    <!-- <bing-map></bing-map> -->
    <!-- <amap></amap> -->
    <tian-map></tian-map>
  </div>
</template>
<script>
import OsmMap from '@/components/OsmMap'
import BingMap from '@/components/BingMap'
import Amap from '@/components/Amap'
import TianMap from '@/components/TianMap'

export default {
  name: 'Home',
  components: {
    OsmMap,
    BingMap,
    Amap,
    TianMap
  }
}
</script>

<style scoped lang="scss">
.home{
  width: 100%;
  height: 100%;
}
</style>
