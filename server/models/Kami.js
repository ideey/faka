const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  type_id:{type:mongoose.Schema.Types.ObjectId,ref:'Type',index:true},
  goods_id:{type:mongoose.Schema.Types.ObjectId,ref:'Goods',index:true},
  kami:String,
  sell_time:String,//卖出时间
  status:Number,//状态 1-待出售 2-锁定 3-卖出
  active:Number,//状态 1-可出售 2-不出售
  
},
{timestamps:true})
const model = mongoose.model('Kami', schema)
module.exports = model