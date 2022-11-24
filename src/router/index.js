import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'
import OsmMap from '@/components/OsmMap'
import BingMap from '@/components/BingMap'
import Amap from '@/components/Amap'
import TianMap from '@/components/TianMap'
import Test from '@/test/Test'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path:'/amap',
    name:'Amap',
    component: Amap
  },
  {
    path:'/osm',
    name:'OsmMap',
    component: OsmMap
  },
  {
    path:'/bing',
    name:'BingMap',
    component: BingMap
  },
  {
    path:'/tian',
    name:'TianMap',
    component: TianMap
  },
  ,
  {
    path:'/test',
    name:'Test',
    component: Test
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
