const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  type:{
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Type'
  },
  name:String,
  goods_img:String,
  active:Number,
  sort:{type:Number,default:10},
  price:Number,
  stock:{type:Number,default:0},
  kamiType:Number,//1-默认一条一卡 2-循环卡 3-重复卡,只有一个卡密
  description:String,//描述
  Instructions:String,//使用说明

})
const model = mongoose.model('Goods', schema)
module.exports = model