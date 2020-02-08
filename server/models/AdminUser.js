const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  username: { type: String, unique: true },  //用户名
  password: {
    type: String,
    select: false,
    set(val) {
      return require('bcryptjs').hashSync(val, 10)
    }
  },
  email: String,//用户邮箱
  phone_num: String,//用户手机
  qq: String,//用户qq
  permission: [String],//用户权限标记 数组
  config:[{type:mongoose.Schema.Types.ObjectId,
              ref:'Config'
    }], //用户的店铺信息
  money:Number //用户余额
})
const model = mongoose.model('AdminUser', schema)
module.exports = model