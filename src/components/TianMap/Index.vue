<template>
    <div id="container"></div>
    <div id="mouse-position" class="mouse-position-wrapper">
        <div class="custom-mouse-position"></div>
    </div>
</template>

<script setup>
import { onMounted } from 'vue';
import Map from 'ol/Map';
import View from 'ol/View';
import {transform ,fromLonLat} from 'ol/proj';
import {defaults as defaultControls, FullScreen,MousePosition,OverviewMap,ScaleLine} from 'ol/control';
import { createStringXY, format } from 'ol/coordinate';
import Point from 'ol/geom/Point';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import {Style,Stroke,Fill,Icon} from 'ol/style'
import CircleStyle from 'ol/style/Circle';
import 'ol/ol.css';
import {baseLayer,noteLayer,waterLayer} from './map/index'
import {shipRoute} from '@/assets/data/route.js'
import Feature from 'ol/Feature';
import {getVectorContext} from 'ol/render';


console.log("地图初始化中...")
// 初始化地图
const initMap = ()=>{
    const map  = new Map({
        // controls是一个Collection对象
        controls: defaultControls().extend([
            new FullScreen(),
            // 修改默认位置
            new MousePosition({
                coordinateFormat:createStringXY(6),
                projection: 'EPSG:3857',
                className:'custom-mouse-position',
                target:document.getElementById('mouse-position')
            }),
            new OverviewMap(),
            new ScaleLine()
        ]),
        layers:[baseLayer,noteLayer],
        target: 'container',
        view: new View({
            center: fromLonLat([118.34,38.69]),
            zoom: 9
        })
    })
    return map
}

// 创建样式
const styles = {
    'route':new Style({
        stroke: new Stroke({
            width: 3,
            color: [237, 212, 0, 0.8],
        }),
    }),
    'shipMarker':new Style({
        image:new CircleStyle({
            radius: 7,
            fill : new Fill({color:'black'}),
            stroke:new Stroke({
                color:'White',
                width:2
            })
        })
    }),
    'shipIcon':new Style({
        image:new Icon({
            anchor:[0.5,1],
            src:'icon/boat.png',
            scale:0.8,
            color:'green',
            rotation: 1
        })
    })
}

/**
 * 通过要素加载GeoJson
 */
const addGeoJsonByFeature = ()=>{

    // 船舶路径
    const routeFeatures = (new GeoJSON({featureProjection:'EPSG:3857'})).readFeatures(shipRoute)
    const routeFeature = routeFeatures[0]
    routeFeature.set('type','route')

    // 船舶图标
    const shipMarker = new Feature({
        type:'shipIcon',
        geometry: new Point([13334528.214218894,4739881.4851143295])
    })
    const routeSource = new VectorSource({
        features:[ routeFeature, shipMarker ]
    })
    const vectorLayer = new VectorLayer({
        source:routeSource,
        style:function(feature){
            return styles[feature.get('type')]
        }
    })
    return {vectorLayer,routeFeature,shipMarker}
}

/**
 * 通过图层加载GeoJson
 */
const addGeoJsonByLayer = ()=>{
    // 新建矢量图层
    const shipRouteSource = new VectorSource({
        projection:'EPSG:4326',
        url:'data/route.geojson',
        format:new GeoJSON()
    })
    // 样式获取函数
    const styleFunction = feature => styles[feature.getGeometry().getType()]
    const shipRouteLayer = new VectorLayer({
        source: shipRouteSource,
        style: styleFunction,
    })
    console.log(shipRouteSource.getFeatures())
    map.addLayer(shipRouteLayer)
}

// 生命周期钩子
onMounted(()=>{
    const map = initMap()
    const {vectorLayer,routeFeature,shipMarker} = addGeoJsonByFeature()
    map.addLayer(vectorLayer)

    // 初始化行驶距离和时间
    let distance = 0
    let lastTime = Date.now()

    // 添加船舶运动动画
    const startShipMove = (event)=>{
        // 获取要素的geometry
        const route = routeFeature.getGeometry()
        const position = shipMarker.getGeometry()
        // console.log(event)
        const speed = Number(50);
        const time = event.frameState.time;
        const elapsedTime = time - lastTime;
        // console.log(elapsedTime)
        distance = (distance + (speed * elapsedTime) / 1e6) % 2;
        lastTime = time;

        // distance为0-1
        const currentCoordinate = route.getCoordinateAt(
            distance > 1 ? 2 - distance : distance
        );

        position.setCoordinates(currentCoordinate);
        // 设置船舶图标方向
        // styles.shipIcon.setRotation(0)
        const vectorContext = getVectorContext(event);
        vectorContext.setStyle(styles.shipIcon);
        vectorContext.drawGeometry(position);
        // tell OpenLayers to continue the postrender animation
        map.render();
    }
    vectorLayer.on('postrender',startShipMove)
})

</script>

<style lang='scss' scoped>
    #container{
        width: 100%;
        height: 100%;
    }

    .mouse-position-wrapper{
        width:200px; 
        height:20px; 
        color:rgb(0, 0, 0); 
        position:absolute; 
        right:20px; 
        bottom:6px; 
        z-index:999;
    }

</style>