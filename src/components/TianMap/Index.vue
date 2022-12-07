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
import 'ol/ol.css';
import {transform ,fromLonLat} from 'ol/proj';
import { createStringXY, format } from 'ol/coordinate';
import {defaults as defaultControls, FullScreen,MousePosition,OverviewMap,ScaleLine} from 'ol/control';
import Point from 'ol/geom/Point';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import {Style,Stroke,Fill,Icon} from 'ol/style'
import Feature from 'ol/Feature';
import PopupFeature from 'ol-ext/overlay/PopupFeature'

// 引入自定义工具
import {baseLayer,noteLayer,waterLayer} from './map/index'
import {shipRoute} from '@/assets/data/route.js'
import {getIconRotation} from '@/utils/mathtool.js'

console.log("地图初始化中...")
let map = null
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
        layers:[baseLayer,noteLayer,waterLayer],
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
        image:new Icon({
            anchor:[0.5,0.5],
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
        type:'shipMarker',
        geometry: new Point([13334528.214218894,4739881.4851143295])
    })
    // 设置样式
    shipMarker.setStyle(styles['shipMarker'])

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

// 监听缩放级别，更新船舶图标尺寸
const startlistenOnShipIconScale = (shipMarker)=>{
    map.getView().on('change:resolution', (event) => {
        let newZoom = map.getView().getZoom().toFixed(0)
        let newScale = 0.8
        // 设置船舶图标尺寸
        if(newZoom<=7){
            newScale = 0
        }else if(newZoom<=8){
            newScale = 0.6
        }else if(newZoom<=10){
            newScale = 0.8
        }else{
            newScale = 0.8
        }
        shipMarker.getStyle().getImage().setScale(newScale)
        // console.log(newZoom )
        // 更新设置后渲染地图
        map.render();
    });
}

// 生命周期钩子
onMounted(()=>{
    map = initMap()
    const {vectorLayer,routeFeature,shipMarker} = addGeoJsonByFeature()
    map.addLayer(vectorLayer)

    // 初始化行驶距离和时间
    let distance = 0
    let lastTime = Date.now()
    // 船舶位置刷新的新旧位置
    let oldpos = [13334528.214218894,4739881.4851143295]
    let newpos = []

    // 添加船舶运动动画
    const startShipMove = (event)=>{
        // 获取要素的geometry
        const route = routeFeature.getGeometry()
        const position = shipMarker.getGeometry()
        // console.log(event)
        const speed = Number(20);
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
        // 计算船舶图标方向
        newpos = shipMarker.getGeometry().getCoordinates()
        const heading = getIconRotation(oldpos,newpos)
        // console.log(heading)
        oldpos = newpos
        // 设置船舶图标方向
        shipMarker.getStyle().getImage().setRotation(heading)
        // 更新设置后渲染地图
        map.render();
    }
    vectorLayer.on('postrender',startShipMove)

    // 更新船舶图标尺寸
    startlistenOnShipIconScale(shipMarker)

    // 水文数据展示牌
    // const shipPopUp = new PopupFeature({

    // })
    // console.log(PopupFeature)
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