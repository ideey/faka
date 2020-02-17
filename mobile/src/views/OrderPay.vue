<template>
<div>
  <div class="order_pay">
      <van-cell-group>
        <van-cell title="订单编号" :value="order_info._id" />
        <van-cell title="商品名称" :value="order_info.goods_name" />
        <van-cell title="商品价格" :value="order_info.price"  />
        <van-cell title="商品数量" :value="order_info.num"  />
        <van-cell title="商品金额" :value="order_info.money" />
        <van-cell title="联系方式" :value="order_info.qq_email" />
        <van-cell title="查询密码" :value="order_info.password"  />
    </van-cell-group>
    </div>
    <div class="order_pay_1">
    <van-radio-group v-model="pay_type">
        <van-cell-group>
            <van-cell title="支付宝" clickable >
            <van-radio slot="right-icon" name="alipay_mobile" />
            </van-cell>
            <van-cell title="微信" clickable >
            <van-radio slot="right-icon" name="weixin"  disabled/>
            </van-cell>
            <van-cell title="乐付" clickable >
            <van-radio slot="right-icon" name="lepay"/>
            </van-cell>
        </van-cell-group>
</van-radio-group>
  </div>
  <div class="order_pay_2">
      <van-button type="primary" size="large" @click="get_pay_link">点击支付</van-button>
  </div>
  </div>
</template>

<script>
export default {
     props: ['id'],
     data(){
       return{
         order_info:{},
         pay_type:'alipay_mobile',
         isWeixin:false
       }
     },
     created(){
         this.fetch()
         const ua = navigator.userAgent.toLowerCase()
         if(/micromessenger/.test(ua)){
             this.isWeixin = true
         }

     },
     methods:{
         async fetch(){
         const d = await this.$http.post('/web/order/api/get_order_info',{id:this.id})
         //console.log(d.data.data)
         if(d.data.code === 1){
           this.order_info = d.data.data
            }
         },
         async get_pay_link(){
             if(this.pay_type==='alipay_mobile'){
                    this.order_info.pay_type = this.pay_type
                    const d = await this.$http.post('/pay/api/get_alipay_mobile_link',this.order_info)
                    //console.log(d.data)
                    if(d.data.code ===1){
                        if(this.isWeixin){
                            location.href=d.data.data
                        }else{
                            window.open(d.data.data)
                        }
                        this.$dialog.alert({
                            message:'请在支付宝中完成支付'
                        }).then(()=>{
                            this.$router.push('/order_pay_good/'+this.order_info._id)
                        })
                    }
             }else if(this.pay_type==='lepay'){
                    this.order_info.pay_type = this.pay_type
                    const d = await this.$http.post('/lepay/api/get_pay_link',this.order_info)
                    //console.log(d.data)
                    if(d.data.code===1){
                        if(d.data.data.data.trade_status==='NOTPAY'){
                            if(this.isWeixin){
                                location.href=d.data.data.data.url
                            }else{
                                window.open(d.data.data.data.url)
                            }
                            await this.$http.post('/lepay/api/auto_query_status',{_id:this.order_info._id})
                            this.$dialog.alert({
                            message:'请在乐付中完成支付'
                        }).then(()=>{
                            this.$router.push('/order_pay_good/'+this.order_info._id)
                        })
                            
                        }
                    }

             }
         }
     }
}
</script>

<style>
.order_pay,.order_pay_1,.order_pay_2{
    margin: 10px;
}
.order_pay .van-cell-group .van-cell .van-cell__title{
    flex-grow:1;
}
.order_pay .van-cell-group .van-cell .van-cell__value{
    flex-grow:2;
}
</style>