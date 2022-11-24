<!--  -->
<template>
   <div id="map"></div>
</template>

<script>
import { onMounted } from 'vue';

import Map from 'ol/Map';
import TileLayer from 'ol/layer/Tile';
import View from 'ol/View';
import WMTS, {optionsFromCapabilities} from 'ol/source/WMTS';
import WMTSCapabilities from 'ol/format/WMTSCapabilities';
import {DEVICE_PIXEL_RATIO} from 'ol/has';

export default {
   components:{},
   props:{},
   setup(props){
      watch:{()=>data,()=>{}}
      onMounted(()=>{
        // mount start

        const capabilitiesUrl = 'https://basemap.at/wmts/1.0.0/WMTSCapabilities.xml';

        // HiDPI support:
        // * Use 'bmaphidpi' layer (pixel ratio 2) for device pixel ratio > 1
        // * Use 'geolandbasemap' layer (pixel ratio 1) for device pixel ratio == 1
        const hiDPI = DEVICE_PIXEL_RATIO > 1;
        const layer = hiDPI ? 'bmaphidpi' : 'geolandbasemap';
        const tilePixelRatio = hiDPI ? 2 : 1;

        const map = new Map({
          target: 'map',
          view: new View({
            center: [1823849, 6143760],
            zoom: 11,
          }),
        });

        fetch(capabilitiesUrl)
          .then(function (response) {
            return response.text();
          })
          .then(function (text) {
            const result = new WMTSCapabilities().read(text);
            const options = optionsFromCapabilities(result, {
              layer: layer,
              matrixSet: 'google3857',
              style: 'normal',
            });
            options.tilePixelRatio = tilePixelRatio;
            options.attributions =
              'Grundkarte: <a target="_blank" href="https://basemap.at/">basemap.at</a>';
            map.addLayer(
              new TileLayer({
                source: new WMTS(options),
              })
            );
          });
        // mount end
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