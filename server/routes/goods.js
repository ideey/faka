module.exports = app => {
    const express = require('express')
    const moment = require('moment')
    const mongoose = require('mongoose')
    const Type = require('../models/Type')
    const Goods = require('../models/Goods')
    const assert = require('http-assert')
    const Kami = require('../models/Kami')
    const router = express.Router({
      mergeParams: true
    })

    router.post('/get_types',async(req,res)=>{
      const d = await Type.find()
      res.send({code:1,data:d})
    })
    router.post('/set_types',async(req,res)=>{
      const d = await Type.create(req.body)
      res.send({code:1,data:d})
    })
    router.post('/del_types',async(req,res)=>{
      const t = await Goods.find({type:mongoose.Types.ObjectId(req.body._id)})
      assert(t.length===0,442,'此分类下还有商品,请先删除商品')
      const d = await Type.findByIdAndRemove(req.body._id)
      res.send({code:1,data:d})
    })
    router.post('/active_types',async(req,res)=>{
        const {active,_id} = req.body
        const  a = active === 1 ? 0:1
        const d = await Type.findByIdAndUpdate(_id,{  active:a  })
        res.send({code:1,data:d})
    })
    router.post('/add_goods',async(req,res)=>{
      req.body.price = Number(req.body.price)
      const d = await Goods.create(req.body)
      res.send({code:1,data:d})
    })
    router.post('/get_goods',async (req,res)=>{
      let d={}
      if(req.body.type_id){
         d = await Goods.find({type:mongoose.Types.ObjectId(req.body.type_id)}).populate('type')
      }else{
         d = await Goods.find().populate('type')
      }
      res.send({code:1,data:d})
    })
    router.post('/del_goods',async(req,res)=>{
      const t = await Kami.findOne({
        goods_id:mongoose.Types.ObjectId(req.body._id),
      })
      assert(!t,442,'此商品下还有卡密,请先 删除 或 导出')
      const d = await Goods.findByIdAndDelete(req.body._id)
      res.send({code:1,data:d})
    })
    router.post('/edit_goods',async(req,res)=>{
      const {name,sort,price,description,Instructions} = req.body
      const d = await Goods.findByIdAndUpdate(req.body._id,{
        name,sort,price,description,Instructions
      })
      res.send({code:1,data:d})
    })
    router.post('/active_goods',async(req,res)=>{
      const {active,_id} = req.body
      const  a = active === 1 ? 0:1
      const d = await Goods.findByIdAndUpdate(_id,{  active:a  })
      res.send({code:1,data:d})
    })

    router.post('/add_kami',async (req,res)=>{
      const d = await Kami.insertMany(req.body.list)
      res.send({code:1,data:d})
    })
    router.post('/get_kami_list',async(req,res)=>{
      const {type_id,goods_id,kami_status,page} = req.body
      const limit = 50 //每页返回50
      const skip = (Number(page) - 1)*limit 
      const match ={} //查询条件
      if(goods_id){
        match.goods_id = mongoose.Types.ObjectId(goods_id)
      }
      if(type_id){
        match.type_id = mongoose.Types.ObjectId(type_id)
      }
      if(kami_status){
        const status = Number(kami_status)
        if(status>0){
          match.status = status
        }
      }
      //console.log(match)
      const count = await Kami.find(match).countDocuments()
      const f = await Kami.aggregate([
        {  $match:match  },{ $skip:skip }, { $limit:limit  },
        {
          $lookup:{
            from:'goods',
            localField:'goods_id',
            foreignField:'_id',
            as:'goods_info'         
          },
        },
        {
          $lookup:{
            from:'types',
            localField:'type_id',
            foreignField:'_id',
            as:'type_info'         
          },
        }
      ])
      //const d = await Kami.find().populate('type_id').populate('goods_id')
      res.send({code:1,data:f,count:count})
    })
    router.post('/del_kami',async(req,res)=>{
      const d = await Kami.findByIdAndDelete(req.body._id)
      res.send({code:1,data:d})
    })
    //获取卡密概况
    router.post('/get_kami_overview',async(req,res)=>{
      //const kami_list = await Kami.find().populate('goods_id')
      const d = await Kami.aggregate([
        {
          $project:{
           _id:1,
           goods_id:1,
           status:1,
           wait:{
             $cond:{
               if:{$eq:[1,'$status']},
               then:1,
                else:0
             }
           },
           sell:{
             $cond:{
               if:{$eq:[3,'$status']},
               then:1,
               else:0
             }
           },
           noActive:{
             $cond:{
               if:{$eq:[2,'$status']},
               then:1,
               else:0
             }
           }
          }
        },
        {
          $group:{
            _id:'$goods_id',
            all_num:{$sum:1},
            wait_num:{$sum:'$wait'},
            sell_num:{$sum:'$sell'},
            noActive_num:{$sum:'$noActive'}
          } 
        },
         {
            $lookup:{
              from:'goods',
              localField:'_id',
              foreignField:'_id',
              as:'goods_name'
          }
        }
      ])
      res.send({code:1,data:d})
    })

    const authMiddleware = require('../middleware/auth')
    app.use('/goods/api', authMiddleware(), router)  
    
    //图片上传
    const multer = require('multer')
    const upload = multer({ dest: __dirname + `/../uploads/${moment().format('YYYY-MM-DD')}` })
    app.post('/admin/api/upload', authMiddleware(), upload.single('file'), async (req, res) => {   
      const file = req.file
      file.url = `/uploads/${moment().format('YYYY-MM-DD')}/${file.filename}`
      //file.url = `/uploads/${file.filename}`
      res.send({code:1,url:file.url})
    })
  
    // 错误处理函数
    app.use(async (err, req, res, next) => {
       console.log(err)
      res.status(err.statusCode || 500).send({
        message: err.message
      })
    })
  }