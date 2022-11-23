<template>
    <div id="container"></div>
    <div id="mouse-position" class="mouse-position-wrapper">
        <div class="custom-mouse-position"></div>
    </div>
</template>

<script>
import { onMounted } from 'vue';

import { getTopLeft, getWidth } from 'ol/extent';
import TileLayer from 'ol/layer/Tile';
import Map from 'ol/Map';
import 'ol/ol.css';
import { fromLonLat, get as getProjection } from 'ol/proj';
import WMTS from 'ol/source/WMTS';
import View from 'ol/View';

import {
    defaults as defaultControls, FullScreen,
    MousePosition,
    OverviewMap,
    ScaleLine
} from 'ol/control';
import { createStringXY } from 'ol/coordinate';
import WMTSTileGrid from 'ol/tilegrid/WMTS';

export default {
    name:'TianMap',
    components: {},
    props: {},
    setup(props){
        watch: {()=>data,()=>{}}
        onMounted(()=>{
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
                target: 'container',
                layers: [
                    //  矢量底图
                    new TileLayer({
                        source: new WMTS({
                            url:`http://t{0-7}.tianditu.gov.cn/vec_w/wmts?tk=${accessKey}`,
                            projection,
                            layer:'vec',
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
                    }),
                    // 注记图层
                    new TileLayer({
                        source: new WMTS({
                            url:`http://t{0-7}.tianditu.gov.cn/cva_w/wmts?tk=${accessKey}`,
                            projection,
                            layer:'cva',
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
                    }),
                    // 水深图层
                    new TileLayer({
                        source: new WMTS({
                            url:`http://t{0-7}.tianditu.gov.cn/shuishen_w/wmts?tk=${accessKey}`,
                            projection,
                            layer:'shuishen',
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
                ],
                view: new View({
                    center: fromLonLat([118.34,38.69]),
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