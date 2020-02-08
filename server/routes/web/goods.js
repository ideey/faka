module.exports = app => {
    const express = require('express')
    const moment = require('moment')
    const mongoose = require('mongoose')
    const Type = require('../../models/Type')
    const Goods = require('../../models/Goods')
    const Kami = require('../../models/Kami')
    const router = express.Router({
      mergeParams: true
    })


    router.post('/get_goods',async (req,res)=>{
      let d={}
      if(req.body.type_id){
         d = await Goods.find({type:mongoose.Types.ObjectId(req.body.type_id)}).populate('type')
      }else if(req.body.id){
         d = await Goods.findById(req.body.id).populate('type')
      }else{
        d = await Goods.find().populate('type')
      }
      res.send({code:1,data:d})
    })

    //const authMiddleware = require('../middleware/auth')
    app.use('/web/goods/api',  router)   //authMiddleware()
  
    // 错误处理函数
    app.use(async (err, req, res, next) => {
       console.log(err)
      res.status(err.statusCode || 500).send({
        message: err.message
      })
    })
  }