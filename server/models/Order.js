const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  type_id:{type:mongoose.Schema.Types.ObjectId,ref:'Type',index:true},
  type_name:String,
  goods_id:{type:mongoose.Schema.Types.ObjectId,ref:'Goods',index:true},
  goods_name:String,
  kami_id:{type:mongoose.Schema.Types.ObjectId,ref:'Kami',index:true},
  kami:String,
  num:Number,
  price:Number,
  money:Number,
  qq_email:String,
  password:String,//查询密码
  ip:String,
  status:Number,//1-待支付 2-已支付 3-手动确认支付 4-支付成功,无合适卡密
  pay_type:String,//支付通道及信息
  pay_time:String,//支付时间
  pay_bad_end_time:Number,//最后的支付时间戳
  pay_link:String,//支付连接
  pay_good_info:{},//支付成功后的返回信息
},
{timestamps:true})
const model = mongoose.model('Order', schema)
module.exports = model