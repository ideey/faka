<template>
  <div class="order_pay_good">
      <div >
          <van-row>
            <van-col span="4"></van-col>
            <van-col span="16"><div class="order_pay_good_text">{{pay_text}}</div></van-col>
            <van-col span="4"></van-col>
        </van-row>
      </div>
      <div class="order_pay_good_1">
        <van-cell-group>
        <van-cell title="订单编号" :value="order_info._id" />
        <van-cell title="商品名称" :value="order_info.goods_name" />
        <van-cell title="商品价格" :value="order_info.price"  />
        <van-cell title="商品数量" :value="order_info.num"  />
        <van-cell title="商品金额" :value="order_info.money" />
         <van-cell title="联系方式" :value="order_info.qq_email" />
        <van-cell title="支付状态" > 
              <template slot="default">
                <van-tag type="danger" v-if="order_info.status===1">未支付</van-tag>
                <van-tag type="success" v-else-if="order_info.status===2">支付成功</van-tag>
                <van-tag type="success" v-else-if="order_info.status===3">支付成功-手动确认</van-tag>
                <van-tag type="warning" v-else-if="order_info.status===4">支付成功-无卡密-联系客服</van-tag>
            </template>
        </van-cell>
    </van-cell-group>
      </div>
      <div class="order_pay_good_2" v-if="pay_good===true">
          <div v-if="pay_bad_status===0">
                <van-panel title="卡密信息" >
                <div>{{order_info.kami}}</div>
                <div slot="footer">
                <van-button size="small" type="primary" @click="copy_kami">复制卡密</van-button>
               <!--  <van-button size="small" type="danger">按钮</van-button> -->
            </div>
            </van-panel>
          </div>
          <div v-if="this.pay_bad_status===4">
               <van-cell  value="支付成功,但卡密无库存,请联系客服微信:12345" />
          </div>
      </div>
      <div class="order_pay_good_3" v-else-if="pay_good===false">
          <div v-if="pay_bad_status===1">
              <van-panel title="支付倒计时" >
                    <div><van-count-down :time="time" format="DD 天 HH 时 mm 分 ss 秒" /></div>
                    <div slot="footer">
                        <van-button size="large" type="primary" @click="pay_continue">继续支付</van-button>
                        <van-button size="large" type="info" @click="pay_yes_no">刷新状态</van-button>
                    </div>
                    </van-panel>
          </div>
          <div v-else-if="pay_bad_status===5">
              <van-button size="large" type="primary" @click="pay_continue_lepay">继续用乐付支付</van-button>
              <van-button size="large" type="info" @click="pay_yes_no_lepay">刷新状态</van-button>
          </div>
          <div v-else>
              <van-cell  value="支付超时,不要再继续支付,请重新下单.如有疑问,请联系客服" />
          </div>
      </div>
  </div>
</template>

<script>
//import CountDown from 'vue2-countdown'
export default {
    props: ['id'],
    data(){
       return{
        time:0,
        order_info:{pay_good_info:{}},
        pay_good:false,
        pay_text:'支付状态',
        /***
         * pay_bad_status状态
         * 0-付款成功--而且有卡密
         * 1-支付宝可以继续支付 
         * 2-支付宝连接过时 
         * 3-没有支付宝连接,要新建 --mobile端不要用
         * 4-支付成功--但无卡密
         * 5-乐付未成功
         * 
         * ***/
        pay_bad_status:0,
        pay_bad_end_time:0,//支付连接过期时间 倒计时结束时间
       }
     },
     async created(){
         await this.fetch()
            if(this.order_info.pay_type==='lepay'){
                this.pay_yes_no_lepay()
            }
         },
     methods:{
         async fetch(){
              const d = await this.$http.post('/web/order/api/get_order_info',{id:this.id})
              if(d.data.code ===1 ){
                    this.order_info = d.data.data
                    if(this.order_info.status===2||this.order_info.status===3){
                        this.pay_good = true
                        this.pay_text = '支付成功'
                        this.pay_bad_status = 0
                    }else if(this.order_info.status===1){
                        this.pay_good = false
                        this.pay_text = '支付未成功'
                        if(this.order_info.pay_type === 'alipay_mobile'){
                            if(this.order_info.pay_link){//是否有支付连接
                                this.pay_bad_end_time = parseInt(this.order_info.pay_bad_end_time/1000);
                                if(Date.now()>this.order_info.pay_bad_end_time){ //判断支持连接是否过时
                                this.time = this.order_info.pay_bad_end_time - Date.now() 
                                        this.pay_bad_status = 2
                                        this.pay_text = '支付失败'
                            }else{
                                this.time = this.order_info.pay_bad_end_time - Date.now() 
                                this.pay_bad_status = 1
                            }
                            }else{
                                this.pay_bad_status = 3
                            }
                        }else if(this.order_info.pay_type==='lepay'){
                            this.pay_bad_status = 5
                        }

                    }else if(this.order_info.status === 4){
                        this.pay_good === true
                        this.pay_text = '支付成功'
                        this.pay_bad_status = 4
                    }
              }
         },
        copy_kami(){
                this.$copyText(this.order_info.kami).then(()=>{
                    this.$notify({type:'success',message:'复制成功'})
                },e=>{
                    this.$notify({type:'error',message:'复制失败'})
                    console.log(e)
                })
         },
        pay_continue(){
             if(this.order_info.pay_link){
                 window.open(this.order_info.pay_link)
             }
         },
        async pay_yes_no(){
             if(this.order_info.status===1){
                 const d = await this.$http.post('/pay/api/check_pay_status',this.order_info)
                 if(d.data.code===1){
                    const info = d.data.data
                    if(info.code==='10000'&&info.msg==='Success'){
                        if(info.tradeStatus==="TRADE_SUCCESS"){
                             this.$notify({type:"success",message:'订单已支付'})
                        }else if(info.tradeStatus==='WAIT_BUYER_PAY'){
                            this.$notify({type:"warning",message:'等待付款...'})
                        }else if(info.tradeStatus==='TRADE_CLOSED'){
                                this.$notify({type:"warning",message:'交易关闭'}) 
                        }
                    }else{
                        if(info.subCode==='ACQ.TRADE_NOT_EXIST'){
                            this.$notify({type:"warning",message:'支付交易未建立: 请在弹出窗口中支付'})
                            return;
                        }
                        if(info.subMsg){
                            this.$notify({type:"warning",message:info.subMsg})  
                        }
                    }
                 }

                 this.fetch()
             }else{
                 this.$notify({type:"warning",message:'订单已支付'})
                  this.fetch()
             }
         },
         //乐付订单查询状态
        async pay_yes_no_lepay(){
            if(this.order_info.status ===1){
                const d = await this.$http.post('/lepay/api/query_status',this.order_info)
                console.log(d.data)
                if(d.data.status===1){
                     if(d.data.data.trade_status==='SUCCESS'){
                         this.$notify({type:"success",message:'支付成功'})
                     }else if(d.data.data.trade_status==='NOTPAY'){
                         this.$notify({type:"danger",message:'未支付成功'})
                     }else{
                         this.$notify({type:"danger",message:d.data.data.trade_status})
                     }

                }else{
                    this.$notify({type:"warning",message:d.data.msg})
                }
                this.fetch()
            }else{
                 this.$toast('已支付过了');
            }
        },
        pay_continue_lepay(){}
     }
}
</script>

<style>
.order_pay_good_1,.order_pay_good_2,.order_pay_good_3{
    margin:10px;
}
.order_pay_good_1 .van-cell-group .van-cell .van-cell__title{
    flex-grow:1;
}
.order_pay_good_1 .van-cell-group .van-cell .van-cell__value{
    flex-grow:2;
}
.order_pay_good_text{
    color: aliceblue;
    font-weight: bold;
    font-size: 30px;
}
.order_pay_good{
    margin-bottom: 30px;
}
</style>