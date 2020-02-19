<template>
  <div class="home">
    <div class="nav">
        <van-grid :column-num="3">
          <van-grid-item icon="wap-home"   text="IDeeY发卡" to='/' />      
          <van-grid-item icon="gift"   text="商品列表" to='/goods_list' />       
          <van-grid-item icon="cart-circle"   text="订单查询" to='/order_list' />  
        </van-grid>
    </div>
    <div class="main">
      <router-view  :key="$route.path"/>    
    </div>
    <div class="foot"><!-- <Foot></Foot> -->
     <span style="color:white;">交流QQ群: 1054239862</span><br>
      <a href="/admin"><span style="color:white;">电脑端</span></a>
    </div>
  </div>
</template>

<script>
//import Foot from '@/views/Foot.vue'
export default {
  components:{
     // Foot
    },
    data(){
      return{
        
      }
    }
}
</script>
<style>
.nav{
  padding:0px;
  margin:10px;
  border-radius: 10px;
  background-color:  #2c3e50;
  box-shadow: 2px 2px 5px 1px rgba(255, 255, 255, 0.1),-2px -2px 5px 1px rgba(255, 255, 255, 0.1);
}
.main{
  margin-bottom: 60px;
}
</style>
