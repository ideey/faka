<template>
  <div>
  <div>
        <el-tabs v-model="activeName" >
        <el-tab-pane label="订单列表" name="list">
          <div class="order_list_a1">
                <el-select v-model="form.type_id" placeholder="选择分类" size="mini" @change="type_change" clearable>
                <el-option
                v-for="item in types"
                :key="item._id"
                :label="item.name"
                :value="item._id"
                >
                </el-option>
            </el-select>
            <el-select v-model="form.goods_id" placeholder="选择商品" size="mini" clearable>
                <el-option
                v-for="item in goods"
                :key="item._id"
                :label="item.name"
                :value="item._id">
                </el-option>
            </el-select>
            <el-select v-model="form.order_status" placeholder="订单状态" size="mini" clearable>
                <el-option  label="全部" value=0>  </el-option>
                <el-option  label="待支付" value=1>  </el-option>
                <el-option  label="已支付" value=2>  </el-option>
                <el-option  label="手动确认支付" value=3>  </el-option>
                <el-option  label="支付成功-无卡密" value=4>  </el-option>
            </el-select>
            <el-button @click="query()" size="mini" type="primary">查询</el-button>
            
          </div>
            <el-table
            :data="order_list"
            style="width: 100%"
            max-height="700px"
           >
               <el-table-column
                type="index"
                label="序号"
                width="50">
              </el-table-column>
            <el-table-column
              prop="createdAt"
              label="下单时间"
              sortable
              :formatter="formatter_creat_time"
              width="150">
            </el-table-column>
            <el-table-column
              prop="_id"
              label="订单编号"
              width="200">
            </el-table-column>
            <el-table-column
              prop="goods_name"
              label="商品名称"
              sortable
              show-overflow-tooltip
              width="180">
            </el-table-column>
            <el-table-column
              prop="num"
              label="数量"
              width="60">
            </el-table-column>
            <el-table-column
              prop="price"
              label="单价"
              width="60">
            </el-table-column>
            <el-table-column
              prop="money"
              label="金额"
              width="70">
            </el-table-column>
            <el-table-column
              prop="qq_email"
              label="联系方式"
              sortable
              show-overflow-tooltip
              width="150">
            </el-table-column>
            <el-table-column
              prop="password"
              label="查询密码"
              show-overflow-tooltip
              width="100">
            </el-table-column>
            <el-table-column
              prop="kami"
              label="卡密"
              width="180"
              show-overflow-tooltip>
            </el-table-column>
            <el-table-column
              prop="status"
              label="订单状态"
              width="100">
                  <template slot-scope="scope">
                    <el-tag v-if="scope.row.status===1" type="warning" size="mini">未支付</el-tag>
                    <el-tag v-if="scope.row.status===2" type="success" size="mini">已付款</el-tag>
                    <el-tag v-if="scope.row.status===3" type="danger" size="mini">手动确认付款</el-tag>
                    <el-tag v-if="scope.row.status===4" type="info" size="mini">付款无卡</el-tag>
                  </template>
            </el-table-column>
              <el-table-column
              label="操作"
              width="150">
              <template slot-scope="scope">
                <el-button @click="copykami(scope.row)" type="text" size="mini">复制卡密</el-button>
                <el-button @click="handleEdit(scope.row)" type="text" size="mini">手动确认支付</el-button>
              </template>
            </el-table-column>

    </el-table>

        </el-tab-pane>
       <!--  <el-tab-pane label="订单管理" name="cp">订单管理</el-tab-pane> -->
        </el-tabs>
        
  </div>
          <div class="block1">
          <el-pagination
            @current-change="handleCurrentChange"
            :current-page.sync="form.page"
            :page-size="50"
            layout="total, prev, pager, next"
            :total="count">
          </el-pagination>
        </div>
      <el-dialog title="手动确认支付" :visible.sync="show_edit">
          <el-alert
    title="务必确认收款后,才执行手动确认"
    type="error">
  </el-alert>
      <el-form :model="edit_order" size="small">
        <el-form-item label="订单编号" label-width="120px">
          <el-input v-model="edit_order._id" autocomplete="off" :disabled="true" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="商品名称" label-width="120px">
          <el-input v-model="edit_order.goods_name" autocomplete="off" :disabled="true" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="订单金额" label-width="120px">
          <el-input v-model="edit_order.money" autocomplete="off" :disabled="true" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="订单数量" label-width="120px">
          <el-input v-model="edit_order.num" autocomplete="off" :disabled="true" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="联系方式" label-width="120px">
          <el-input v-model="edit_order.qq_email" autocomplete="off" :disabled="true" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="支付状态" label-width="120px">
             <el-radio-group v-model="edit_order.status"  >
              <el-radio label="1" border>未支付</el-radio>
              <el-radio label="2" border disabled >已付款</el-radio>
              <el-radio label="3" border>手动确认</el-radio>
            </el-radio-group>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="show_edit = false">取 消</el-button>
        <el-button type="primary" @click="pay_yes">确认已支付</el-button>
      </div>
    </el-dialog>
  </div>
  
</template>

<script>
import moment from 'moment'
export default {
  data(){
    return{
      activeName:'list',
      order_list:[],
      edit_order:{},//操作订单
      show_edit:false,
      form:{type:'',goods_id:'',order_status:'',page:1},
      types:[],
      goods:[],
      count:0
      
    }
  },
  created(){
    this.fetch(),
    this.get_types()
  },
  methods:{
    async  fetch(page){
            if(page){
                page =Number(page)
            }else{
                page = 1
            }
            this.form.page = page
            this.query()
          },
    async query(){
      const d = await this.$http.post('/order/api/get_all_order',this.form)
      if(d.data.code ===1){
        this.count = d.data.count
        this.order_list = d.data.data
      }
    },
    handleEdit(row){
      if(row.status === 2 || row.status ===3 ){
        this.$message({type:'error',message:'订单已支付'})
      }else{
      this.edit_order = {...row}
      this.edit_order.status = '1'
      this.show_edit = true
      }

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
    async pay_yes(){
      //console.log(this.edit_order)
      if(this.edit_order.status === '1'){
        this.$message({type:'error',message:'请选择手动付款按钮'})
      }else{
        const d = await this.$http.post('/order/api/pay_yes',this.edit_order)
        this.show_edit = false
        //console.log(d.data)
        this.fetch()
      }
    },
    formatter_creat_time(row){
      return moment(row.createdAt).format('YYYY-MM-DD HH:mm:ss')
    },
    async get_types(){
          //获取分类
          const d =  await this.$http.post('/goods/api/get_types')
         
          let a = d.data.data.filter(el=>{
            return el.active === 1
            })
            a.sort((e1,e2)=>{
            return e1.sort - e2.sort
            })
            this.types = a
        },
    async type_change(type){
             if(!type){
                 this.form.goods_id=''
                 this.goods = []
                 //this.form.order_status=''
                 return
             }
            const d = await this.$http.post('/goods/api/get_goods',{type_id:type})
            if(d.data.data.length > 0){
            let a = d.data.data.filter(el=>{
                return el.active === 1
                })
                a.sort((e1,e2)=>{
                return e1.sort - e2.sort
                })
                this.goods = a
                this.form.goods_id = ''
                this.form.order_status = ''
            }else{
                    this.form.goods_id = ''
                    this.form.order_status = ''
                    this.goods = []
                    this.$confirm('此分类下还没有商品', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                    }).then(() => {
                        this.$router.push('/set_goods')
                    }).catch(() => {
                        
                    });
                }  
          },
    goods_change(){
            this.form.page =1
        },
    status_change(){
            this.form.page =1
        },
    handleCurrentChange(page){
      this.fetch(page)
    },
  }
}
</script>

<style>
.order_list_a1{
  display: grid;
  grid-template-columns: 200px 200px 200px 100px;
  grid-column-gap: 20px;
}
</style>