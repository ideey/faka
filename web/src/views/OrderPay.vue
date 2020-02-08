<template>
  <div><h1>订单支付</h1>
  <div class="order_pay_main">
    <div class="order_pay_info">
      <div class="order_pay_info_item x1">订单编号:</div>
      <div class="order_pay_info_value x1">{{order_info._id}}</div>
      <div class="order_pay_info_item x2">商品名称:</div>
      <div class="order_pay_info_value x2">{{order_info.goods_name}}</div>
      <div class="order_pay_info_item x1">商品价格:</div>
      <div class="order_pay_info_value x1">{{order_info.price}}</div>
      <div class="order_pay_info_item x2">商品数量:</div>
      <div class="order_pay_info_value x2">{{order_info.num}}</div>
      <div class="order_pay_info_item x1">商品金额:</div>
      <div class="order_pay_info_value x1">{{order_info.money}}</div>
      <div class="order_pay_info_item x2">联系方式:</div>
      <div class="order_pay_info_value x2">{{order_info.qq_email}}</div>
      <div class="order_pay_info_item x1">查询密码:</div>
      <div class="order_pay_info_value x1">{{order_info.password}}</div>
    </div>
    <div class="order_pay_pay">
      <div style="font-size:40px;color:orange;font-weight: bold;margin-top:50px;">{{order_info.money}} <span style="font-size:20px;">元</span> </div>
      <div style="margin-top:50px">    
        <el-radio v-model="pay_type" label="alipay_web" border>支付宝</el-radio>
        <el-radio v-model="pay_type" label="weixin" border disabled>微信</el-radio>
        </div>
        <div style="margin-top:100px;"><el-button  type="primary" @click="get_pay_link">立即支付</el-button> </div>
    </div>
    </div>
  </div>
</template>

<script>
export default {
     props: ['id'],
     data(){
       return{
         order_info:{},
         pay_type:'alipay_web'
       }
     },
     created(){this.fetch()},
     methods:{
       async fetch(){
         const d = await this.$http.post('/web/order/api/get_order_info',{id:this.id})
         console.log(d.data.data)
         if(d.data.code === 1){
           this.order_info = d.data.data
         }
       },
       async get_pay_link(){
         this.order_info.pay_type = this.pay_type
         const d = await this.$http.post('/pay/api/get_alipay_web_link',this.order_info)
         if(d.data.code===1){
          window.open(d.data.data)
          this.$confirm('请在新打开的窗口中,完成支付', '提示', {
          confirmButtonText: '支付完成',
          cancelButtonText: '支付出问题',
          type: 'warning'
        }).then(() => {
          this.$router.push('/order_pay_good/'+this.order_info._id)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '支付失败'
          });          
        });
      
         }
       }
     }
}
</script>

<style>
.order_pay_main{
  display: grid;
  grid-template-columns: 5fr 3fr;
  place-items: center center;
  grid-column-gap: 30px;
}
.order_pay_info{
  width: 500px;
  height: 400px;
  border-radius: 20px;
 
  box-shadow: 3px 3px 10px 1px rgba(0,0,0,0.3),-3px -3px 10px 1px rgba(0,0,0,0.3);
  display: grid;
  padding:20px;
  align-items: center;
  justify-items: center;
  grid-template-columns: 30% 70%;
  grid-template-rows: repeat(7,50px);
}
.order_pay_info_item{
  width: 100%;
  height: 50px;
  display: grid;
  justify-items: center;
  align-items: center;
}
.order_pay_info_value{
  width: 100%;
  height: 50px;
  display: grid;
  justify-items: start;
  align-items: center;
}
.order_pay_pay{
  width:300px;
  height: 400px;
  border-radius: 20px;
  box-shadow: 3px 3px 10px 1px rgba(0,0,0,0.3),-3px -3px 10px 1px rgba(0,0,0,0.3);
}
.x1{
  background-color: rgba(223, 236, 245, 0.3);
}
.x2{
  background-color: rgba(185, 178, 178, 0.2);
}
</style>