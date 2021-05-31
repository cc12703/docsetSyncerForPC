import Vue from "vue"
import ElementUI from 'element-ui'
import VueWechatTitle from 'vue-wechat-title'

import App from "@/render/App.vue"
import router from "@/render/router"
import * as store from '@/render/store'
import bus from '@/render/utils/bus'


import 'element-ui/lib/theme-chalk/index.css'

Vue.config.productionTip = false

Vue.prototype.$store = store
Vue.prototype.$bus = bus

Vue.use(ElementUI)
Vue.use(VueWechatTitle)

new Vue({
  router,
  render: h => h(App)
}).$mount("#app")
