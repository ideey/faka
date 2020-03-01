<template>
  <div><h1>订单查询</h1>
  <div class="order_list">
      <el-tabs v-model="activeName" >
        <el-tab-pane label="联系方式" name="pass">
            <div>
                <el-form :inline="true" :model="passform" >
                        <el-form-item label="联系方式">
                            <el-input v-model="passform.qq_email" placeholder="qq/邮箱/手机号"></el-input>
                        </el-form-item>
                        <el-form-item label="查询密码">
                            <el-input v-model="passform.password" placeholder="查询密码"></el-input>
                        </el-form-item>

                        <el-form-item>
                            <el-button type="primary" @click="passQuery">查询</el-button>
                        </el-form-item>
                        </el-form>
            </div>
        </el-tab-pane>
        <el-tab-pane label="浏览器缓存" name="brower">
            <div><el-link>从浏览器缓存中查找订单信息</el-link><br><br>
                <el-button type="primary" @click="browerQuery" >查询</el-button>
             </div>
        </el-tab-pane>
        <el-tab-pane label="订单号查询" name="order_no">
            <div class="mid_mid">
                 <el-alert
                    title="只有此时的IP与下单时相同,才会返回订单信息"
                    type="warning"
                    effect="dark"
                    :closable="false"
                    show-icon
                    style="width:70%">
                </el-alert>
                <el-form :inline="true" :model="order_no_form" style="margin-top:20px;">
                <el-form-item label="订单编号">
                    <el-input v-model="order_no_form.order_no" placeholder="订单编号"></el-input>
                </el-form-item>


                <el-form-item>
                    <el-button type="primary" @click="orderNoQuery">查询</el-button>
                </el-form-item>
                </el-form>
            </div>
        </el-tab-pane>
        </el-tabs>
        <div class="order_list_info" v-if="order_list.length>0">
            <el-table
            :data="order_list"
            style="width: 100%"
           >
            <el-table-column
              prop="_id"
              label="订单编号"
              width="220">
            </el-table-column>
            <el-table-column
              prop="goods_name"
              label="商品名称"
              width="150">
            </el-table-column>
            <el-table-column
              prop="kami"
              label="卡密"
              width="220">
            </el-table-column>
            <el-table-column
              prop="status"
              label="支付状态"
              width="80">
              <template slot-scope="scope">
                  <el-tag v-if="scope.row.status===1" type="danger">未支付</el-tag>
                  <el-tag v-if="scope.row.status===2" type="success">已付款</el-tag>
                  <el-tag v-if="scope.row.status===3" type="success">手动确认支付</el-tag>
                  <el-tag v-if="scope.row.status===4" type="success">支付成功-无卡密</el-tag>
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              width="150">
              <template slot-scope="scope">
                <el-button @click="copykami(scope.row)" type="text" size="mini">复制卡密</el-button>
                <el-button @click="go_order_detail(scope.row)" type="text" size="mini">订单详情</el-button>
                <!-- <el-button  type="text" size="mini">确认支付</el-button> -->
              </template>
            </el-table-column>
            </el-table>
        </div>
  </div>
  </div>
</template>

<script>
import moment from 'moment'
export default {
    data(){
        return{
            activeName:'pass',
            passform:{},
            order_no_form:{order_no:''},
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
        async passQuery(){
            //console.log(this.passform)
            if(!this.passform.qq_email){
                 this.$message({type:'error',message:'请输入 联系方式'})
                 return;
            }
            if(!this.passform.password){
                 this.$message({type:'error',message:'请输入下单时的 查询密码'})
                 return;
            }
            const d = await this.$http.post('/web/order/api/query_pass',this.passform)
            this.order_list = d.data.data
            window.IDEEY = {}
            window.IDEEY.order_list = this.order_list
        },
        async orderNoQuery(){
            console.log(this.order_no_form)
            if(this.order_no_form.order_no.match(/^[a-z0-9]{24}$/)){
                const d = await this.$http.post('/web/order/api/query_orderNo',this.order_no_form)
                this.order_list = d.data.data
                window.IDEEY = {}
                window.IDEEY.order_list = this.order_list
            }else{
                this.$message({type:'error',message:'订单编号格式不正确'})
            }
        },
        browerQuery(){
             this.$message({type:'info',message:'功能未开放'})
        },
        formatter_creat_time(row){
            return moment(row.createdAt).format('YYYY-MM-DD HH:mm:ss')
        },
        copykami(row){
            if(row.kami){
                this.$copyText(row.kami).then(()=>{
                    this.$message({type:'success',message:'复制成功'})
                },()=>{
                    this.$message({type:'error',message:'复制失败'})
                    
                })
            }else{
                this.$message({type:'error',message:'订单无卡密信息'})
            }
        },
        go_order_detail(row){
            this.$router.push('/order_pay_good/'+row._id)
        }
    }
}
</script>

<style>
.order_list{
  width: 900px;
  min-height: 400px;
  padding:20px 10px 10px 20px;
  border-radius: 20px;
  box-shadow: 3px 3px 10px 1px rgba(0,0,0,0.1),-3px -3px 10px 1px rgba(0,0,0,0.1);
}
.order_list_info{
    margin-top:10px;
    min-height: 60px;
    width: 850px;
    border-radius: 10px;
    box-shadow: 2px 1px 5px 1px rgba(0,0,0,0.1),-1px -2px 10px 1px rgba(0,0,0,0.1);
}
</style>