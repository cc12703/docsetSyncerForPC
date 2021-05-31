import Vue from "vue"
import VueRouter from "vue-router"

Vue.use(VueRouter);


export default new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/Sync',
      name: 'Sync',
      component: () => import('@/render/views/Sync.vue'),
      meta: {
        title: '同步'
      }
    },
    {
      path: '/SyncSettings',
      name: 'SyncSettings',
      component: () => import('@/render/views/SyncSettings.vue'),
      meta: {
        title: '同步设置'
      }
    },
    {
      path: '/ToolSettings',
      name: 'ToolSettings',
      component: () => import('@/render/views/ToolSettings.vue'),
      meta: {
        title: '工具设置'
      }
    },
  ]

}) 