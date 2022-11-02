<template>
    <div id="map"></div>
    <select id="layer-select">
      <option value="Aerial">Aerial</option>
      <option value="AerialWithLabelsOnDemand" selected>Aerial with labels</option>
      <option value="RoadOnDemand">Road</option>
      <option value="CanvasDark">Road dark</option>
      <option value="OrdnanceSurvey">Ordnance Survey</option>
    </select>
</template>

<script>
import {ref, watch, onMounted} from 'vue'

import BingMaps from 'ol/source/BingMaps';
import Map from 'ol/Map';
import TileLayer from 'ol/layer/Tile';
import View from 'ol/View';

export default {
  name:'BingMap',
  components: {},
  props: {},
  setup(props){
    watch: {()=>data,()=>{}}
    onMounted(()=>{
      const styles = [
        'RoadOnDemand',
        'Aerial',
        'AerialWithLabelsOnDemand',
        'CanvasDark',
        'OrdnanceSurvey',
      ];
      const layers = [];
      for(let i=0;i<styles.length;i++){
        layers.push(
          new TileLayer({
            visible:false,
            preload:Infinity,
            source:new BingMaps({
              key:'AuhjqvgkoaLn1EyLhS3RlNjCdaipwUyY8L0MkxgjKD2a_jCb-VxqYYjGfYzuWyxX',
              imagerySet:styles[i],
              // maxZoom:19
            })
          })
        )
      }
      const map = new Map({
        layers:layers,
        target:'map',
        view:new View({
          center:[-6655.5402445057125, 6709968.258934638],
          zoom:13,
        })
      })
      const select = document.getElementById('layer-select');
      function onChange() {
        const style = select.value;
        for (let i = 0; i < layers.length; i++) {
          layers[i].setVisible(styles[i] === style);
        }
      }
      select.addEventListener('change', onChange);
      onChange();
    })
  }
}
</script>

<style lang='scss' scoped>
  #map{
    width: 100%;
    height: 90%;
  }
</style>