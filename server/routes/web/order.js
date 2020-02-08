module.exports = app => {
    const express = require('express')
    const moment = require('moment')
    const mongoose = require('mongoose')
    const Type = require('../../models/Type')
    const Goods = require('../../models/Goods')
    const Kami = require('../../models/Kami')
    const Order = require('../../models/Order')
    const {getClientIp} = require('../../plugins/tools')
    const currency = require('currency.js')
    const assert = require('http-assert')
    const router = express.Router({
      mergeParams: true
    })
    
    //创建订单
    router.post('/create_order',async (req,res)=>{
      const {goods,order} = req.body
      let ip = getClientIp(req)
      let  money = currency(order.num).multiply(currency(goods.price))
      let order_info={
        type_id:mongoose.Types.ObjectId(goods.type._id),
        type_name:goods.type.name,
        goods_id:mongoose.Types.ObjectId(goods._id),
        goods_name:goods.name,
        num:order.num,
        price:goods.price,
        money:money,
        qq_email:order.qq_email,
        password:order.password,
        ip:ip,
        status:1,
      }
      const d = await Order.create(order_info)
      res.send({code:1,data:d})
    })
    //获取订单信息
    router.post('/get_order_info',async(req,res)=>{
      //const d = await (await Order.findById(req.body.id).populate('goods_id').populate('type_id'))
      const d = await Order.findById(req.body.id).populate('type_id').populate('goods_id').populate('kami_id')
      res.send({code:1,data:d})
    })
    //按联系方式查询订单
    router.post('/query_pass',async (req,res)=>{
      const {qq_email,password} = req.body
      const d = await Order.find({qq_email,password}).populate('goods_id')
      assert(d.length>0, 442, '没有查询到订单信息')
      res.send({code:1,data:d})
    })
    //按订单编号查询
    router.post('/query_orderNo',async(req,res)=>{
      const {order_no} = req.body
      let ip = getClientIp(req)
      assert(order_no,442,'订单编号格式错误')
      assert(order_no.match(/^[0-9a-z]{24}$/),442,'订单编号格式错误')
      const d =await Order.findById(order_no)
      assert(d, 442, '没有查询到订单信息')
      assert(d.ip === ip,442,'当前网络IP 与 下单时的不同,请用其它方式查询')
      res.send({code:1,data:[d]})
    })
    //const authMiddleware = require('../middleware/auth')
    app.use('/web/order/api',  router)   //authMiddleware()
  
    // 错误处理函数
    app.use(async (err, req, res, next) => {
       console.log(err)
      res.status(err.statusCode || 500).send({
        message: err.message
      })
    })
  }