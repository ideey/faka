module.exports = async app => {
    const express = require('express')
    const router = express.Router({  mergeParams: true})
    const moment = require('moment')
    const assert = require('http-assert')
    const currency = require('currency.js')
    const mongoose = require('mongoose')
    const Type = require('../models/Type')
    const Goods = require('../models/Goods')
    const Kami = require('../models/Kami')
    const Order = require('../models/Order')
    const authMiddleware = require('../middleware/auth')
    const PayConfig = require('../models/PayConfig')
    const AlipaySdk = require('alipay-sdk').default
    const AlipayFormData = require('alipay-sdk/lib/form').default
    const alipay_web = await PayConfig.findOne({pay_type:'alipay_web'})
    const alipaySdk = new AlipaySdk({
      appId: alipay_web.pay_info.APPID,
      privateKey: alipay_web.pay_info.alipay_private_key,
      alipayPublicKey : alipay_web.pay_info.alipay_pub_key,
    }) 
    const API_URL = process.env.API_URL
    //保存支付设置
    router.post('/set_pay',authMiddleware(),async(req,res)=>{
      const {pay_type,pay_info} = req.body
      const d = await PayConfig.findOneAndUpdate({pay_type:pay_type},
        {pay_type,pay_info},{upsert:true,new:true})
      res.send({code:1,data:d})
    })
    //获取配置信息
    router.post('/get_pay',authMiddleware(),async(req,res)=>{
      const {pay_type} = req.body
      const d = await PayConfig.findOne({pay_type:pay_type})
      res.send({code:1,data:d})
    })

    //请求支付连接 web
    async function get_alipay_web_link(outTradeNo,money,subject,passback_params){
      const formData = new AlipayFormData()
      formData.setMethod('get');
      formData.addField('notifyUrl', API_URL+'/alipay/api/alipay_note');
      formData.addField('return_url', API_URL+'/alipay/api/sync_note');
      formData.addField('bizContent', {
        outTradeNo: outTradeNo,
        productCode: 'FAST_INSTANT_TRADE_PAY',
        totalAmount: money,
        subject: subject,
        timeout_express:'10m',
        passback_params:passback_params,
        //qr_pay_mode:0
      })
      const result = await alipaySdk.exec(
        'alipay.trade.page.pay',
        {},
        { formData: formData },
      )
      //支付连接及 支付过期时间写入订单信息
      const t = await Order.findByIdAndUpdate(outTradeNo,{
        pay_link:result,
        pay_bad_end_time:Date.now() + 9*60*1000, //9分钟过期
        pay_type:passback_params
      })
      return {code:1,data:result};
    }
    //请求支付宝web支持连接，返回给客户端，跳转
    router.post('/get_alipay_web_link',async(req,res)=>{
      const {_id,goods_name,money,pay_type} = req.body
      const d = await get_alipay_web_link(_id,money,goods_name,pay_type)
      res.send(d)
    })


    //请求支付链接 mobile
    async function get_alipay_mobile_link(outTradeNo,money,subject,passback_params){
      const formData = new AlipayFormData()
      formData.setMethod('get');
      formData.addField('notifyUrl', API_URL+'/alipay/api/alipay_note');
      formData.addField('return_url', API_URL+'/alipay/api/sync_note');
      formData.addField('bizContent', {
        outTradeNo: outTradeNo,
        productCode: 'QUICK_WAP_WAY',
        totalAmount: money,
        subject: subject,
        timeout_express:'10m',
        passback_params:passback_params,
        //qr_pay_mode:0
      })
      const result = await alipaySdk.exec(
        'alipay.trade.wap.pay',
        {},
        { formData: formData },
      )
      //支付连接及 支付过期时间写入订单信息
      const t = await Order.findByIdAndUpdate(outTradeNo,{
        pay_link:result,
        pay_bad_end_time:Date.now() + 9*60*1000, //
        pay_type:passback_params
      })
      return {code:1,data:result};
    }
    //请求支付宝moble支付链接，返回客户端,跳转
    router.post('/get_alipay_mobile_link',async(req,res)=>{
      const {_id,goods_name,money,pay_type} = req.body
      const d = await get_alipay_mobile_link(_id,money,goods_name,pay_type)
      res.send(d)
    })
    //主动检测订单支付状态
    router.post('/check_pay_status',async(req,res)=>{
      const result = await alipaySdk.exec(
        'alipay.trade.query',
          { 
            notifyUrl: API_URL+'/alipay/api/alipay_note',
            bizContent: {
              out_trade_no: req.body._id
          }
        },
      )
      if(result.code==='10000'&&result.msg==='Success'){
        if(result.tradeStatus==='TRADE_SUCCESS'){
          const d = await Order.findById(result.outTradeNo)
          //判断订单是否已经更新过卡密及状态
          if(d.status===1&&(!d.kami)){
                //找一张合适的卡密
                const k = await Kami.findOne({
                  goods_id:mongoose.Types.ObjectId(d.goods_id),
                  status:1,
                  active:1
                })
                if(k){
                    //改变卡密状态   这里要用事务
                    const k1 = await Kami.findByIdAndUpdate(k._id,{status:3})
                    //卡的信息写入订单中 支付信息写入订单中
                    const o1 = await Order.findByIdAndUpdate(d._id,{
                      pay_good_info:req.body,
                      status:2,
                      kami_id:k._id,
                      kami:k.kami,
                      //pay_type:'alipay_web',
                      pay_time:moment().format('YYYY-MM-DD HH:mm:ss')
                    })
                }else{
                  //无合适卡密-无库存 标记订单
                  const o1 = await Order.findByIdAndUpdate(d._id,{
                    pay_good_info:req.body,
                    status:4,
                    //kami_id:k._id,
                    //kami:k.kami,
                    pay_type:'alipay_web',
                    pay_time:moment().format('YYYY-MM-DD HH:mm:ss')
                  })
                }
          }else{
            console.log('主动检测订单-支付成功,但订单已是"已支付状态"：')
            console.log(d._id)
          }

        }else{
          //非支付成功状态的订单，返回支付宝信息,由客户端处理
        }
      }
      res.send({code:1,data:result})
    })
    
    app.use('/pay/api', router)   

    //支付宝付款后接收通知 异步
    app.post('/alipay/api/alipay_note',async (req,res)=>{
      const verify = alipaySdk.checkNotifySign(req.body);
      if(verify){
        
        console.log('验签成功:')
        //console.log(req.body)
        if(req.body.trade_status==='TRADE_SUCCESS'){
          const d = await Order.findById(req.body.out_trade_no)
          if(d){
            if(currency(d.money).value === currency(req.body.total_amount).value){
              res.send('success')
              //支付成功后的业务处理

              //判断订单是否手动处理过
              if(d.status===1 && !d.kami){
                //找一张合适的卡密
                const k = await Kami.findOne({
                  goods_id:mongoose.Types.ObjectId(d.goods_id),
                  status:1,
                  active:1
                })
                if(k){
                    //改变卡密状态   这里要用事务
                    const k1 = await Kami.findByIdAndUpdate(k._id,{status:3})
                    //卡的信息写入订单中 支付信息写入订单中
                    const o1 = await Order.findByIdAndUpdate(d._id,{
                      pay_good_info:req.body,
                      status:2,
                      kami_id:k._id,
                      kami:k.kami,
                      //支付方式在返回支付连接时写入,订单后续不能更新付款方式
                      //pay_type:req.body.passback_params,  
                      pay_time:moment().format('YYYY-MM-DD HH:mm:ss')
                    })
                }else{
                  //无合适卡密-无库存 标记订单
                  const o1 = await Order.findByIdAndUpdate(d._id,{
                    pay_good_info:req.body,
                    status:4,
                    //kami_id:k._id,
                    //kami:k.kami,
                    //pay_type:'alipay_web',
                    pay_time:moment().format('YYYY-MM-DD HH:mm:ss')
                  })
                }

                }else{
                  console.log('接收到异步通知,验签成功,但订单已是"已支付状态"：')
                  console.log(d._id)
                }
 
            }else{
              res.send('failure')
              console.log(req.body)
              console.log('支付金额不对')
            }
          }else{
            res.send('failure')
            console.log(req.body)
            console.log('无此订单号')
          }
        }else{
          console.log('非TRADE_SUCCESS通知')
          console.log(req.body)
        }
      }else{
        res.send('failure')
        console.log('验签失败:')
        console.log(req.body)
      }
  })
      //接收支付宝支付信息同步通知
    app.get('/alipay/api/sync_note',async (req,res)=>{
        console.log('同步通知')
        let id = req.query.out_trade_no
        let pay_type = req.query.passback_params
        if(pay_type === 'alipay_web'){
          res.send(`<html><head><title>支付结果</title><script>window.setTimeout("window.location='${API_URL}/#/order_pay_good/${id}'",2100);</script></head><body>支付结果,2秒后跳转到支付订单页面</body></html>`)
        }else if(pay_type === 'alipay_mobile'){
          res.send(`<html><head><title>支付结果</title><script>window.setTimeout("window.location='${API_URL}/mobile/#/order_pay_good/${id}'",2100);</script></head><body>支付结果,2秒后跳转到支付订单页面查看</body></html>`)
        }else{
          res.send('请返回订单列表中查看支付结果..')
        }
      })

      
    // 错误处理函数
    app.use(async (err, req, res, next) => {
       console.log(err)
      res.status(err.statusCode || 500).send({
        message: err.message
      })
    })
  }