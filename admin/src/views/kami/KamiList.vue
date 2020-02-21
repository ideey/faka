<template>
  <div>
      <div class="kami_list_1">
        <el-select v-model="form.type_id" placeholder="选择分类" size="mini" @change="type_change" clearable>
                <el-option
                v-for="item in types"
                :key="item._id"
                :label="item.name"
                :value="item._id"
                >
                </el-option>
            </el-select>
            <el-select v-model="form.goods_id" placeholder="选择商品" size="mini" clearable @change="goods_change">
                <el-option
                v-for="item in goods"
                :key="item._id"
                :label="item.name"
                :value="item._id">
                </el-option>
            </el-select>
            <el-select v-model="form.kami_status" placeholder="卡密状态" size="mini" clearable @change="status_change">
                <el-option  label="全部" value=0>  </el-option>
                <el-option  label="待出售" value=1>  </el-option>
                <el-option  label="锁定" value=2>  </el-option>
                <el-option  label="已出售" value=3>  </el-option>
            </el-select>
            <el-button @click="query()" size="mini" type="primary">查询</el-button>
      </div>
      <el-table
      :data="kami_list"
      height="700px"
      >
    <el-table-column
      type="index"
      label="序号"
      width="50">
    </el-table-column>
    <el-table-column
        prop="type_info[0].name"
        label="商品分类"
        sortable
        width="120">
</el-table-column>
    <el-table-column
        prop="goods_info[0].name"
        label="商品名称"
       sortable
        width="200">
</el-table-column>
<el-table-column
        prop="goods_info[0].price"
        label="价格"
        sortable
        width="100">
</el-table-column>
<el-table-column
        prop="kami"
        label="卡密信息"
        show-overflow-tooltip
        width="240">
</el-table-column>
<el-table-column
        prop="goods_info[0].kamiType"
        label="卡密类型"
        width="100">
        <template slot-scope="scope">
            <el-tag v-if="scope.row.goods_id.kamiType===1" type="success" size="mini">默认卡</el-tag>
            <el-tag v-if="scope.row.goods_id.kamiType===2" type="warning" size="mini">循环卡</el-tag>
            <el-tag v-if="scope.row.goods_id.kamiType===3" type="danger" size="mini">重复卡</el-tag>
            <el-tag v-if="scope.row.goods_id.kamiType===undefined" type="danger" size="mini">默认卡</el-tag>
        </template>
</el-table-column>
<el-table-column
        prop="status"
        label="卡密状态"
        width="100">
        <template slot-scope="scope">
            <el-tag v-if="scope.row.status===1"  size="mini">待出售</el-tag>
            <el-tag v-if="scope.row.status===2" type="warning" size="mini">锁定</el-tag>
            <el-tag v-if="scope.row.status===3" type="success" size="mini">已出售</el-tag>
        </template>
</el-table-column>
<el-table-column
        prop="active"
        label="可售状态"
        width="100">
        <template slot-scope="scope">
            <el-tag v-if="scope.row.active===1"  size="mini">可出售</el-tag>
            <el-tag v-if="scope.row.active===2" type="warning" size="mini">不可售</el-tag>
        </template>
</el-table-column>
<el-table-column
        label="操作"
        width="100">
        <template slot-scope="scope">
             <el-button @click="handleDel(scope.row)" type="text" size="small">删除</el-button>
             <!-- <el-button @click="handleSell(scope.row)" type="text" size="small">可售状态切换</el-button> -->
             
        </template>
</el-table-column>
</el-table>
  <div class="block">
    <el-pagination
      @current-change="handleCurrentChange"
      :current-page.sync="form.page"
      :page-size="50"
      layout="total, prev, pager, next"
      :total="count">
    </el-pagination>
  </div>
  </div>
</template>

<script>
export default {
      name:'KamiList',
      //props:['hot4_list'],
      data:function(){
          return{
              kami_list:[],
              form:{type:'',goods_id:'',kami_status:'',page:1},
              types:[],
              goods:[],
              count:0
          }
      },
      created(){
          this.fetch()
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
          handleCurrentChange(page){
              this.fetch(page)
          },
          async handleDel(row){
              const d = await this.$http.post('/goods/api/del_kami',row)
              if(d.data.code===1){
                  this.$message({type:"success",message:"删除卡密成功"})
              }
              this.fetch()
          },
          async handleNoSell(){},
          async type_change(type){
             if(!type){
                 this.form.goods_id=''
                 this.goods = []
                 //this.form.kami_status=''
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
                this.form.kami_status = ''
            }else{
                    this.form.goods_id = ''
                    this.form.kami_status = ''
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
        async query(){
/*            if(!this.form.type_id ){
               this.$message({type:"error",message:"请选择分类"})
               return;
           }
           if(!this.form.goods_id){
               this.$message({type:"error",message:"请选择商品"})
               return;
           }
           if(!this.form.kami_status){
               this.$message({type:"error",message:"请选择卡密状态"})
               return;
           } */
           const d = await this.$http.post('/goods/api/get_kami_list',this.form)
           if(d.data.code === 1){
               this.count = d.data.count
               this.kami_list = d.data.data
           }
        }
      }
}
</script>

<style>
.kami_list_1{
    display: grid;
    grid-template-columns: 200px 200px 200px 120px 150px;
    grid-column-gap: 20px;

}
</style>