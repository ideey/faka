<template>
  <div class="about">
    <h1>客服码列表</h1>
      <el-alert title="访问量清零后,须手动开启,对应的码才会再次启动" type="warning">  </el-alert>

      <div class = "list_gird">
            <el-card class="list_item">
              今日总访问量<el-divider direction="vertical"></el-divider><span class = "sp">{{this.all_day}}</span>
            </el-card>
            <div></div>
            <el-card class="list_item">
            历史总访问量<el-divider direction="vertical"></el-divider><span class="sp">{{this.all_total}}</span>
          </el-card>
      </div>

        <el-table
      :data="tableData"
      style="width: 90%">
      <el-table-column
        prop="name"
        label="名称"
        width="120">
      </el-table-column>
      <el-table-column
        prop="a"
        label="今天访问/阈值"
        width="120">
      </el-table-column>
      <el-table-column
        prop="b"
        label="总访问/阈值"
        width="120">
      </el-table-column>
      <el-table-column
        prop="weight"
        label="权重"
        width="60">
      </el-table-column>
      <el-table-column
        prop="c"
        label="权重比例"
        width="120">
      </el-table-column>
      <el-table-column
        prop="status"
        label="状态"
        width="120"
        :formatter="formatter_status">
      </el-table-column>
        <el-table-column
      label="操作"
      width="340">
      <template slot-scope="scope">
        <el-button @click="handleEdit(scope.row)" type="text" size="small">编辑</el-button>
        <el-button @click="handleStop(scope.row)" type="text" size="small">暂停</el-button>
        <el-button @click="handleStart(scope.row)" type="text" size="small">开启</el-button>
        <el-button @click="handleDay_0(scope.row)" type="text" size="small">今天访问量清零</el-button>
        <el-button @click="handleTotal_0(scope.row)" type="text" size="small">总访问量清零</el-button>
        <el-button @click="handleDel(scope.row)" type="text" size="small">删除</el-button>
      </template>
    </el-table-column>
    </el-table>
    
      <div><!-- 弹出编辑 -->
            <el-dialog title="编辑信息" 
            :visible.sync="dialogFormVisible" 
            width="50%"
            center>
                <el-form :model="form">
                  <el-form-item label="名称" :label-width="formLabelWidth">
                    <el-input v-model="form.name" :disabled="true"></el-input>
                  </el-form-item>
                  <el-form-item label="1天的阈值" :label-width="formLabelWidth">
                    <el-input v-model.number="form.end_day" ></el-input>
                  </el-form-item>
                  <el-form-item label="总的阈值" :label-width="formLabelWidth">
                    <el-input v-model.number="form.end_total" ></el-input>
                  </el-form-item>
                  <el-form-item label="权重" :label-width="formLabelWidth">
                    <el-input v-model.number="form.weight" ></el-input>
                  </el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="editDate">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
       data() {
        return {
          tableData: [],
          dialogFormVisible:false,
          form:{},
          formLabelWidth:'200',
          all_day:0,
          all_total:0
        }
      },
      async created(){
        //console.log('')
        this.fetch()
         this.timer = setInterval(this.fetch, 8000);
      },
      beforeDestroy() {
        console.log('清除setInterval')
        clearInterval(this.timer);
      },
      methods:{
        async fetch(){
          console.log('fetch...')
          const d = await this.$http.post('/admin/qrList')
          let all_weight = 0 //所有有效权重
          let all_day = 0 //今天所有访问量
          let all_total = 0 //历史所有访问量

          d.data.forEach(el => {
            if(el.status === 1 ){
              all_weight += el.weight
            }
            all_day += el.call_day
            all_total += el.call_total
          });
          this.all_day = all_day
          this.all_total = all_total
          //console.log(all_weight)
          const a = d.data.map(el=>{
            el.a = el.call_day+'/'+el.end_day
            el.b = el.call_total+'/'+el.end_total
            if(el.status === 1){
              el.c = ((el.weight / all_weight)*100).toFixed(2)+'%'
            }else{
              el.c = '-'
            }
            
            return el
          })
          //console.log(a)
          this.tableData = a
         
        },
        async handleEdit(row){
          //console.log(row)
          this.form = row
          this.dialogFormVisible = true
        },
        async handleStop(row){
          const d = await this.$http.post('/admin/stop_qr',row)
          if(d.data.code === 1){
            this.$message({type:'success',message:'手动暂停成功!'})
          }
          this.fetch()
        },
        async handleStart(row){
          const d = await this.$http.post('/admin/start_qr',row)
          if(d.data.code === 1){
            this.$message({type:'success',message:'手动开启成功!'})
          }
          this.fetch()
        },
        async editDate(){
          if(this.form.weight>10){
            this.$message({type:'error',message:'权重不要超过10'})
            return
          }
          if(this.form.weight<1){
            this.$message({type:'error',message:'权重不能小于1'})
            return
          }
          if(this.form.end_day>500){
            this.$message({type:'error',message:'1天的访问量不要超过500'})
            return
          }
          if(this.form.end_day<10){
            this.$message({type:'error',message:'1天的访问量不能小于10'})
            return
          }
          if(this.form.end_day <= this.form.call_day){
            this.$message({type:'error',message:'1天的访问量不能小于今天已有量'})
            return
          }
          if(this.form.end_total>5000){
            this.$message({type:'error',message:'总访问量不要超过5000'})
            return
          }
          if(this.form.end_total<50){
            this.$message({type:'error',message:'总访问量不能小于50'})
            return
          }
          if(this.form.end_total<= this.form.call_total){
            this.$message({type:'error',message:'总访问量不能小于已有量'})
            return
          }
          const d = await this.$http.post('/admin/edit_qr',this.form)
          if(d.data.code  === 1){
            this.$message({type:'success',message:'修改成功!'})
            
          }
          this.dialogFormVisible = false
          this.form = {}
          this.fetch()
        },
        async handleDay_0(row){
          const d = await this.$http.post('/admin/day_0',row)
          if(d.data.code === 1){
            this.$message({type:'success',message:'今天访问量清零成功'})
          }
           this.fetch()
        },
        async handleTotal_0(row){
           const d = await this.$http.post('/admin/total_0',row)
           if(d.data.code === 1 ){
             this.$message({type:'success',message:'总访问量清零成功'})
           }
            this.fetch()
        },
        async handleDel(row){
          const d = await this.$http.post('/admin/del',row)
           if(d.data.code === 1 ){
             this.$message({type:'success',message:'删除成功'})
           }
            this.fetch()
        },
        formatter_status(row){
          let m = ['','正常','暂停-今日触阈值','暂停-触总阈值','暂停-手动暂停']
          return m[row.status]
        }
      }
}
</script>
<style>
  .list_gird{
    display: grid;
    grid-template-columns:2fr 1fr 2fr;
    margin-top: 20px;
    margin-bottom: 20px;
    width: 60%;
    font-size: 14px
  }
  .sp{
    font-size: 28px;
    font-weight: bold;
    margin-left: 10px;
  }
</style>