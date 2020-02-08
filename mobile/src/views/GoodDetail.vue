<template>
  <div>
      <div><van-image
        width="300"
        height="300"
        radius="5px"
        :src="goods.goods_img"
        /></div>
        <div class="goods_detail_info">
        <van-cell-group>
        <van-cell center title="单价" >
              <template slot="default">
                <van-tag type="danger">{{goods.price}}元</van-tag>
            </template>
        </van-cell>
        <van-cell center  :value="goods.name" />
        <van-cell center  :value="goods.description" label="描述信息" />
        </van-cell-group>
        </div>
        <div class="goods_detail_info">
            <van-cell-group>
            <van-cell center title="购买数量" >
              <template slot="default">
                <van-stepper v-model="order.num" min="1" max="1" />
            </template>
            </van-cell>

            <van-field v-model="order.qq_email" placeholder="请输入联系方式" />
            <van-field v-model="order.password" placeholder="请输入查询密码" />
            </van-cell-group>
            <div class="goods_detail_bu"><van-button type="primary" size="large" @click="get_order">提交订单</van-button></div>
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

            }
        }
    },
    created(){this.fetch()},
    methods:{
        async fetch(){
            const d = await this.$http.post('/web/goods/api/get_goods',{id:this.id})
            if(d.data.code === 1){
                if(d.data.data.goods_img){
                    d.data.data.goods_img = process.env.VUE_APP_API_URL+d.data.data.goods_img
                }else{
                    d.data.data.goods_img = process.env.VUE_APP_API_URL+'/uploads/default'
                }
                this.goods = d.data.data
            }
        },
        async get_order(){
            if(!this.order.qq_email){
                 this.$toast.fail('请输入联系方式')
                 return;
            }
            if(!this.order.password){
                this.$toast.fail('请输入查询密码')
                return;
            }
            const d = await this.$http.post('/web/order/api/create_order',{goods:this.goods,order:this.order})
            if(d.data.code ===1){
                this.$router.push('/order_pay/'+d.data.data._id)
            }
        }
    }
}
</script>

<style>
.goods_detail_info{
    margin:10px;
    border-radius: 20px;
}
.goods_detail_bu{
    margin-top: 10px;
}
</style>