const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  name:String,
  active:Number, //1-激活 0-不激活
  sort:Number,
})
const model = mongoose.model('Type', schema)
module.exports = model