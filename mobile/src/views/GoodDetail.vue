<template>
  <div>
    <div class="gradient_wrap">
      <img class="gradient_wrap_img" crossOrigin="anonymous" :src="goods.goods_img" alt @load="hanldImageLoad"/>
    </div>
    <div class="goods_detail_info">
      <van-cell-group>
        <van-cell center title="单价">
          <template slot="default">
            <van-tag type="danger">{{goods.price}}元</van-tag>
          </template>
        </van-cell>
        <van-cell center title="库存">
          <template slot="default">
            <van-tag type="primary">{{goods.stock_now}}</van-tag>
          </template>
        </van-cell>
        <van-cell center :value="goods.name" />
        <van-cell center :value="goods.description" label="描述信息" />
      </van-cell-group>
    </div>
    <div class="goods_detail_info">
      <van-cell-group>
        <van-cell center title="购买数量">
          <template slot="default">
            <van-stepper v-model="order.num" min="1" max="1" />
          </template>
        </van-cell>

        <van-field v-model="order.qq_email" placeholder="请输入联系方式,qq 或 手机 或 邮箱 牢记" />
        <van-field v-model="order.password" placeholder="请输入查询密码,查询订单用,牢记" />
      </van-cell-group>
      <div class="goods_detail_bu">
        <van-button
          type="primary"
          size="large"
          @click="get_order"
          :disabled="goods.stock_now===0"
        >提交订单</van-button>
      </div>
    </div>
  </div>
</template>

<script>
import Grade from "grade-js";
export default {
  props: ["id"],
  data() {
    return {
      goods: {},
      order: {
        num: 1,
        stock_now: 0
      }
    };
  },
  created() {
    this.fetch();
  },
  
  methods: {
    async fetch() {
      const d = await this.$http.post("/web/goods/api/get_goods", {
        id: this.id
      });
      if (d.data.code === 1) {
        if (d.data.data.goods_img) {
          d.data.data.goods_img =
            process.env.VUE_APP_API_URL + d.data.data.goods_img;
        } else {
          d.data.data.goods_img =
            process.env.VUE_APP_API_URL + "/uploads/default";
        }
        this.goods = d.data.data;
      }
    },
    hanldImageLoad(){
        Grade(document.querySelectorAll(".gradient_wrap"));
    },
    async get_order() {
       
      if (!this.order.qq_email) {
        this.$toast.fail("请输入联系方式");
        return;
      }
      if (!this.order.password) {
        this.$toast.fail("请输入查询密码");
        return;
      }
      const d = await this.$http.post("/web/order/api/create_order", {
        goods: this.goods,
        order: this.order
      });
      if (d.data.code === 1) {
        this.$router.push("/order_pay/" + d.data.data._id);
      }
    }
  }
};
</script>

<style>
.goods_detail_info {
  margin: 10px;
  border-radius: 20px;
}
.goods_detail_bu {
  margin-top: 10px;
}

@media screen and (max-width: 640px) {
        .gradient_wrap {
        width: 100%;
        height: 100%;
        padding: 10px;
       
        }
        .gradient_wrap_img {
        width: 300px;
        height: 300px;
        box-shadow: 0 0 9px 5px rgba(10, 10, 37, 0.575);
        border-radius: 5px;
        }
}
@media screen and (min-width: 640px) {
        .gradient_wrap {
        width: 580px;
        height: 100%;
        margin: 10px;
        }
        .gradient_wrap_img {
        width: 450px;
        height: 450px;
        margin: 15px;
        box-shadow: 0 0 9px 5px rgba(10, 10, 37, 0.575);
        border-radius: 5px;
        }

}
</style>