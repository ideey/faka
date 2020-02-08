<template>
  <div><!-- <h4>卡密管理</h4> -->
  <div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="卡密概况" name="all"><KamiAll></KamiAll></el-tab-pane>
    <el-tab-pane label="卡密列表" name="list"><KamiList></KamiList></el-tab-pane>
    <el-tab-pane label="添加卡密" name="add">
        <div class="add_kami"> 
            <div class="add_kami_1">  
            <el-select v-model="form.type_id" placeholder="选择分类" size="mini" @change="type_change" >
                <el-option
                v-for="item in types"
                :key="item._id"
                :label="item.name"
                :value="item._id"
                >
                </el-option>
            </el-select>
            <el-select v-model="form.goods_id" placeholder="选择商品" size="mini" @change="goods_change">
                <el-option
                v-for="item in goods"
                :key="item._id"
                :label="item.name"
                :value="item._id">
                </el-option>
            </el-select>
            <el-input
                placeholder="卡密类型"
                v-model="form.kamiType_name"
                :disabled="true"
                size="mini">
                </el-input>
            </div>
            <div class="add_kami_4">  
                <el-alert
                    :title="alert_title"
                    type="info"
                    effect="dark"
                    :closable="false">
                </el-alert>
                <el-upload
                action='/'
                :show-file-list="false"
                accept=".txt"
                name="textFile_ideey"
                :file-list="fileList"
                :limit="1"
                :on-change="text_change"
                :auto-upload="false"
                >
                    <el-button size="small" round type="primary" plain>TXT文本导入</el-button>
                </el-upload>


                
            </div>
            <div class="add_kami_2">
                <el-input
                        type="textarea"
                        :rows="12"
                        :placeholder="placeholder"
                        v-model="kami_s">
                    </el-input>
                
            </div>
            <div class="add_kami_3">
                <el-button size="mini" type="primary" @click="add_kami">添加卡密</el-button>
            </div>
        </div>
    </el-tab-pane>
   <!--  <el-tab-pane label="导入卡密" name="add_text"><AddText></AddText></el-tab-pane> -->
  </el-tabs>
  </div>
  </div>

</template>

<script>
import KamiList from '@/views/kami/KamiList.vue'
import KamiAll from '@/views/kami/KamiAll.vue'
//import AddText from '@/views/kami/AddText.vue'
export default {
    components:{
      KamiList,KamiAll,//AddText
    },
    data() {
      return {
        activeName: 'all',
        form:{goods_id:'',kamiType_name:''},
        types:[],
        goods:[],
        kami_s:'',
        fileList:[],
        placeholder:'请输入卡密',
        p:['',
        '默认卡密类型：一行一条,一条只出售一次,比如:\n12345-abcd\n12346-feghe23\n\n如果只有单独的卡号或单独的密码,就填入单独一行,比如: \nabcdW3frt876GHGVF',
        '循环卡密类型:一行一条,可以输入多条,每条可以循环出售,比如：\n123456-abcdef\n23445-fe7ugfe',
        '重复卡密类型:只能输入一条,这一条卡密重复出售,比如:\n12345-45678'
        ],
        alert_title:'注意卡密类型',
        alert_title_list:['',
        '默认卡密类型：一行一条,一条只出售一次',
        '循环卡密类型:一行一条,可以输入多条,每条可以循环出售',
        '重复卡密类型:只能输入一条,这一条卡密重复出售'
        ]
      }
    },
    created(){
        this.fetch()
    },
    methods: {
      handleClick(tab, event) {
      },
      text_change(file,fileList){
          //console.log(file)
          let self = this
          const selectedFile = document.getElementsByName('textFile_ideey')[0].files[0]
          const size = selectedFile.size
          if(size > 1*1024*1024){
              this.$message({type:'warning',message:'文件超过1M'})
                self.fileList = [] //重置上传列表
                selectedFile.value=''  //重置file
              return
          }
          const reader = new FileReader()
          reader.readAsText(selectedFile)
                reader.onload = function () {
                //console.log(this.result);
                //let a = this.result.replace(/\r/g,'') //去换win下的换行
                self.kami_s = this.result;
                self.fileList = [] //重置上传列表
                selectedFile.value=''  //重置file
        }

      },
      async fetch(){
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
      async add_kami(){
          let kami_list = this.kami_s.split('\n')
          let p = []
          kami_list.forEach(el => {
             let a = {
                 type_id:this.form.type_id,
                 goods_id:this.form.goods_id,
                 status:1,
                 active:1
             }
            a.kami = el
            p.push(a)
          })
          const d = await this.$http.post('/goods/api/add_kami',{list:p})
          if(d.data.code === 1){
              this.$message({type:'success',message:'添加卡密成功'})
              this.kami_s = ''
          }
      },
      async type_change(type){
          const d = await this.$http.post('/goods/api/get_goods',{type_id:type})
          //console.log(d.data.data)
          if(d.data.data.length > 0){
          let a = d.data.data.filter(el=>{
            return el.active === 1
            })
            a.sort((e1,e2)=>{
            return e1.sort - e2.sort
            })
            this.goods = a
            this.form.goods_id = ''
             this.form.kamiType_name = ''   
             this.placeholder='请输入卡密'
             this.alert_title = '注意卡密类型'        
          }else{
                this.form.goods_id = ''
                this.form.kamiType_name = ''
                this.placeholder='请输入卡密' 
                this.alert_title = '注意卡密类型'  
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
        goods_change(v){
          let a = ''
          let b = 0
          this.goods.forEach(el => {
              if(el._id === v){
                  if(el.kamiType === 1){
                      a = '默认卡'
                  }else if(el.kamiType === 2){
                      a = '循环卡'
                  }else if(el.kamiType === 3){
                      a = '重复卡'
                  }
                  this.placeholder = this.p[el.kamiType]
                  this.alert_title = this.alert_title_list[el.kamiType] 
              }

          });
          this.form.kamiType_name = '卡密类型:'+a
          
      }
      },

    
}
</script>

<style>
.add_kami{
    width: 90%;
}
.add_kami_1{
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
     grid-column-gap: 100px;
}
.add_kami_2{
    margin-top:10px;
    margin-bottom:10px;
}
.add_kami_4{
    margin-top:10px;
    display: grid;
    grid-template-columns: 7fr 2fr;
    grid-column-gap: 20px;
}
</style>