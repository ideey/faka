<template>
  <div id="app">
    <el-container>
      <el-header style="padding:0;">
        <div class="header_1">
          <div class="header_1a">
            <span class="header_2">IDeeY发卡系统</span>
            <router-link to="/goods"><span class="header_3">商品列表</span></router-link>
            <router-link to="/order_list"><span class="header_3">订单查询</span></router-link>
        </div>
        </div>
        </el-header>
      <el-main>
        <div class="mid_mid"><router-view  :key="$route.path"/></div>
        </el-main>
      <el-footer>Footer</el-footer>
    </el-container>
  </div>
</template>
<script>
export default {
     
     data(){
       return{     }
     },
     methods:{
       go_home(){

       }
     }
     
}
</script>
<style>
.el-header{
 margin: 0;
 padding:0;
}
.header_1{
  width:100%;
  height: 100%;
  background-color: darkslategray;
  display: grid;
  place-items: center center;
}
.header_1a{
  width:990px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
   place-items: center center;
}
.header_2{
  font-size:30px;
  font-weight: bold;
  color:floralwhite;
}
.mid_mid{
  display: grid;
  place-items: center center;
}
.header_3{
  color:floralwhite;
  font-size: 20px;
  font-weight: bold;
}

</style>

