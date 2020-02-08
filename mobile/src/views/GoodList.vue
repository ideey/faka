<template>
  <div>
      <div v-for="item in goods_list" :key="item._id" class="goods_item" @click="go_goods_detail(item)">
          <van-card
            num="销量"
            :price="item.price"
            :title="item.name"
            :thumb="item.goods_img"
            />
      </div>
  </div>
</template>

<script>
export default {
  data(){
    return{
      goods_list:[],
    }
  },
  created(){this.fetch()},
  methods:{
    async fetch(){
      const d = await this.$http.post('/web/goods/api/get_goods')
      if(d.data.code ===1){
        let a = d.data.data.filter(el=>{
          if(el.goods_img){
            el.goods_img = process.env.VUE_APP_API_URL+el.goods_img
          }else{
            el.goods_img = process.env.VUE_APP_API_URL+'/uploads/default'
          }
          return el.active ===1
        })
        this.goods_list = a
      }
    },
    go_goods_detail(goods){
      this.$router.push('/goods_detail/'+goods._id)
    }
  }
}
</script>

<style>
.goods_item{
    margin:15px;
    border-radius: 20px;
    box-shadow: 2px 2px 5px 1px rgba(255, 255, 255, 0.2),-2px -2px 5px 1px rgba(255, 255, 255, 0.2);
}
</style>