<template>
  <div><h1>{{pay_text}}</h1>
  <div class="kami_info_main">
    <div class="order_pay_good">
        <div class="order_pay_good_h b1">订单编号</div>
        <div class="order_pay_good_i b1">{{order_info._id}}</div>
        <div class="order_pay_good_h b2">商品名称</div>
        <div class="order_pay_good_i b2">{{order_info.goods_name}}</div>
        <div class="order_pay_good_h b1">购买数量</div>
        <div class="order_pay_good_i b1">{{order_info.num}}</div>
        <div class="order_pay_good_h b2">商品价格</div>
        <div class="order_pay_good_i b2">{{order_info.price}}</div>
        <div class="order_pay_good_h b1">订单金额</div>
        <div class="order_pay_good_i b1">{{order_info.money}}</div>
        <div class="order_pay_good_h b2">订单状态</div>
        <div class="order_pay_good_i b2">
                    <el-tag v-if="order_info.status===1" type="warning" size="mini">未支付</el-tag>
                    <el-tag v-if="order_info.status===2" type="success" size="mini">已付款</el-tag>
                    <el-tag v-if="order_info.status===3" type="success" size="mini">已付款-后台确认</el-tag>
                    <el-tag v-if="order_info.status===4" type="danger" size="mini">已付款-无卡密-请联系客服</el-tag>
        </div>
        <div class="order_pay_good_h b1">支付时间</div>
        <div class="order_pay_good_i b1">{{order_info.pay_time}}</div>
        <div class="order_pay_good_h b2">购买者IP</div>
        <div class="order_pay_good_i b2">{{order_info.ip}}</div>
        <div class="order_pay_good_h b1">联系方式</div>
        <div class="order_pay_good_i b1">{{order_info.qq_email}}</div>
    </div>
    <div class="kami_info"  v-if="pay_good===true">
        <div v-if="pay_bad_status===0">
                    <div><h3>卡密信息</h3></div>
        <div style="padding:0 15px 0 15px;"><el-input v-model="order_info.kami" :disabled="true" size="large"></el-input> </div>
        <div style="margin-top:15px;"> <el-button type="primary" @click="copy_kami">点击复制卡密</el-button> </div>
        <div style="margin-top:15px;font-size:12.8px;">使用说明<br>{{order_info.goods_id.Instructions?order_info.goods_id.Instructions:''}}
        </div>
        </div>
        <div v-if="pay_bad_status===4">
                    <div style="padding:0 15px 0 15px;">
                        支付成功,但卡密无库存,请联系客服微信:12345
                    </div>
        </div>
    </div>
        <div class="kami_info" v-else-if="pay_good===false">
            <div class="pay_bad">
                <div class="pay_bad_go" v-if="pay_bad_status===1">
                    <h3>支付链接有效期倒计时:</h3>
                    <div class="time_down">
                     <count-down 
                     v-on:start_callback="countDownS_cb(1)" 
                     v-on:end_callback="countDownE_cb(1)" 
                    :current-time="now_S" 
                    :start-time="start_S" 
                    :end-time="pay_bad_end_time"
                     :tipText="'距离开始文字1'" 
                     :tipTextEnd="'距离结束文字1'" 
                     :endText="'结束自定义文字2'" 
                     :dayTxt="'天'" 
                     :hourTxt="'小时'" 
                     :minutesTxt="'分钟'" 
                     :secondsTxt="'秒'"></count-down></div>
                     <div>
                         <el-button type="primary" @click="pay_continue" >继续支付</el-button>
                         <el-button type="info" @click="pay_yes_no" plain>检测支付状态</el-button>
                         <el-button type="warning" @click="fetch()" plain>刷新订单状态</el-button>
                     </div>
                </div>
                <div class="pay_bad_not" v-else-if="pay_bad_status===2">
                    <i class="el-icon-error" style="font-size:70px;color:red"></i>
                    <div>支付链接已经超时,不要再支付</div>
                    <div>如需卡密,请重新下单</div>
                </div>
                <div class="pay_bad_new" v-else-if="pay_bad_status===3">
                     <i class="el-icon-info" style="font-size:70px;color:green"></i>
                     <div style="margin-top:30px">您的订单还没有支付,点下面按钮开始支付</div>
                     <div style="margin-top:30px"><el-button type="primary" @click="new_pay">开始支付</el-button> </div>
                </div>
            </div>
        </div>
    </div>

  </div>
</template>

<script>
//import FlipCountdown from 'vue2-flip-countdown'
import CountDown from 'vue2-countdown'
//import moment from 'moment'
export default {
     props: ['id'],
     components: { //FlipCountdown
        CountDown
      },
     data(){
         return{
             order_info:{pay_good_info:{}},
             pay_good:false,
             pay_text:'支付状态',
             pay_bad_status:0,//1-可以继续支付 2-支付连接过时 3-没有支付连接,要新建 4-已付款-无卡密-请联系客服
             pay_bad_end_time:0,//支付连接过期时间 倒计时结束时间
             now_S:parseInt((new Date()).getTime()/1000), //现在时间
             start_S:parseInt((new Date()).getTime()/1000)+1, //倒计时开始时间
         }
     },
     created(){this.fetch()},
     methods:{
         async fetch(){
             const d = await this.$http.post('/web/order/api/get_order_info',{id:this.id})
             this.order_info = d.data.data
             if(this.order_info.status===2||this.order_info.status===3){
                 this.pay_good = true
                 this.pay_text = '支付成功'
                 this.pay_bad_status = 0
             }else if(this.order_info.status === 1){
                  this.pay_good = false
                  this.pay_text = '支付未成功...'
                  if(this.order_info.pay_link){//是否有支付连接
                    this.pay_bad_end_time = parseInt(this.order_info.pay_bad_end_time/1000);
                      if(Date.now()>this.order_info.pay_bad_end_time){ //判断支持连接是否过时
                            this.pay_bad_status = 2
                            this.pay_text = '支付失败'
                      }else{
                         
                          this.pay_bad_status = 1
                      }
                  }else{
                      this.pay_bad_status = 3
                  }
             }else if(this.order_info.status===4){
                        this.pay_good === true
                        this.pay_text = '支付成功'
                        this.pay_bad_status = 4
             }
         },
         copy_kami(){
                this.$copyText(this.order_info.kami).then(()=>{
                    this.$message({type:'success',message:'复制成功'})
                },e=>{
                    this.$message({type:'error',message:'复制失败'})
                    console.log(e)
                })
         },
         countDownS_cb(){
             console.log('开始')
         },
         countDownE_cb(){
             console.log('结束')
             this.fetch()
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
                             this.$message({type:"success",message:'订单已支付'})
                             this.fetch()
                        }else if(info.tradeStatus==='WAIT_BUYER_PAY'){
                            this.$message({type:"warning",message:'等待付款...'})
                             
                        }else if(info.tradeStatus==='TRADE_CLOSED'){
                                this.$message({type:"error",message:'交易关闭'})
                             
                        }
                    }else{
                        if(info.subCode==='ACQ.TRADE_NOT_EXIST'){
                            this.$message({type:"error",message:'支付交易未建立:  请扫描二维码付款'})
                            return;
                        }
                        if(info.subMsg){
                            this.$message({type:"error",message:info.subMsg})
                           
                        }
                    }
                 }

                 this.fetch()
             }else{
                 this.$message({type:"error",message:'订单已支付'})
                  this.fetch()
             }
         },
         async new_pay(){
                const d = await this.$http.post('/pay/api/get_alipay_web_link',this.order_info)
                if(d.data.code===1){
                    window.open(d.data.data)
                    this.$confirm('请在新打开的窗口中,完成支付', '提示', {
                        confirmButtonText: '支付完成',
                        cancelButtonText: '支付出问题',
                        type: 'warning'
                    }).then(() => {
                        location.reload()
                    //this.$router.push('/order_pay_good/'+this.order_info._id)
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '支付失败'
                        });
                        location.reload()
                        //this.$router.push('/order_pay_good/'+this.order_info._id)          
                    });
            
                }
         }

     }
}
</script>

<style>
.kami_info_main{
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-column-gap: 20px;
}
.order_pay_good{
    padding:20px 10px 0 10px;
    width: 500px;
    height: 400px;
    border-radius: 20px;
    box-shadow: 3px 3px 10px 1px rgba(0,0,0,0.3),-3px -3px 10px 1px rgba(0,0,0,0.3);
    display: grid;
    grid-template-columns: 30% 70%;
    grid-template-rows: repeat(9,40px);
    place-items: center center;
}

.order_pay_good_h{
    width: 100%;
    height: 100%;
    display: grid;
  justify-items: center;
  align-items: center;
   
}
.order_pay_good_i{
    width:100%;
    height: 100%;
    display: grid;
  justify-items: start;
  align-items: center;
    
}
.b1{
     background-color: rgba(159, 196, 183, 0.2);
}
.b2{
    background-color: rgba(137, 43, 226, 0.2);
}
.kami_info{
    padding:10px 10px 0 10px;
    width: 500px;
    min-height: 400px;
    border-radius: 20px;
    box-shadow: 3px 3px 10px 1px rgba(223, 111, 7, 0.3),-3px -3px 10px 1px rgba(218, 128, 12, 0.3);

}
.kami_info:hover{
    box-shadow: 3px 3px 10px 1px rgba(223, 111, 7, 0.4),-3px -3px 10px 1px rgba(218, 128, 12, 0.4);
}
.time_down{
    font-size:20px;
    font-weight: bold;
    color:blueviolet;
    font-style: normal;
}
.time_down i{
    font-style: normal;
    color: black;
    font-weight: normal;
}

</style>