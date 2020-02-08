<template>
  <div class="midpage" style="background-color:rgb(238,241,246);padding:20px">
    
      <div class="mid_3">
        <div>
        <el-card class="box-card" style="width:900px;">
                      <div slot="header">
              <h1>中间页设置</h1>
               <el-alert
                type="warning">务必正确设置PID,会影响淘口令的生成
              </el-alert>
               <el-alert
                type="warning">当要显示电脑端连接时，请确认传过来的url参数是二合一带e参数的返利链接，不明白可以咨询
              </el-alert>
            </div>
              <div>
              <el-form ref="form" :model="form" label-width="200px" size="mini" >
                  <el-form-item label="推荐商品的种类:">
                    <el-radio v-model="form.goods_cat" label="jhs" border>巨划算商品</el-radio>
                    <el-radio v-model="form.goods_cat" label="top100" border>TOP100商品</el-radio>
                    <el-radio v-model="form.goods_cat" label="video" border  >视频看货</el-radio>
                    <el-radio v-model="form.goods_cat" label="thisone" border >自定义商品</el-radio>
                    
                  </el-form-item>


                  <el-form-item label="自定义商品:" v-if="form.goods_cat==='thisone'">
                    <el-card>
                      <el-button type="text" @click="add_somegoods">增加自定义商品:</el-button>
                      
                      <div v-for="(item,index) in somegoods" v-bind:key="index">
                        <span>第{{index+1}}个</span>
                      <el-form-item label="商品名称:" label-width:="100px" size="mini" >
                        <el-input placeholder="请输入要推荐商品的名称" v-model="item.title"></el-input>
                      </el-form-item>
                      <el-form-item label="图片地址:" label-width:="100px">
                        <el-input placeholder="请输入要推荐商品的图片地址" v-model="item.pic"></el-input>
                      </el-form-item>
                      <el-form-item label="原价:" label-width:="100px">
                        <el-input placeholder="优惠前价格" v-model="item.price"></el-input>
                      </el-form-item>
                      <el-form-item label="优惠卷金额:" label-width:="100px">
                        <el-input placeholder="优惠卷的金额" v-model="item.price_coupons"></el-input>
                      </el-form-item>
                      <el-form-item label="卷后价:" label-width:="100px">
                        <el-input placeholder="卷后价" v-model="item.price_after_coupons"></el-input>
                      </el-form-item>
                      <el-form-item label="商品返利连接:" label-width:="100px" >
                        <el-input placeholder="商品返利连接(可以为空)" v-model="item.url"></el-input>
                      </el-form-item>
                      <el-form-item label="淘口令:" label-width:="100px" >
                        <el-input placeholder="淘口令" v-model="item.kl"></el-input>
                      </el-form-item>
                      <el-button type = "text" @click="delsomegoods(index)">删除</el-button>
                      <el-divider></el-divider>
                      </div>
                    </el-card>
                  </el-form-item>
                  
                  <el-form-item label="推荐商品的数量:">
                    <el-radio v-model="form.goods_num" label=6 border :disabled="this.form.goods_cat === 'thisone'">6个</el-radio>
                    <el-radio v-model="form.goods_num" label=10 border :disabled="this.form.goods_cat === 'thisone'">10个</el-radio>
                    <el-radio v-model="form.goods_num" label=16 border :disabled="this.form.goods_cat === 'thisone' || this.form.goods_cat === 'video'">16个</el-radio>
                    <el-radio v-model="form.goods_num" label=20 border :disabled="this.form.goods_cat === 'thisone' || this.form.goods_cat === 'video'">20个</el-radio>
                   <!--  <el-radio v-model="form.goods_num" label=30 border>30个</el-radio> -->
                  </el-form-item>
                  <el-form-item label="淘口令按钮显示：">
                   <el-radio v-model="form.button_type" label="mobile" border>只显示手机端</el-radio>
                    <el-radio v-model="form.button_type" label="pc" border>显示手机端+电脑端</el-radio>
                  </el-form-item>
                  <el-form-item label="自己的PID(生成淘口令用):">
                      <el-input
                      placeholder="请输入PID,格式为:mm_1234567_1234567_1234567"
                      suffix-icon="el-icon-date"
                      v-model="form.PID">
                    </el-input>
                  </el-form-item>
                <el-form-item size="large">
                  <el-button type="primary" @click="onSubmit" >保存配置</el-button>
                  <el-button >取消</el-button>
                </el-form-item>

        </el-form>
            </div>
        </el-card>




        <el-card class="box-card" style="width:900px;margin-top:30px">
            <div slot="header">
              <h1>配置说明:</h1>
               <el-alert
                
                type="warning">配置连接的后面一定要传userid参数，不然会影响推荐商品的淘口令生成
              </el-alert>
            </div>
            <el-card style="font-size:14px">
              速推客配置如下:<br><br>
              <span>配置信息:</span>
              <el-input v-model="api"></el-input>
<!--               <span>模板1：高仿速推客官方</span>
              <el-input v-model="api1"></el-input>
              <span>模板2：高仿速推客官方+电脑端连接</span>
              <el-input v-model="api2"></el-input> -->
             
            </el-card>
       
       
       
        </el-card>

        </div>
          <el-card >
              <div class="mid_4">
<!--                 <div>
                <h3>模板0：原始简单v</h3>
                <el-divider></el-divider>
                <el-image fit="scale-down" :preview-src-list="srcList1" style="width: 100%; height: 400px;max-height:100%" src="https://i.loli.net/2019/11/15/k3BQD6ycmxRXEIi.png"  ></el-image>
                </div> -->
                <div>
                <h3>模板1：高仿速推客官方v</h3>
                <el-divider></el-divider>
                <el-image  fit="contain" :preview-src-list="srcList2" style="width: 100%; height: 400px" src="https://i.loli.net/2019/11/15/e8vRAyOg4EuhMU6.png"  ></el-image>
                </div>
                <div>
                <h3>模板2：高仿速推客官方+电脑端连接v</h3>
                <el-divider></el-divider>
                <el-image  fit="contain" :preview-src-list="srcList3" style="width: 100%; height: 400px" src="https://i.loli.net/2019/11/15/xWGpFNKSH17ocXi.png"  ></el-image>
                </div>
                <div>
                <h3>商品推荐模板:</h3>
                <el-divider></el-divider>
                <el-image fit="contain" :preview-src-list="srcList4" style="width: 100%; height: 400px"  src="https://i.loli.net/2019/11/15/mGcoE9ubwrAVQLn.png"  ></el-image>
                </div>
                </div>
        </el-card>
    </div>
  </div>
</template>



<script>
  export default {
    data() {
      return {
        form: {
          goods_cat:'jhs',
          goods_num:'10',
          button_type:'mobile',
        },
        somegoods:[],//用户自定义商品
       api:'',
       api1:'',
       api2 : '',
       srcList1:[
         'https://i.loli.net/2019/11/15/k3BQD6ycmxRXEIi.png'

       ],
       srcList2:[
         
         'https://i.loli.net/2019/11/15/e8vRAyOg4EuhMU6.png'
         
       ],
       srcList3:[
        
         'https://i.loli.net/2019/11/15/xWGpFNKSH17ocXi.png'
       
       ],
       srcList4:[
         
         'https://i.loli.net/2019/11/15/mGcoE9ubwrAVQLn.png'
       ],            
      }
    },
    async created(){
      this.fetch()
    },
    methods: {
      delsomegoods(index){
        this.somegoods.splice(index,1)
      },
      add_somegoods(){
        this.somegoods.push({})
        //console.log(this.somegoods)
      },
      async fetch(){
              const d = await this.$http.post('/admin/api/getConfig')
            if(d.data.code === 1){
              this.form = d.data.data
              if(d.data.data.somegoods){
                 this.somegoods = d.data.data.somegoods
              }else{
                 this.somegoods = []
              }
             
              this.api = `https://page.lizudi.top/all.html?taowords={淘口令}&image={图片地址}&url={返利地址}&userid=${this.form.username}`

            }else if(d.data.code === -1){
              this.$message({type:'info',message:'请配置信息,然后保存'})
            }
      },
      async onSubmit() {
        this.form.somegoods = this.somegoods
        //console.log(this.form);
        

        if(!this.form.PID){
          this.$message({type:'error',message:'PID为必填'})
          return
        }
        if(!(/^mm_[0-9]{4,14}_[0-9]{4,14}_[0-9]{4,14}$/.test(this.form.PID))){
           this.$message({type:'error',message:'请输入正确的PID格式'})
           return
        }
        let thisone_str = ''
        this.form.somegoods.forEach((el,index) => {
          console.log(el,index)
          if(el.name===''){
            //this.$alert('商品名称一定要有','自定义商品有问题')
            thisone_str +=  `第${index+1}个商品名称不能为空<br>`
          }
          if(/^https{0,1}:\/\/[0-9a-zA-Z\\/._!-\\?&]{1,}$/.test(el.pic)){
            //console.log(el.pic)
          }else{
            console.log('pic不行')
            thisone_str += `第${index+1}个商品图片地址格式不正确<br>`
          }
          if(/^([^0-9A-Za-z])[0-9a-zA-Z]{11}\1$/.test(el.kl) || /^\([0-9A-Za-z]{11}\)$/.test(el.kl)){
            console.log(el.kl)
          }else{
            thisone_str += `第${index+1}个商品淘口令格式不正确<br>`
          }
        });
        if(thisone_str!=''){
          this.$alert(thisone_str,'自定义商品有问题',{dangerouslyUseHTMLString: true})
          return 
        }
        const d = await this.$http.post('/admin/api/setConfig',this.form)
        //console.log(d.data)
        if(d.data.code === 1){
          this.$message({type:'success',message:'保存成功'})
          this.fetch()
        }else{
          this.$message({type:'error',message:d.data.msg})
        }

      }
    }
  }
</script>

<style>
.mid_3{
  display: grid;
  grid-template-columns: 920px auto;
  
}
.mid_4{
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 500px 500px;
    grid-row-gap: 20px;
   grid-column-gap: 10px;
}
</style>