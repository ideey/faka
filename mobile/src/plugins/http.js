import axios from 'axios'
import Vue from 'vue'
import router from '../router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
NProgress.configure({ minimum: 0.15, speed: 600 });//easing: 'ease',

const http = axios.create({
  baseURL: process.env.VUE_APP_API_URL
   //baseURL: 'http://localhost:3000/'
  
})
http.interceptors.request.use(function (config) {
  //console.log(NProgress.status)
  NProgress.start()
 
  if (localStorage.token) {
    config.headers.Authorization = 'Bearer ' + localStorage.token
  }
  return config;
}, function (error) {
  
  return Promise.reject(error);
});
http.interceptors.response.use(res => {

  NProgress.inc(0.8)
  NProgress.done()
  return res
}, err => {
  NProgress.done()
  //console.log(err)
  if (err.response.data.message) {
    
    if(err.response.data.message==='invalid signature'){
      err.response.data.message = 'Token验证失败,重新登陆'
    }
    if(err.response.data.message==='invalid token'){
      err.response.data.message = 'Token出错,重新登陆'
    }
    if(err.response.data.message==='jwt expired'){
      err.response.data.message = 'Token过期,重新登陆'
    }

    Vue.prototype.$notify({
      type: 'warning',
      message: err.response.data.message
    })
    if(err.response.status ===500 && 
      (err.response.data.message ==='Token验证失败,重新登陆'||
      err.response.data.message ==='Token出错,重新登陆'||
      err.response.data.message ==='Token过期,重新登陆'
      )){   //专门针对token验证失败的跳转  别的500错误暂时不跳
      router.push('/login')
    }
    if (err.response.status === 401) {
      router.push('/login')
    }
    if (err.response.status === 441) {//自定义状态码
      router.push('/shop/create')
    }

  }
  
  return Promise.reject(err)
})

export default http