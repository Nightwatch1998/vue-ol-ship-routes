<!--  -->
<template>
   <div id="map"></div>
   <input id="swipe" type="range" style="width: 100%"/>
</template>

<script>
import { onMounted } from 'vue';

import Map from 'ol/Map';
import OSM from 'ol/source/OSM';
import TileLayer from 'ol/layer/WebGLTile';
import View from 'ol/View';
import {getRenderPixel} from 'ol/render';
import WMTS from 'ol/source/WMTS';
import WMTSTileGrid from 'ol/tilegrid/WMTS';
import { fromLonLat, get as getProjection } from 'ol/proj';
import { getTopLeft, getWidth } from 'ol/extent';

export default {
   components:{},
   props:{},
   setup(props){
      watch:{()=>data,()=>{}}
      onMounted(()=>{
        // mount start

        const osm = new TileLayer({
          source: new OSM({wrapX: true}),
        });

        const projection = getProjection('EPSG:3857')
        // 获取投影的有效性范围
        const projectionExtent = projection.getExtent()
        const size = getWidth(projectionExtent)/256
        const resolutions = new Array(18)
        // 层级缩放矩阵
        const matrixIds = new Array(18)
        for (let z= 1;z < 19 ; ++z){
            resolutions[z] = size / Math.pow(2,z)
            matrixIds[z] = z
        }
        let accessKey = '7b7fbb3f7001c08bc310cf7c33b753ff'

        const imagery = new TileLayer({
          source: new WMTS({
            url:`http://t{0-7}.tianditu.gov.cn/img_w/wmts?tk=${accessKey}`,
            projection,
            layer:'img',
            matrixSet:'w',
            format:'tiles',
            style:'default',
            tileGrid: new WMTSTileGrid({
                origin: getTopLeft(projectionExtent),
                resolutions,
                matrixIds
            }),
            wrapX:true
          })
        })

        const map = new Map({
          layers: [osm, imagery],
          target: 'map',
          view: new View({
            center: [0, 0],
            zoom: 2,
          }),
        });

        const swipe = document.getElementById('swipe');

        imagery.on('prerender', function (event) {
          const gl = event.context;
          gl.enable(gl.SCISSOR_TEST);

          const mapSize = map.getSize(); // [width, height] in CSS pixels

          // get render coordinates and dimensions given CSS coordinates
          const bottomLeft = getRenderPixel(event, [0, mapSize[1]]);
          const topRight = getRenderPixel(event, [mapSize[0], 0]);

          const width = Math.round((topRight[0] - bottomLeft[0]) * (swipe.value / 100));
          const height = topRight[1] - bottomLeft[1];

          gl.scissor(bottomLeft[0], bottomLeft[1], width, height);
        });

        imagery.on('postrender', function (event) {
          const gl = event.context;
          gl.disable(gl.SCISSOR_TEST);
        });

        swipe.addEventListener('input', function () {
          map.render();
        });

        // mount end
      })
   }
}
</script>

<style scoped>
   #map{
      width: 100%;
      height: 400px;
   }
</style>