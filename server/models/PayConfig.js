const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  pay_type:String,
  pay_info:{}
})
const model = mongoose.model('PayConfig', schema)
module.exports = model