<!--  -->
<template>
   <div id="map"></div>
</template>

<script>
import TileLayer from 'ol/layer/Tile';
import Map from 'ol/Map';
import {OSM,TileDebug} from 'ol/source';
import View from 'ol/View';
import { onMounted } from 'vue';

export default {
   components:{},
   props:{},
   setup(props){
      watch:{()=>data,()=>{}}
      onMounted(()=>{
         const map = new Map({
            layers:[
               new TileLayer({
                  source:new OSM(),
               }),
               new TileLayer({
                  source:new TileDebug(),
               })
            ],
            target:'map',
            view:new View({
               center:[0,0],
               zoom:1
            })
         })
      })
   }
   
}
</script>

<style scoped>
     #map{
        width: 100%;
        height: 100%;
    }
</style>