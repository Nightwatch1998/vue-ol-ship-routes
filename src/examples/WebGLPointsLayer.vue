<!--  -->
<template>
   <div id="map"></div>
</template>

<script>
import GeoJSON from 'ol/format/GeoJSON';
import Map from 'ol/Map';
import OSM from 'ol/source/OSM';
import TileLayer from 'ol/layer/Tile';
import Vector from 'ol/source/Vector';
import View from 'ol/View';
import WebGLPointsLayer from 'ol/layer/WebGLPoints';

import { onMounted } from 'vue';

export default {
   components:{},
   props:{},
   setup(props){
      watch:{()=>data,()=>{}}
      onMounted(()=>{
// mount start
const vectorSource = new Vector({
  url: 'https://openlayers.org/en/latest/examples/data/geojson/world-cities.geojson',
  format: new GeoJSON(),
  wrapX: true,
});

// console.log(vectorSource)
const predefinedStyles = {
  'icons': {
    symbol: {
      symbolType: 'image',
      src: 'data/icon.png',
      size: [18, 28],
      color: 'lightyellow',
      rotateWithView: false,
      offset: [0, 9],
    },
  },
  'triangles': {
    symbol: {
      symbolType: 'triangle',
      size: 18,
      color: [
        'interpolate',
        ['linear'],
        ['get', 'population'],
        20000,
        '#5aca5b',
        300000,
        '#ff6a19',
      ],
      rotateWithView: true,
    },
  },
  'triangles-latitude': {
    symbol: {
      symbolType: 'triangle',
      size: [
        'interpolate',
        ['linear'],
        ['get', 'population'],
        40000,
        12,
        2000000,
        24,
      ],
      color: [
        'interpolate',
        ['linear'],
        ['get', 'latitude'],
        -60,
        '#ff14c3',
        -20,
        '#ff621d',
        20,
        '#ffed02',
        60,
        '#00ff67',
      ],
      offset: [0, 0],
      opacity: 0.95,
    },
  },
  'circles': {
    symbol: {
      symbolType: 'circle',
      size: [
        'interpolate',
        ['linear'],
        ['get', 'population'],
        40000,
        8,
        2000000,
        28,
      ],
      color: ['match', ['get', 'hover'], 1, '#ff3f3f', '#006688'],
      rotateWithView: false,
      offset: [0, 0],
      opacity: [
        'interpolate',
        ['linear'],
        ['get', 'population'],
        40000,
        0.6,
        2000000,
        0.92,
      ],
    },
  },
  'circles-zoom': {
    symbol: {
      symbolType: 'circle',
      size: ['interpolate', ['exponential', 2.5], ['zoom'], 2, 1, 14, 32],
      color: ['match', ['get', 'hover'], 1, '#ff3f3f', '#006688'],
      offset: [0, 0],
      opacity: 0.95,
    },
  },
  'rotating-bars': {
    symbol: {
      symbolType: 'square',
      rotation: ['*', ['time'], 0.1],
      size: [
        'array',
        4,
        [
          'interpolate',
          ['linear'],
          ['get', 'population'],
          20000,
          4,
          300000,
          28,
        ],
      ],
      color: [
        'interpolate',
        ['linear'],
        ['get', 'population'],
        20000,
        '#ffdc00',
        300000,
        '#ff5b19',
      ],
      offset: [
        'array',
        0,
        [
          'interpolate',
          ['linear'],
          ['get', 'population'],
          20000,
          2,
          300000,
          14,
        ],
      ],
    },
  },
};

const map = new Map({
  layers: [
    new TileLayer({
      source: new OSM(),
    }),
  ],
  target: document.getElementById('map'),
  view: new View({
    center: [0, 0],
    zoom: 2,
  }),
});

let literalStyle;
let pointsLayer;

let selected = null;

map.on('pointermove', function (ev) {
  if (selected !== null) {
    selected.set('hover', 0);
    selected = null;
  }

  map.forEachFeatureAtPixel(ev.pixel, function (feature) {
    feature.set('hover', 1);
    selected = feature;
    return true;
  });
});

function refreshLayer(newStyle) {
  const previousLayer = pointsLayer;
  pointsLayer = new WebGLPointsLayer({
    source: vectorSource,
    style: newStyle,
  });
  map.addLayer(pointsLayer);

  if (previousLayer) {
    map.removeLayer(previousLayer);
    previousLayer.dispose();
  }
  literalStyle = newStyle;
}

refreshLayer(predefinedStyles['triangles-latitude']);

// animate the map
function animate() {
  map.render();
  window.requestAnimationFrame(animate);
}
animate();
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
   .example-showcase .el-dropdown-link {
      cursor: pointer;
      color: var(--el-color-primary);
      display: flex;
      align-items: center;
   }
</style>