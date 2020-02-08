<template>
  <div class="reg-container">
    <el-card header="注册页面" class="reg-card">
      <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm"   label-width='auto' size="small">  
        <el-form-item label="用户名" prop="username">
          <el-input v-model="ruleForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="ruleForm.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="ruleForm.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="phone_num">
          <el-input v-model="ruleForm.phone_num" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="短信验证码" prop="sms_num">
          <el-input v-model="ruleForm.sms_num" autocomplete="off"></el-input>
          <el-button type="info" @click="get_sms" size="mini">获取短信验证码</el-button>
        </el-form-item>
        
        <el-form-item>
          <el-button type="danger"  @click="submitForm('ruleForm')">注册</el-button>
          <el-button type="text" @click="$router.push(`/login`)">已有帐号,去登陆</el-button>
        </el-form-item>
        
      </el-form>
    </el-card>
  </div>
</template>
<script>
export default {
  // @submit.native.prevent="reg"   原生按钮提交 Form上
      data() {
       let validateusername = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('用户名不能为空'));
        }
        setTimeout(() => {
          if (/^[a-z][0-9a-z_]{5,14}$/.test(value)) {
           callback();
          } else {
              callback(new Error('字母开头,6-15位数字及小写字母'));
          }
        }, 600);
      }; 
      let validatePass = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入密码'));
        } else {
          if (this.ruleForm.checkPass !== '') {
            this.$refs.ruleForm.validateField('checkPass');
          }
          callback();
        }
      };
      let validateEmail=(rule,value,callback)=>{
        if(!value){
          callback(new Error('请输入邮箱'))
        }else if(!/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(value)){
          callback(new Error('邮箱格式不正确'))
        }
        callback()
      }
      let validatePhone_num=(rule,value,callback)=>{
        if(!value){
          callback(new Error('请输入手机号'))
        }
        if(!/^1\d{10,10}$/.test(value)){
          callback(new Error('手机号格式错误'))
        }
        callback()
      }
      let validatorSms_num=(rule,value,callback)=>{
        if(!value){
          callback(new Error('请输入短信验证码'))
        }
        if(!/^\d{4}$/.test(value)){
          callback(new Error('验证码为4位数字'))
        }
        callback()
      }
      let validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.ruleForm.password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
        
        ruleForm: {
         // password: '',
         // checkPass: '',
         // username: ''
        },
        rules: {
          password: [
            { validator: validatePass, trigger: 'blur' }
          ],
          checkPass: [
            { validator: validatePass2, trigger: 'blur' }
          ],
           username: [
            { validator: validateusername, trigger: 'blur' }
          ] ,
          email:[{validator:validateEmail,trigger:'blur'}],
          phone_num:[{validator:validatePhone_num,trigger:'blur'}],
          sms_num:[{validator:validatorSms_num,trigger:'blur'}]
        }
      };
    },
    methods: {
      async reg(){
        const res = await this.$http.post('admin/api/reg', this.model)
        // sessionStorage.token = res.data.token
        localStorage.token = res.data.token
        this.$router.push('/')
        this.$message({
          type: 'success',
          message: '登录成功'
        })
    },
    async get_sms(){  //申请短信验证码
      if(/^\d{11}$/.test(this.ruleForm.phone_num)){
        const r = await this.$http.post('/admin/call/get_sms',{phone_num:this.ruleForm.phone_num})
        console.log(r.data)
        if(r.data&&(r.data.Message==='OK')){
          this.$message({type:'success',message:'验证码发送成功，请查看并输入'})
        }else{
          this.$message({type:'error',message:'验证码获取失败:'+r.data.Message})
        }
      }else{
         this.$message({type:'error',message:'请输入11位手机号码'})
      }
    },
       submitForm(formName) {
        this.$refs[formName].validate(async (valid) => {
          if (valid) {
            console.log(this.ruleForm)
            //return false
            const res = await this.$http.post('/admin/call/reg',this.ruleForm)
            //console.log(res.data)
            if(res.data.message==='ok'){
                this.$message({message:'注册成功',type:'success'})
                this.$router.push('/login')
            }else{
                this.$message({message:'注册失败',type:'error'})
            }
          } else {
            //console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
}
</script>

<style>
.reg-card{
  width: 25rem;
  margin: 0 auto;
}
.reg-container{
  background-image: url('../assets/cp_bg1.jpg');
  background-repeat:no-repeat;
  background-position:center;
  background-color: bisque;
  widows: 100vh;
  height: 100vh;
  padding-top:5rem
}
</style>
