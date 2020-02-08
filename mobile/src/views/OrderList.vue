<template>
  <div>
    <div >
          <van-row>
            <van-col span="4"></van-col>
            <van-col span="16"><div class="order_list_text">订单查询</div></van-col>
            <van-col span="4"></van-col>
        </van-row>
      </div>
      <div class="order_list_1">
          <van-tabs v-model="active">
            <van-tab name='pass'>
                <div slot="title">
                <van-icon name="phone-circle-o" size="22" /> 联系方式
                </div>
                <div class="order_list_q">
                    <van-cell-group>
                        <van-field v-model="passform.qq_email" placeholder="请输入联系方式" />
                        <van-field v-model="passform.password" placeholder="请输入查询密码" />
                        <van-button type="primary" block @click="query_pass">查询</van-button>
                    </van-cell-group>
                </div>
            </van-tab>
            <van-tab name='brower'>
                <div slot="title">
                <van-icon name="points" size="22" /> 浏览器缓存
                </div>
                <div class="order_list_q">浏览器缓存查询</div>
            </van-tab>
            <van-tab name='orderNo'>
                <div slot="title">
                <van-icon name="description" size="22"/> 订单号
                </div>
                <div class="order_list_q">订单号查询</div>
            </van-tab>
            </van-tabs>
      </div>
      <keep-alive>
      <div class="order_list_2">
        <div v-for="item in order_list" :key="item._id" class="order_list_item" >
          <van-card
            :num="item.num"
            :price="item.price"
            :desc="item.o"
            :title="item.goods_name"
            :thumb="item.goods_img"
            @click="go_goods(item)"
            >
              <div slot="tags">
                  <span v-if="item.pay_time">支付时间:{{item.pay_time}}</span><br>
                <van-tag  type="danger" v-if="item.status===1">未支付</van-tag>
                <van-tag  type="success" v-else-if="item.status===2">已支付</van-tag>
                <van-tag  type="warning" v-else-if="item.status===3">已支付-手动确认</van-tag>
                <van-tag  type="warning" v-else-if="item.status===4">已支付-无卡密</van-tag>
                
                
            </div>
            </van-card>
      </div>
      </div>
      </keep-alive>
  </div>
</template>

<script>
export default {
    data(){
        return{
            active:'pass',
            passform:{},
            order_list:[]
        }
    },
    created(){this.fetch()},
    methods:{
        fetch(){
            if(window.IDEEY&&window.IDEEY.order_list){
                this.order_list = window.IDEEY.order_list
            }
        },
        async query_pass(){
            if(!this.passform.qq_email){
                this.$toast.fail('请输入联系方式')
                return
            }
            if(!this.passform.password){
                this.$toast.fail('请输入查询密码')
                return
            }
            const d = await this.$http.post('/web/order/api/query_pass',this.passform)
            let a = d.data.data
            a.forEach(el => {
                if(el.goods_id&&el.goods_id.goods_img){  //这里要判断goods_id是字符串还是对象!!
                    el.goods_img = process.env.VUE_APP_API_URL+el.goods_id.goods_img
                }else{
                     el.goods_img = process.env.VUE_APP_API_URL+'/uploads/default'
                }
                el.o = '订单编号:'+el._id
            })
            this.order_list = a
            window.IDEEY = {}
            window.IDEEY.order_list = a
        },
        go_goods(item){
            this.$router.push('/order_pay_good/'+item._id)
        },
    }
}
</script>

<style>
.order_list_1{
    color: aliceblue;
    margin:0 10px;
}
.order_list_text{
    color:aliceblue;
    font-size: 26px;
    font-weight: bold;
    margin-bottom: 10px;
}
.order_list_2{
    margin:10px;
}
.order_list_item{
    margin:10px 0;
}
</style>