<template>
  <div><h1>支付设置</h1>

    <div>
    <el-tabs v-model="activeName" >
        <el-tab-pane label="支付列表" name="list">
            <el-card>目前支持支付宝电脑端扫码,更多支付方式对接中...</el-card>
        </el-tab-pane>
        <el-tab-pane label="添加支付方式" name="add">
                <div class="set_pay_1">
                <el-form ref="form" :model="pay_info" label-width="150px" >
                    <el-form-item label="支付接口">
                        <el-input v-model="pay_info.name" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="APPID">
                        <el-input v-model="pay_info.APPID"></el-input>
                    </el-form-item>
                    <el-form-item label="支付宝公钥">
                        <el-input v-model="pay_info.alipay_pub_key"   type="textarea"  placeholder="应用对应的支付宝公钥，不是自己生成的公钥。是在上传应用公钥后，支付宝生成的对应公钥。" :rows="3"></el-input>
                    </el-form-item>
                    <el-form-item label="应用私钥">
                        <el-input v-model="pay_info.alipay_private_key"   type="textarea" placeholder="自己生成的应用私钥"  :rows="4"></el-input>
                    </el-form-item>
                    <el-form-item >
                        <el-button type="primary" @click="onSmbit">提交</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-tab-pane>
    </el-tabs>
    </div>
  </div>
</template>

<script>
export default {
    data(){
        return{
            activeName: 'list',
            pay_info:{
                name:'支付宝电脑端支付',
            },
            pay_type:'alipay_web',
            test:0
        }
    },
    methods:{
        async onSmbit(){
            this.$message({type:'error',message:'测试系统,不支持增加支付方式'});
            if(this.test){

                const d = await this.$http.post('/pay/api/set_pay',{pay_type:this.pay_type,pay_info:this.pay_info})
                if(d.data.code === 1){
                    this.$message({type:'success',message:'支付方式增加成功'})
                }
            }
        },
    }
}
</script>

<style>
.set_pay_1{
    width: 80%;
}
</style>