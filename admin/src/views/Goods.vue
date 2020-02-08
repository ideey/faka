<template>
  <div><h1>商品管理</h1>
  <div>
      <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="商品列表" name="list">
        <div>
                    <el-table
                        :data="goods_list"
                        style="width: 90%"
                        height="450px">
                        <el-table-column
                          prop="type.name"
                          label="商品分类"
                          sortable
                          width="180">
                          <template slot-scope="scope">
                             {{scope.row.type.name}}
                            </template>
                        </el-table-column>
                        <el-table-column
                          prop="name"
                          label="商品名称"
                          sortable
                          width="180">
                        </el-table-column>
                        <el-table-column
                          prop="price"
                          label="价格"
                          width="80">
                        </el-table-column>
                        <el-table-column
                          prop="sort"
                          label="排序"
                          sortable
                          width="80">
                        </el-table-column>
                        <el-table-column
                          prop="stock"
                          label="库存"
                          sortable
                          width="80">
                        </el-table-column>
                        <el-table-column
                          prop="kamiType"
                          label="卡密类型"
                          sortable
                          width="120">
                        <template slot-scope="scope">
                             <el-tag v-if="scope.row.kamiType===1" size="mini" type="info">默认卡密</el-tag>
                             <el-tag v-if="scope.row.kamiType===2" size="mini" type="warning">循环卡密</el-tag>
                             <el-tag v-if="scope.row.kamiType===3" size="mini" type="danger">重复卡密</el-tag>
                            </template>  
                        </el-table-column>
                        <el-table-column
                          prop="active"
                          sortable
                          label="状态">
                            <template slot-scope="scope">
                              <el-tag v-if="scope.row.active===1" size="mini" type="success">激活</el-tag>
                              <el-tag v-else-if="scope.row.active===0" size="mini" type="info">未激活</el-tag>
                            </template>
                        </el-table-column>
                            <el-table-column
                            label="操作"
                            width="150">
                            <template slot-scope="scope">
                              <el-button @click="handleActive(scope.row)" type="text" size="mini">激活切换</el-button>
                              <el-button @click="handleEdit(scope.row)" type="text" size="mini">编辑</el-button>
                              <el-button @click="handleDel(scope.row)" type="text" size="mini">删除</el-button>
                            </template>
                          </el-table-column>
                      </el-table>
        </div>
      </el-tab-pane>
      <el-tab-pane label="添加商品" name="add">
        <div class="goods_2">
            <el-form ref="formgoods" :model="formgoods" label-width="120px" :rules="rules" >
                <el-form-item label="商品分类" prop="type">
                  <el-select v-model="formgoods.type" placeholder="请选择" size="mini">
                    <el-option
                      v-for="item in options"
                      :key="item._id"
                      :label="item.name"
                      :value="item._id">
                    </el-option>
                  </el-select>                 
                </el-form-item>
                <el-form-item label="商品名称" prop="name">
                  <el-input v-model="formgoods.name" placeholder="5-20个字符" size="mini"  maxlength="20"   show-word-limit>
                    
                  </el-input>
                </el-form-item>
               <el-form-item label="商品图片:不小于300*300,正方形,1M以下">
                <el-upload
                  class="avatar-uploader"
                  :action="uploadUrl"
                  :headers="getAuthHeaders()"
                  :show-file-list="false"
                  :on-success="uploadsSuccess"
                   :before-upload="beforeAvatarUpload">
                
                  <img v-if="formgoods.goods_img" :src="goods_img" class="avatar">
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
              </el-form-item>
                <el-form-item label="排序" prop="sort">
                  <el-input v-model.number="formgoods.sort"  size="mini"></el-input>
                </el-form-item>  
                                      
                <el-form-item label="价格" prop="price">
                  <el-input v-model="formgoods.price" placeholder="" size="mini">
                    <template slot="append"><span style="font-size=20px;font-weight:bold;color:orange;">￥{{Number(formgoods.price)}}元</span></template>
                  </el-input>
                </el-form-item>                            
                <el-form-item label="卡密类型" prop="kamiType">
                      <el-radio-group v-model.number="formgoods.kamiType" size="mini">
                      <el-radio-button label=1>默认卡密</el-radio-button>
                      <el-radio-button label=2 disabled >循环卡密</el-radio-button>
                      <el-radio-button label=3 disabled >重复卡密</el-radio-button>
                        </el-radio-group>
                </el-form-item>
                <el-form-item label="商品描述" prop="description">
                  <el-input
                    type="textarea"
                    :rows="2" maxlength="1000"   show-word-limit
                    placeholder="必填，商品描述会在买家选择商品时展示，建议写上您商品的简介，官网以及常见的问题"
                    v-model="formgoods.description">
                  </el-input>
                </el-form-item>
                <el-form-item label="使用说明" prop="Instructions">
                  <el-input
                    type="textarea"
                    :rows="2" maxlength="1000"   show-word-limit
                    placeholder="必填，商品使用说明会在买家购买完成后展示，建议写上您的产品使用说明，售后联系方式等"
                    v-model="formgoods.Instructions" >
                  </el-input>
                </el-form-item>
                <el-form-item label="是否激活" prop="active">
                      <el-radio-group v-model.number="formgoods.active" size="mini">
                      <el-radio-button label=1>激活</el-radio-button>
                      <el-radio-button label=0>不激活</el-radio-button>
                        </el-radio-group>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="onSubmit" size="mini">立即创建</el-button>
                  <el-button size="mini" @click="$refs['formgoods'].resetFields()">取消</el-button>
                </el-form-item>
              </el-form>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
        <el-dialog title="商品编辑" :visible.sync="show_edit">

      <el-form :model="edit_goods" size="small" :rules="rulesA" ref="edit_goods">
        <el-form-item label="商品名称" label-width="120px" prop="name">
          <el-input v-model="edit_goods.name" autocomplete="off"  ></el-input>
        </el-form-item>
        <el-form-item label="商品价格" label-width="120px" prop="price">
          <el-input v-model="edit_goods.price" autocomplete="off"  ></el-input>
        </el-form-item>
        <el-form-item label="商品排序" label-width="120px" prop="sort">
          <el-input v-model.number="edit_goods.sort" autocomplete="off"></el-input>
        </el-form-item>
          <el-form-item label="商品描述" prop="description">
            <el-input
              type="textarea"
              :rows="2"
              placeholder="必填，商品描述会在买家选择商品时展示，建议写上您商品的简介，官网以及常见的问题"
              v-model="edit_goods.description">
            </el-input>
          </el-form-item>
          <el-form-item label="使用说明" prop="Instructions">
            <el-input
              type="textarea"
              :rows="2"
              placeholder="必填，商品使用说明会在买家购买完成后展示，建议写上您的产品使用说明，售后联系方式等"
              v-model="edit_goods.Instructions">
            </el-input>
          </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="show_edit = false">取 消</el-button>
        <el-button type="primary" @click="eidt_yes">确认已支付</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
export default {
  data(){
    var checkPrice=function(rule, value, callback){
        if(value==='' || value ===0 ){
            callback(new Error('请输入价格'));
        }else if(!/^\d{1,}(\.\d{1,}){0,1}$/.test(value)){
           callback(new Error('请输入正确价格'));
        }else{
          callback()
        }
      }
    return{
      goods_list:[],
      activeName: 'list',
      formgoods:{sort:15,price:0,kamiType:1,active:1},
      options:[],//分类
      edit_goods:{},//当前编辑的商品
      show_edit:false, //编辑界面

      rules:{
        type:[{ required: true, message: '请选择类型', trigger: 'change'}],
        name:[ 
             { required: true, message: '请输入商品名称', trigger: 'blur' },
            { min: 5, max: 20, message: '长度在 5 到 20 个字符', trigger: 'blur' }
        ],
        sort:[{required: true, message: '请输入排序', trigger: 'blur'}],
        price:[{required: true, message: '请输入商品价格', trigger: 'blur'},
           { validator: checkPrice, trigger: 'change' }
        ],
        description:[
           { required: true, message: '请输入商品介绍', trigger: 'blur' },
            { min: 5, max: 1000, message: '长度在 5 到 1000 个字符', trigger: 'blur' }
        ],
        Instructions:[
           { required: true, message: '请输入商品使用说明', trigger: 'blur' },
            { min: 5, max: 1000, message: '长度在 5 到 1000 个字符', trigger: 'blur' }
        ],
        active:[
          { required: true, message: '请选择是否激活使用', trigger: 'blur' },
        ]
      },
      rulesA:{
        name:[ 
             { required: true, message: '请输入商品名称', trigger: 'blur' },
            { min: 5, max: 20, message: '长度在 5 到 20 个字符', trigger: 'blur' }
        ],
        sort:[{required: true, message: '请输入排序', trigger: 'blur'}],
        price:[{required: true, message: '请输入商品价格', trigger: 'blur'},
           { validator: checkPrice, trigger: 'change' }
        ],
        description:[
           { required: true, message: '请输入商品介绍', trigger: 'blur' },
            { min: 5, max: 1000, message: '长度在 5 到 1000 个字符', trigger: 'blur' }
        ],
        Instructions:[
           { required: true, message: '请输入商品使用说明', trigger: 'blur' },
            { min: 5, max: 1000, message: '长度在 5 到 1000 个字符', trigger: 'blur' }
        ],
      },
    }
  },
  computed:{
    goods_img:function(){
      return process.env.VUE_APP_API_URL+this.formgoods.goods_img
    }
  },
  async created(){
    this.fetch()
    this.get_goods()
  },
  methods:{
      handleClick(tab, event) {
        //console.log(tab, event);
      },
      async handleActive(row){
        const d = await this.$http.post('/goods/api/active_goods',row)
        if(d.data.code === 1){
          this.get_goods()
          this.$message({type:"success",message:"切换成功"})
        }
      },
      async handleEdit(row){
        this.edit_goods = {...row}
        this.show_edit = true
      },
      async eidt_yes(){
        this.$refs['edit_goods'].validate(async (v)=>{
          if(!v){
            this.$message({type:"error",message:'请检查商品各项目,填 写 完 整'})
          }else{
            this.edit_goods.price = Number(this.edit_goods.price)
            const d = await this.$http.post('/goods/api/edit_goods',this.edit_goods)
            if(d.data.code === 1){
              this.$message({type:"success",message:"保存商品成功"})
              this.get_goods()
              this.show_edit = false
            }
          }
        })
      },
      async handleDel(row){
        const d = await this.$http.post('/goods/api/del_goods',row)
        if(d.data.code === 1){
          this.get_goods()
          this.$message({type:"success",message:"删除商品成功"})
        }
      },
      async onSubmit(){
        this.$refs['formgoods'].validate(async (v)=>{
          if(!v){
            this.$message({type:"error",message:'请检查商品各项目,填 写 完 整'})
          }else{
              const d = await this.$http.post('/goods/api/add_goods',this.formgoods)
              if(d.data.code === 1){
                this.$message({type:"success",message:"商品增加成功"})
                this.get_goods()
                this.activeName = 'list'
                this.$refs['formgoods'].resetFields();
              }else if(d.data.code ===0 ){
                this.$message({type:"error",message:d.data.error})
              }
          }
        })


      },
      async fetch(){
        const d = await this.$http.post('/goods/api/get_types')
        let a = d.data.data.filter(el=>{
          return el.active === 1
        })
        a.sort((e1,e2)=>{
          return e1.sort - e2.sort
        })
        this.options = a
      },
      async get_goods(){
        const d = await this.$http.post('/goods/api/get_goods')
        this.goods_list = d.data.data
      },
        beforeAvatarUpload(file) {
        console.log(file)
        const isJPG = (file.type === 'image/jpeg') || (file.type === 'image/png')
        const isLt2M = file.size / 1024 / 1024 < 1;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      },
      uploadsSuccess(res){
        console.log(res)
        this.$set(this.formgoods, 'goods_img', res.url) //process.env.VUE_APP_API_URL+res.url
      }
  }
}
</script>

<style>
.goods_2{
  width: 70%;
}
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 150px;
    height: 150px;
    line-height: 150px;
    text-align: center;
  }
  .avatar {
    width: 150px;
    height: 150px;
    display: block;
  }
</style>