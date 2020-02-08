import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/vant'
import './plugins/clipboard2.js'
import http from './plugins/http'

Vue.config.productionTip = false
Vue.prototype.$http = http

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
