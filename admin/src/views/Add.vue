<template>
  <div class="about">
    <h1>增加客服码</h1>
    <div style="width:70%">
     <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="客服码名称名称">
        <el-input v-model="form.name" placeholder="不要与之前的名称重复"></el-input>
      </el-form-item>
      <el-form-item label="当天阈值">
        <el-input v-model.number="form.end_day" placeholder="小于200"></el-input>
      </el-form-item>
      <el-form-item label="总的阈值">
        <el-input v-model.number="form.end_total" placeholder="小于5000"></el-input>
      </el-form-item>
      <el-form-item label="权重">
        <el-input v-model.number="form.weight" placeholder="不要大于10"></el-input>
      </el-form-item>
      
     <el-form-item label="上传客服码">
          <el-upload
          class="avatar-uploader"
          action="http://qrzd.idaay.com/admin/postFile/"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload">
          <img v-if="imageUrl" :src="imageUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
       </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">立即创建</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
    </div>
  </div>
</template>

<script>
 export default {
    data() {
      return {
        form: {
         name:'',
         end_day:'',
         end_total:'',
         weight:'',
         fileName:'',
         call_day:0,
         call_total:0,
         status:4,
         fileNameNick:'-'
        },
        imageUrl: ''
      }
    },
    methods: {
      async onSubmit() {
        console.log('submit!');
        console.log(this.form)
        const d = await this.$http.post('/admin/add_qr',this.form)
        //console.log(d.data)
        if(d.data.code === 1){
          this.$message({type:'success',message:'添加成功!'})
          this.$router.push('/list')
        }

      },
      handleAvatarSuccess(res, file) {
        this.imageUrl = URL.createObjectURL(file.raw);
        //console.log(res)
        if(res.code === 1){
          this.form.fileName = res.fileName
        }
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      }
    
    }
  }
</script>


<style>
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
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
