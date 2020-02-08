<template>
  <div class="about">
    <!-- <h1>This is an about page</h1> -->
    <div class="mid_6">
      <el-card >
        <div class="mid_7">
          <h3>立足地中间页系统：</h3>
          1:支持自己修改模板 (配置时选不同的html页面)<br><br>
          2:支持在中间页下面放推荐商品<br><br>
          3:推荐商品按填写的PID生成淘口令<br><br>
          4:支持放置视频商品 <br><br>
          5：支持设置单个主推商品，及自定义主图 <br><br>
          6:支持放置抖音热销品(待完成)

        </div>

      </el-card>
    </div>
  </div>
</template>
<style >
.mid_6{
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: 1fr;
  justify-items:center;
  margin-top: 30px
}
.mid_7{
  width:800px;
  height: 400px;
  background-color:ghostwhite;
  padding: 30px;
}

</style>