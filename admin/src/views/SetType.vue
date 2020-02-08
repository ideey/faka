<template>
  <div class="midpage" style="background-color:rgb(238,241,246);padding:20px">
    
      <div class="mid_3">
        <div>
        <el-card class="box-card" style="width:95%;">
            <div slot="header">
              <h1>商品分类设置</h1>
            </div>
              <div class="settype_1">
                <div>
                  <el-alert  type="warning">删除分类前,须先把分类下面的商品全部删除!</el-alert>
                  <el-form>
                         <el-form ref="form" :model="form" label-width="120px">
                            <el-form-item label="分类名称">
                              <el-input v-model="form.name" placeholder="4-20个字符" size="mini"></el-input>
                            </el-form-item>
                            <el-form-item label="分类排序">
                              <el-input v-model.number="form.sort" placeholder="数字小的排前面" size="mini"></el-input>
                            </el-form-item>                            
                            <el-form-item label="是否激活">
                                  <el-radio-group v-model="form.active" size="mini">
                                  <el-radio-button label=1>激活</el-radio-button>
                                  <el-radio-button label=0>不激活</el-radio-button>
                                   </el-radio-group>
                            </el-form-item>
                            <el-form-item>
                              <el-button type="primary" @click="onSubmit" size="mini">立即创建</el-button>
                              <el-button size="mini">取消</el-button>
                            </el-form-item>
                          </el-form>
                  </el-form>
                </div>
                <div class="settype_2">
                      <el-table
                        :data="types"
                        style="width: 100%">
                        <el-table-column
                          prop="name"
                          label="分类名称"
                          width="180">
                        </el-table-column>
                        <el-table-column
                          prop="sort"
                          label="排序"
                          width="50">
                        </el-table-column>
                        <el-table-column
                          prop="active"
                          label="状态">
                            <template slot-scope="scope">
                              <el-tag v-if="scope.row.active===1" size="mini" type="success">激活</el-tag>
                              <el-tag v-else-if="scope.row.active===0" size="mini" type="info">未激活</el-tag>
                            </template>
                        </el-table-column>
                            <el-table-column
                            label="操作"
                            width="100">
                            <template slot-scope="scope">
                              <el-button @click="handleEdit(scope.row)" type="text" size="mini">激活切换</el-button>
                              <el-button @click="handleDel(scope.row)" type="text" size="mini">删除</el-button>
                            </template>
                          </el-table-column>
                      </el-table>
                </div>
            </div>
        </el-card>
        </div>
    </div>
  </div>
</template>



<script>
  export default {
    data() {
      return {
         types:[],
         form:{active:1,sort:20}
      }
    },
    async created(){
      this.fetch()
    },
    methods: {
      async fetch(){
        const d = await this.$http.post('/goods/api/get_types')
        this.types = d.data.data
      },
      async onSubmit(){
        const d = await this.$http.post('/goods/api/set_types',this.form)
        if(d.data.code===1){
          this.$message({type:"success",message:"增加成功"})
        }
        this.fetch()
      },
      async handleEdit(row){
        const d = await this.$http.post('/goods/api/active_types',row)
        if(d.data.code===1){
          this.$message({type:"success",message:"状态切换成功"})
        }else{
           this.$message({type:"error",message:d.data.error})
        }
        this.fetch()
      },
      async handleDel(row){
        const d = await this.$http.post('/goods/api/del_types',row)
        if(d.data.code===1){
          this.$message({type:"success",message:"删除成功"})
        }else{
           this.$message({type:"error",message:d.data.error})
        }
        this.fetch()
      },
    }
  }
</script>

<style>
.settype_1{
  display: grid;
  grid-template-columns: 40% 60%;
  place-items: center center;
}
.settype_2{
  place-self:  start center ;
}
</style>