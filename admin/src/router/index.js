import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
    redirect:'/list_order',
    children:[
      {
        path:'overview',
        name:'overview',
        component: () => import('../views/OverView.vue')
      },
      {
        path:'about',
        name:'about',
        component: () => import('../views/About.vue')
      },
      {
        path:'set_email',
        name:'set_email',
        component: () => import('../views/Email.vue')
      },
      {
        path:'set_pay',
        name:'set_pay',
        component: () => import('../views/Pay.vue')
      },
      {
        path:'set_type',
        name:'set_type',
        component: () => import('../views/SetType.vue')
      },
      {
        path:'set_goods',
        name:'set_goods',
        component: () => import('../views/Goods.vue')
      },
      {
        path:'set_kami',
        name:'set_kami',
        component: () => import('../views/Kami.vue')
      },
      {
        path:'list_order',
        name:'list_order',
        component: () => import('../views/Order.vue')
      },
      {
        path:'list_user',
        name:'list_user',
        component: () => import('../views/User.vue')
      }
    ]
  },
  {
    path: '/reg',
    name: 'reg',
    meta: { isPublic: true },
    component: () => import(/* webpackChunkName: "about" */ '../views/Reg.vue')
  },
  {
    path: '/login',
    name: 'login',
    meta: { isPublic: true },
    component: () => import(/* webpackChunkName: "about" */ '../views/Login.vue')
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from ,next) => {
  //console.log('beforeEach...')
 //NProgress.start()
 if (!to.meta.isPublic && !localStorage.token) {
   return next('/login')
 }
/*  if(to.meta.permission&&!store.state.shopinfo.permission.includes(to.meta.permission[0])){
   Message.warning('没有对应权限')
   return next(false)
 } */
 next()
})

router.afterEach((to,from,next) => {
 //console.log('afterEach...')
 //NProgress.done()
});

export default router
