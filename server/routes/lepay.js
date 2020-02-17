module.exports = async app => {
    const express = require('express')
    const router = express.Router({  mergeParams: true})
    const moment = require('moment')
    const axios = require('axios')
    const assert = require('http-assert')
    const currency = require('currency.js')
    const mongoose = require('mongoose')
    const Type = require('../models/Type')
    const Goods = require('../models/Goods')
    const Kami = require('../models/Kami')
    const Order = require('../models/Order')
    const authMiddleware = require('../middleware/auth')
    const PayConfig = require('../models/PayConfig')
    const Base64 = require('js-base64').Base64
    const md5 = require('md5.js')
    const  Store_Id = '2018102410423069218' //门店ID

    //生成Secrst
    function get_StoreSecrst(){
        let a = (new md5().update(Store_Id).digest('hex'))
        let b = Store_Id+a
        let c = Base64.encode(b)
        return c
    }
    //生成Store-Sign  q为排序号的参数字符串
    function get_sign(a){
        const b = a+'&key='+ get_StoreSecrst()
        const c = (new md5().update(b).digest('hex'))
        const d = c.toUpperCase()
        return d
    }
    //请求支付连接
    router.post('/get_pay_link',async(req,res)=>{
        const {_id,money,pay_type} = req.body
        assert(_id,442,'需要订单号')
        assert(money,442,'需要金额')
        //store_id  门店编号 total_amount:付款金额  order_no 外部订单号 merch_id收银员id(暂时不需要)
        const a = `order_no=${_id}&store_id=${Store_Id}&total_amount=${money}`
        const sign = get_sign(a)
        const post_data = {
            order_no:_id,
            store_id:Store_Id,
            total_amount:money
        }
         axios.post('https://isv.hczypay.com/api/device/web/qrpay',post_data,{
            headers:{
                'Content-Type':"application/json;charset=utf-8",
                'Store-Id':Store_Id,
                'Store-Sign':sign
            }
        }).then(async (r)=>{
            if(r.data.status===1&&r.data.data.trade_status==='NOTPAY'){
                //支付连接及支付方式,写入订单信息
                const d = await Order.findByIdAndUpdate(_id,{
                    pay_link:r.data.data.url,
                    pay_type:pay_type
                })
                res.send({code:1,data:r.data})
            }else{
                res.send({code:0,msg:r.data.msg,data:r.data})
            }
        }).catch(e=>{
            res.send(e.data)
        })
        
    })
    //查询付款状态
    router.post('/query_status',async(req,res)=>{
        const {_id,money,goods_id} = req.body
        assert(_id,442,'需要订单号')
        const a = `order_no=${_id}&store_id=${Store_Id}`
        const sign = get_sign(a)
        const post_data = {
            order_no:_id,
            store_id:Store_Id
        }
        const d = await axios.post('https://isv.hczypay.com/api/device/web/payquery',post_data,{
            headers:{
            'Content-Type':"application/json;charset=utf-8",
            'Store-Id':Store_Id,
            'Store-Sign':sign
            }
        })
        //这里要判断是否支付成功,处理业务
        const info = d.data
        if(info.status===1){
            if(info.data.trade_status==='SUCCESS'){
                //查找订单信息
                const o = await Order.findById(_id)
                if(o.status===1&&(!o.kami)){  //这里的逻辑是否考虑status为4的情况?后面再看
                    //找一张合适的卡密
                    const k = await Kami.findOne({
                        goods_id:mongoose.Types.ObjectId(o.goods_id),
                        status:1,
                        active:1
                      })
                      if(k){
                        //改变卡密状态
                        const k1 = await Kami.findByIdAndUpdate(k._id,{status:3})
                        //修改订单信息
                        const o1 = await Order.findByIdAndUpdate(o._id,{
                            pay_good_info:info,
                            status:2,
                            kami_id:k._id,
                            kami:k.kami,
                            //pay_type:'alipay_web',
                            pay_time:moment().format('YYYY-MM-DD HH:mm:ss')
                          })
                      }else{
                             //无合适卡密-无库存 标记订单
                            const o1 = await Order.findByIdAndUpdate(o._id,{
                                pay_good_info:info,
                                status:4,
                                //pay_type:'alipay_web',
                                pay_time:moment().format('YYYY-MM-DD HH:mm:ss')
                            })
                      }
                }else{
                    console.log(_id,'乐支付,支付成功,但订单已经有卡密')
                }
            }
            res.send(info)
        }else{
            res.send(info)
        }


        
    })

    //触发自动查询乐付订单  15次，每次间隔4s
    router.post('/auto_query_status',async(req,res)=>{
        const {_id} = req.body
        async function get_lepay_status(_id,timeRun){
            console.log('执行乐付自动查询',timeRun)
            const d = await Order.findById(_id)
            if(d.status ===1 ){
                await axios.post('http://127.0.0.1:8889/lepay/api/query_status',{_id:_id})
            }else{return 0}
        }
        let timeRun = 0
        const interval = setInterval(function(){
            get_lepay_status(_id,timeRun)
            timeRun++
            if(timeRun === 15){
                clearInterval(interval)
            }
        },4000)
        res.send({code:1,msg:'接收到自动查询任务'})
    })
    app.use('/lepay/api', router)   



      
    // 错误处理函数
    app.use(async (err, req, res, next) => {
       console.log(err)
      res.status(err.statusCode || 500).send({
        message: err.message
      })
    })
  }