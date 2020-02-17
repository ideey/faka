const express = require('express')
const app = express()
//const axios = require('axios')
//ApiClient = require('./nodejs').ApiClient;
//const {getElofNum} = require('./plugins/tools')
//const Config = require('./models/Config')

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(require('cors')())

require('./plugins/db')(app)//数据库及模型
require('./routes/admin.js')(app) //用户管理
require('./routes/goods.js')(app) //商品及卡密管理
require('./routes/pay.js')(app)   //支付相关
require('./routes/lepay.js')(app)   //乐支付相关
require('./routes/order.js')(app)   //后台管理订单相关

require('./routes/web/goods.js')(app)   //前端商品相关
require('./routes/web/order.js')(app)   //前端订单相关

require('./plugins/cron')(app)//开启定时任务

app.set('secret', 'i2u34fhhroi3u412my8')

app.use('/uploads', express.static(__dirname + '/uploads'))

app.listen(8889,()=>{
    console.log('启动于 http://127.0.0.1:8889')
})