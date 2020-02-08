<template>
  <div>
      <div class="kami_list_1">
          <el-button @click="fetch()" size="mini">刷新列表</el-button>
          <el-alert  type="warning">点击 "删除" ,不管卡密是否出售,都会 直 接 删 除,请小心操作</el-alert>
          
      </div>
      <el-table
      :data="kami_list"
      height="450px"
      >
    <el-table-column
        prop="type_id.name"
        label="商品分类"
        sortable
        width="100">
</el-table-column>
    <el-table-column
        prop="goods_id.name"
        label="商品名称"
       sortable
        width="160">
</el-table-column>
<el-table-column
        prop="goods_id.price"
        label="价格"
        sortable
        width="100">
</el-table-column>
<el-table-column
        prop="kami"
        label="卡密信息"
        show-overflow-tooltip
        width="180">
</el-table-column>
<el-table-column
        prop="goods_id.kamiType"
        label="卡密类型"
        width="100">
        <template slot-scope="scope">
            <el-tag v-if="scope.row.goods_id.kamiType===1" type="success" size="mini">默认卡</el-tag>
            <el-tag v-if="scope.row.goods_id.kamiType===2" type="warning" size="mini">循环卡</el-tag>
            <el-tag v-if="scope.row.goods_id.kamiType===3" type="danger" size="mini">重复卡</el-tag>
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
        width="120">
        <template slot-scope="scope">
             <el-button @click="handleDel(scope.row)" type="text" size="small">删除</el-button>
             <el-button @click="handleSell(scope.row)" type="text" size="small">可售状态切换</el-button>
             
        </template>
</el-table-column>
</el-table>
  </div>
</template>

<script>
export default {
      name:'KamiList',
      //props:['hot4_list'],
      data:function(){
          return{
              kami_list:[]
          }
      },
      created(){
          this.fetch()
      },
      methods:{
        async  fetch(){
            const d = await this.$http.post('/goods/api/get_kami_list')
           
            if(d.data.code === 1){
                this.kami_list = d.data.data
            }
          },
          async handleDel(row){
              const d = await this.$http.post('/goods/api/del_kami',row)
              if(d.data.code===1){
                  this.$message({type:"success",message:"删除卡密成功"})
              }
              this.fetch()
          },
          async handleNoSell(){},
      }
}
</script>

<style>
.kami_list_1{
    display: grid;
    grid-template-columns: 120px 500px;
    grid-column-gap: 20px;

}
</style>