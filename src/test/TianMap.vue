<template>
  <div id="map">
  </div>
</template>
 
<script>
import Map from 'ol/Map.js';
import View from 'ol/View.js';
import {defaults as defaultControls} from 'ol/control.js';
import {getWidth, getTopLeft} from 'ol/extent.js';
import TileLayer from 'ol/layer/Tile.js';
import {get as getProjection} from 'ol/proj.js';
import { fromLonLat } from "ol/proj";
import WMTS from 'ol/source/WMTS.js';
import WMTSTileGrid from 'ol/tilegrid/WMTS.js';
 
  export default {  //调用天地图WMTS服务
    name: 'TianMap',
    data() {
      return {
        map: null
      };
    },
    mounted() {
      var projection = getProjection('EPSG:3857');
      var projectionExtent = projection.getExtent();
      var size = getWidth(projectionExtent) / 256;
      var resolutions = new Array(18);
      var matrixIds = new Array(18);
      for (var z = 1; z < 19; ++z) {
	      // generate resolutions and matrixIds arrays for this WMTS
	      resolutions[z] = size / Math.pow(2, z);
	      matrixIds[z] = z;
      }
 
      var webKey = '7b7fbb3f7001c08bc310cf7c33b753ff';
 
      var wmtsUrl_1 = 'http://t{0-7}.tianditu.gov.cn/vec_w/wmts?tk='; //矢量底图
      var wmtsUrl_2 = 'http://t{0-7}.tianditu.gov.cn/cva_w/wmts?tk='; //矢量注记
 
      var wmtsUrl_3 = 'http://t{0-7}.tianditu.gov.cn/img_w/wmts?tk='; //影像底图
      var wmtsUrl_4 = 'http://t{0-7}.tianditu.gov.cn/cia_w/wmts?tk='; //影像注记
 
      var wmtsUrl_5 = 'http://t{0-7}.tianditu.gov.cn/ter_w/wmts?tk='; //地形底图
      var wmtsUrl_6 = 'http://t{0-7}.tianditu.gov.cn/cta_w/wmts?tk='; //地形注记
 
      var wmtsUrl_7 = 'http://t{0-7}.tianditu.gov.cn/ibo_w/wmts?tk='; //境界（省级以上）
      var wmtsUrl_8 = 'http://t{0-7}.tianditu.gov.cn/eva_w/wmts?tk='; //矢量英文注记
      var wmtsUrl_9 = 'http://t{0-7}.tianditu.gov.cn/eia_w/wmts?tk='; //影像英文注记
 
      var map1 = new Map({
	      layers: [
	        new TileLayer({
		        opacity: 0.7,
		        source: new WMTS({
		          url: wmtsUrl_3 + webKey,
		          layer: 'img',  //注意每个图层这里不同
		          matrixSet: 'w',
		          format: 'tiles',
		          style: 'default',
		          projection: projection,
		          tileGrid: new WMTSTileGrid({
			          origin: getTopLeft(projectionExtent),
			          resolutions: resolutions,
			          matrixIds: matrixIds
		          }),	  
		          wrapX: true
		        })
	        }),
	        new TileLayer({
	        	opacity: 0.7,
		        source: new WMTS({
		          url: wmtsUrl_4 + webKey,
		          layer: 'cia',   //注意每个图层这里不同
		          matrixSet: 'w',
		          format: 'tiles',
		          style: 'default',
		          projection: projection,
		          tileGrid: new WMTSTileGrid({
		        	  origin: getTopLeft(projectionExtent),
			          resolutions: resolutions,
			          matrixIds: matrixIds
		          }),	  
		          wrapX: true
		        })
	        })
	      ],
	      target: 'map',
	      view: new View({
	        center: fromLonLat([113.38, 23.09]),  //惠州
	        zoom: 5
	      })
      });
    }
  };
</script>
 
<style>
  #map{
    height:800px;
    width: 1400px;
  }
 
</style>