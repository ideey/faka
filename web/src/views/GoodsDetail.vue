<template>
  <div class="goods_detail">
      <div class="goods_detail_1">
          <div class="goods_detail_img"><img :src="goods.goods_img" alt="" style="max-width:300px;border-radius: 10px;" class="goods_detail_img_q"></div>
          <div class="goods_detail_info">
              <div class="goods_detail_d">
                      <el-tag size="mini" type="warning">自动发卡</el-tag> 
                      <span style="font-size:18px;font-weight: bold;">
                          商品名称:{{goods.name}}
                      </span>
                </div>
              <div class="goods_detail_price">价格:{{goods.price}}元</div>
              <div  class="goods_detail_qq">购买数量<el-input-number v-model="order.num"  :min="1" :max="1" label="描述文字" size="small"></el-input-number></div>
              <div class="goods_detail_qq">联系方式<el-input v-model="order.qq_email" placeholder="输入手机/QQ/邮箱" size="small"></el-input></div>
              <div  class="goods_detail_qq">查询密码<el-input v-model="order.password" placeholder="查询密码" size="small"></el-input></div>
              <div><el-button size="medium" type="primary" plain @click="create_order">点击购买</el-button></div>
          </div>
          <div class="goods_detail_more">
              <h3>商品说明:</h3>
                <div class="goods_detail_des"><span>{{goods.description}}</span></div>
              </div>
      </div>
      
  </div>
</template>

<script>
export default {
 props: ['id'],
data(){
    return{
        goods:{},
        order:{
            num:1,
            qq_email:'',
            password:''
        }
    }
},
created(){this.fetch()},
methods:{
    async fetch(){
        const d = await this.$http.post('/web/goods/api/get_goods',{id:this.id})
        if(d.data.data.goods_img){ 
                d.data.data.goods_img = process.env.VUE_APP_API_URL+d.data.data.goods_img
             }else{
                d.data.data.goods_img = process.env.VUE_APP_API_URL+'/uploads/default'
             }
        this.goods = d.data.data
    },
    async create_order(){
        if(!this.order.qq_email){
            //this.$message({type:'error',message:'请输入联系方式: 手机 或 QQ 或 邮箱 ,后续查询卡密的重要信息'})
            this.$notify({
                title: '注意',
                message: '输入联系方式: 手机 或 QQ 或 邮箱 \n后续查询卡密的重要信息',
                type: 'warning'
            });
            return ;
        }
        if(!this.order.password){
            //this.$message({type:'error',message:'请输入查询密码, 后续查看卡密的重要信息'})
            this.$notify({
                title: '注意',
                message: '请输入查询密码, 后续查看卡密的重要信息',
                type: 'warning'
            });
            return ;
        }
        const d = await this.$http.post('/web/order/api/create_order',{goods:this.goods,order:this.order})
        if(d.data.code ===1){
            this.$router.push('/order_pay/'+d.data.data._id)
        }
        //console.log(d.data)
    }
},
}
</script>

<style>
.goods_detail_1{
    width:990px;
    border-radius: 20px;
    box-shadow: 3px 3px 10px 1px rgba(0,0,0,0.3),-3px -3px 10px 1px rgba(0,0,0,0.3);
    display: grid;
    place-items: center center;
    grid-template-columns: 40% 60%;
    grid-template-rows:380px auto;
}
.goods_detail_img{
    padding:10px;
}
.goods_detail_info{
    width: 90%;
    place-self: center start ;
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 50px 50px 50px 50px 50px 50px;
    place-items:center start;
}
.goods_detail_d{
    border-bottom: solid 1px rgba(0,0,0,0.3);
    padding-bottom:8px;
    width: 95%;
    text-align:left;
}
.goods_detail_price{
    width:95%;
    height: 50px;
    background-image: linear-gradient(to right,rgb(163,90,231),rgb(126, 19, 226),rgb(183, 115, 247));
    background-color: rgb(163, 90, 231);
    color: antiquewhite;
    font-size: 16px;
    font-weight: bold;
    display: grid;
    place-items: center start;
    padding-left: 5px;
    border-radius: 3px;
    box-shadow: 2px -2px 5px 2px rgba(0,0,0,0.15),-2px 2px 5px 2px rgba(0,0,0,0.15) ;
}
.goods_detail_price:hover{
    box-shadow: 2px -2px 5px 2px rgba(0,0,0,0.35),-2px 2px 5px 2px rgba(0,0,0,0.35) ;
}
.goods_detail_img_q{
    box-shadow: 2px -2px 10px 3px rgba(73, 180, 241, 0.2),-2px 2px 10px 3px rgba(73, 180, 241, 0.2) ;
}
.goods_detail_img_q:hover{
    box-shadow: 2px -2px 10px 3px rgba(73, 180, 241, 0.35),-2px 2px 10px 3px rgba(73, 180, 241, 0.35) ;
}
.goods_detail_qq{
    display: grid;
    grid-template-columns: 85px 1fr;
    place-items: center start;
}
.goods_detail_more{
    grid-column: 1/3;
    padding: 1px 20px 20px 20px;
    align-self: start;
}
.goods_detail_des{
    width: 500px;
    padding:30px 10px;
    border-radius: 20px;
    box-shadow: 2px -2px 10px 3px rgba(137, 140, 141, 0.15),-2px 2px 10px 3px rgba(88, 88, 88, 0.15);
}
</style>