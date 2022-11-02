<template>
    <div id="container"></div>
    <div id="mouse-position" class="mouse-position-wrapper">
        <div class="custom-mouse-position"></div>
    </div>
</template>

<script>
import {ref, watch, onMounted} from 'vue'

import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import {
    FullScreen,
    MousePosition,
    OverviewMap,
    ScaleLine,
    defaults as defaultControls
    } from 'ol/control';
import {createStringXY} from 'ol/coordinate';

export default {
    name:'OsmMap',
    components: {},
    props: {},
    setup(props){
        watch: {()=>data,()=>{}}
        onMounted(()=>{
            const map  = new Map({
                // controls是一个Collection对象
                controls: defaultControls().extend([
                    new FullScreen(),
                    // 修改默认位置
                    new MousePosition({
                        coordinateFormat:createStringXY(6),
                        projection: 'EPSG:4326',
                        className:'custom-mouse-position',
                        target:document.getElementById('mouse-position')
                    }),
                    new OverviewMap(),
                    new ScaleLine()
                ]),
                target: 'container',
                layers: [
                    new TileLayer({
                        source: new XYZ({
                            url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
                        })
                    })
                ],
                view: new View({
                    projection:'EPSG:4326',
                    center: [118.34,38.69],
                    zoom: 8
                })
            })
        })
    }
}
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