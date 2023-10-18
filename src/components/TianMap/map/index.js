import { getTopLeft, getWidth } from 'ol/extent';
import TileLayer  from 'ol/layer/Tile';
import { fromLonLat, get as getProjection } from 'ol/proj';
import TileWMS from 'ol/source/TileWMS'
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
    title:'天地图底图',
    preview:'icon/layerSwitcher/tian_vector_base.png',
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

//  影像底图
export const imageLayer = new TileLayer({
  title:'天地图底图',
  preview:'icon/layerSwitcher/tian_image.png',
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

// 注记图层
export const noteLayer = new TileLayer({
    title:'注记图层',
    preview:'icon/layerSwitcher/tian_vector_note.png',
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
    title:'水深图层',
    preview:'icon/layerSwitcher/water_depth_icon.png',
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

// geoserver发布的服务
export const geoserverLayer = new TileLayer({
  title:'电子航道图',
  preview:'',
  source: new TileWMS({
    url: 'http://localhost:8080/geoserver/HHIENC/wms',
    params: {'LAYERS': 'HHIENC:HHIENC', 'TILED': true},
    serverType: 'geoserver'
  })
})