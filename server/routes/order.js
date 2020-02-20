module.exports = app => {
    const express = require('express')
    const moment = require('moment')
    const assert = require('http-assert')
    const mongoose = require('mongoose')
    const Type = require('../models/Type')
    const Goods = require('../models/Goods')
    const Kami = require('../models/Kami')
    const Order = require('../models/Order')
    const router = express.Router({
      mergeParams: true
    })
    //获取所有订单信息 后台用
    router.post('/get_all_order',async(req,res)=>{
      const {type_id,goods_id,order_status,page} = req.body
      const limit = 50 //每页返回50
      const skip = (Number(page) - 1)*limit 
      const match = {} //查询条件
      if(goods_id){
        match.goods_id = mongoose.Types.ObjectId(goods_id)
      }
      if(type_id){
        match.type_id = mongoose.Types.ObjectId(type_id)
      }
      if(order_status){
        const status = Number(order_status)
        if(status>0){
          match.status = status
        }
      }
      const count = await Order.find(match).countDocuments()
      //const d = await Order.find()//.populate('type_id').populate('goods_id').populate('kami_id')
      const f = await Order.aggregate([
        {  $match:match  },{ $skip:skip }, { $limit:limit  }
      ])
      res.send({code:1,data:f,count:count})
    })

    //手动确认支付订单
    router.post('/pay_yes',async(req,res)=>{
      let {_id} = req.body
      const d = await Order.findById(_id)
      assert(d, 442, '无此订单')

      //找一张合适的卡密 
      const k = await Kami.findOne({
        goods_id:mongoose.Types.ObjectId(d.goods_id),
        status:1,
        active:1
      })
      assert(k, 442, '没有合适卡密,可能无库存')
      //改变卡密状态   这里要用事务
      const k1 = await Kami.findByIdAndUpdate(k._id,{status:3})
      //卡的信息写入订单中 支付信息写入订单中
      const o1 = await Order.findByIdAndUpdate(d._id,{
        pay_good_info:{
          pay_yes:1,
          pay_yes_time:moment().format('YYYY-MM-DD HH:mm:ss'),
          
        },
        status:3,
        kami_id:k._id,
        kami:k.kami,
        pay_type:'pay_yes',
        pay_time:moment().format('YYYY-MM-DD HH:mm:ss')
      })
      res.send({code:1,data:d})
    })
    
    const authMiddleware = require('../middleware/auth')
    app.use('/order/api', authMiddleware(), router)   
  
    // 错误处理函数
    app.use(async (err, req, res, next) => {
      console.log(err)
      res.status(err.statusCode || 500).send({
        message: err.message
      })
    })
  }