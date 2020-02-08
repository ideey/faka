<template>
  <div class="add_text">
              <div class="add_text_1">  
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
            <div style="margin-top:10px">  
                <el-alert
                    :title="alert_title"
                    type="info"
                    effect="dark"
                    :closable="false">
                </el-alert>
            </div>
  </div>
</template>

<script>
export default {
    name:'add_text',
    data(){
      return{
        form:{goods_id:'',kamiType_name:''},
        types:[],
        goods:[],
        kami_s:'',
        placeholder:'请输入卡密',
        p:['',
        '默认卡密类型：一行一条,一条只出售一次,比如:\n12345-abcd\n12346-feghe23\n\n如果只有密码,就填入单独一行,比如 abcdW3frt876GHGVF',
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
    created(){this.fetch()},
    methods:{
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
    }
}
</script>

<style>
.add_text{
  width:90%;
}
.add_text_1{
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
     grid-column-gap: 100px;
}
</style>