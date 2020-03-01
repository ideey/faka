<template>
  <div>
      <el-card>
      <h3>支付开关</h3>
    <div class="set_pay_list">
        <span>企业支付宝</span>
        <span>
            <el-switch
                v-model="alipay"
                active-color="#13ce66"
                inactive-color="#ff4949">
                </el-switch>
        </span>
        <span>企业支付宝,支付PC端与移动端</span>
        <span>乐付</span>
        <span>
            <el-switch
                v-model="lepay"
                active-color="#13ce66"
                inactive-color="#ff4949">
                </el-switch>
        </span>
        <span>乐付支付,在微信中能调起微信付款，门店号要找乐付申请</span>
        
    </div>
    </el-card>
  </div>
</template>

<script>
export default {
    name:'PayList',
    data(){
        return{
            alipay:true,
            lepay:false
        }
    },
    created(){

    },
    methods:{
        
    }
}
</script>

<style>
.set_pay_list{
    display: grid;
    grid-template-columns: 200px 150px 300px;
    grid-template-rows: 60px;
    grid-auto-rows: 60px;
    place-items: center center;
    font-size: 14px;
}
.set_pay_list span{
    height: 100%;
    width: 100%;
    border: 1px solid rgba(11, 207, 37, 0.26);
    margin-left: -1px;
    margin-top: -1px;
    place-self: center center;

}
</style>