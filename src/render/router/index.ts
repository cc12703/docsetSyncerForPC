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
      path: '/Settings',
      name: 'Settings',
      component: () => import('@/render/views/Settings.vue'),
      meta: {
        title: '设置'
      }
    },
  ]

}) 