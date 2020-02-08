const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  phone_num:String,
  sms_num:String,
  time:String, //发送时间
  expriess_at:Number,  //过期时间点unix时间秒
})
const model = mongoose.model('Sms', schema)
module.exports = model 