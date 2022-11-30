import { getTopLeft, getWidth } from 'ol/extent';
import TileLayer from 'ol/layer/Tile';
import { fromLonLat, get as getProjection } from 'ol/proj';
import WMTS from 'ol/source/WMTS';
import WMTSTileGrid from 'ol/tilegrid/WMTS';

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

// 天地图图层
//  矢量底图
export const baseLayer = new TileLayer({
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
})
// 注记图层
export const noteLayer = new TileLayer({
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
})
// 水深图层
export const waterLayer =  new TileLayer({
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