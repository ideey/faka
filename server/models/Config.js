const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  username:String,
  template:Number,
  goods_cat:String,//推荐商品的种类
  goods_num:String,//推荐商品的数量
  PID:String,
  button_type:String,//按钮类型 mobile or pc
  somegoods:[{}]

})
const model = mongoose.model('Config', schema)
module.exports = model