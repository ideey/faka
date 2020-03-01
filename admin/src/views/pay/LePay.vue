<template>
  <div class="set_pay_lepay"><h1>乐付设置：</h1>
  <el-card>
      <h4>门店ID</h4>
      <el-input v-model="pay_info.Store_Id" placeholder=""></el-input> <br>
      <el-button type="primary" style="margin-top:20px;" @click="save">提交</el-button>
    </el-card>
  </div>
</template>

<script>
export default {
    name:'LePay',
    data:function(){
        return{
            pay_type:'lepay',
            pay_info:{Store_Id:''}
        }
    },
    created(){
        this.fetch()
    },
    methods:{
        async fetch(){
            const d = await this.$http.post('/pay/api/get_pay',{pay_type:'lepay'})
            //console.log(d.data)
            this.pay_info = d.data.data.pay_info
        },
        async save(){
            //console.log(this.pay_type,this.pay_info)
            const d = await this.$http.post('/pay/api/set_pay',{pay_type:this.pay_type,pay_info:this.pay_info})
            if(d.data.code === 1){
                this.$message({type:'success',message:'支付方式增加成功'})
                this.fetch()
            }
        }
    }
}
</script>

<style>
.set_pay_lepay{
    width: 80%;
    padding: 30px;
}
</style>