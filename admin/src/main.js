import Vue from 'vue'
import App from './App.vue'
import './plugins/element.js'
import './plugins/clipboard2.js'
import router from './router'

Vue.config.productionTip = false

import http from './plugins/http'
Vue.prototype.$http = http

Vue.mixin({
  computed: {
    uploadUrl(){
      return this.$http.defaults.baseURL + '/admin/api/upload'
    }
  },
  methods: {
    getAuthHeaders(){
      return {
        Authorization: `Bearer ${localStorage.token || ''}`
      }
    }
  }
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
