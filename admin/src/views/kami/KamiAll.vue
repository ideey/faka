<template>
  <div><h1>卡密概况</h1>
    <div>
      <el-button @click="fetch()" size="small" type="info">刷新列表</el-button>
    <el-table
      :data="goods_list"
      style="width: 100%">
      <el-table-column
        prop="name"
        label="商品名称"
        width="180">
      </el-table-column>
      <el-table-column
        prop="all_num"
        label="总数量"
        width="80">
      </el-table-column>
      <el-table-column
        prop="wait_num"
        label="待售量"
        width="80">
      </el-table-column>
      <el-table-column
        prop="sell_num"
        label="已售量"
        width="80">
      </el-table-column>
      <el-table-column
        prop="noActive_num"
        label="锁定量"
        width="80">
      </el-table-column>
    </el-table>

    </div>
  </div>
</template>

<script>
export default {
    name:'KamiAll',
          data:function(){
          return{
              goods_list:[],

          }
      },
      created(){
          this.fetch()
      },
      methods:{
          async fetch(){
              const d = await this.$http.post('/goods/api/get_kami_overview')
              //console.log(d.data)
              if(d.data.code===1){
                  let a = d.data.data
                  a.forEach(el => {
                      el.name = el.goods_name[0].name
                  })
                  this.goods_list = a
              }
          }
      }
}
</script>

<style>

</style>