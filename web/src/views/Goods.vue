<template>
  <div class="good_list">
    <div class="goods" v-for="item in goods_list" :key="item._id">
      <div class="goods_1"><img :src="item.goods_img" alt="" style="max-width:100%"></div>
      <span class="goods_2 mid_mid">{{item.name}}</span>
      <span class="goods_3 mid_mid">{{item.price}}元</span>
      <span class="goods_4 mid_mid">798人付款</span>
      <div class="goods_5 mid_mid"><div class="goods_buy" @click="go_buy(item._id)">现在购买</div></div>
    </div>

  </div>
</template>

<script>
export default {
  data(){
    return{
      goods_list:[]
    }
  },
  created(){this.fetch()},
  methods:{
    async fetch(){
      const d = await this.$http.post('/web/goods/api/get_goods')
      if(d.data.code ===1){
        let a = d.data.data.filter(el=>{
          if(el.goods_img){
            el.goods_img = process.env.VUE_APP_API_URL+el.goods_img
          }else{
            el.goods_img = process.env.VUE_APP_API_URL+'/uploads/default'
          }
          return el.active ===1
        })
        
        this.goods_list = a
      }
    },
    go_buy(id){
      this.$router.push('/goods_detail/'+id)
    }
  }
}
</script>

<style>
.good_list{
  display: grid;
  grid-template-columns: repeat(4,220px);
  place-items: center center;
  grid-row-gap: 20px;
  grid-column-gap: 20px;
  grid-auto-rows:310px;

}
.goods{
  width: 220px;
  height: 310px;
  color:cornsilk;
  background-color: blueviolet;
  background-image: linear-gradient(to bottom,rgb(169, 92, 241) 80%,blueviolet);
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 220px 25px 25px 40px;
  border-radius: 10px;
  box-shadow:3px 3px 5px  rgba(0,0,0,0.3),-3px -3px 8px  rgba(0,0,0,0.3);
}
.goods:hover{
  box-shadow:3px 3px 5px 3px rgba(238, 223, 9, 0.8),-3px -3px 8px 3px rgba(238,223,9,0.8);
}
.goods_1{
  grid-column:1/3;
  grid-row: 1/2;
}
.goods_1 img{
  border-radius: 10px 10px 0px 0px;
}
.goods_2{
  grid-column: 1/3;
  grid-row:2/3;
}
.goods_3{
  grid-row:3/4;
  grid-column: 1/2;
}
.goods_4{
  grid-row:3/4;
  grid-column: 2/3;
}
.goods_5{
  grid-row:4/5;
  grid-column: 1/3;
}
.goods_buy{
  width: 80%;
  padding:5px 0px;
  border-radius: 30px;
  background-image: linear-gradient(to right,rgb(150, 226, 126),rgb(35, 221, 51));
   box-shadow: 3px 2px 6px 3px rgba(0,0,0,0.2);
}
.goods_buy:hover{
  box-shadow: 3px 2px 6px 3px rgba(0,0,0,0.3);
}
</style>