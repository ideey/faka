module.exports = app => {
    const express = require('express')
    const moment = require('moment')
    const Config = require('../models/Config')
    const AdminUser = require('../models/AdminUser')
    const assert = require('http-assert')
    const jwt = require('jsonwebtoken')
    const Sms = require('../models/Sms')
    const Core = require('@alicloud/pop-core')
    const router = express.Router({
      mergeParams: true
    })
    const client = new Core({
      accessKeyId: 'LTAI4FxKcqGBAmMnJRymeq4B',
      accessKeySecret: 'St0obtdGfa88JpzjjJDr0Vtow3bqcw',
      endpoint: 'https://dysmsapi.aliyuncs.com',
      apiVersion: '2017-05-25'
    });


    router.post('/getConfig',async (req,res)=>{
      console.log(req.user)
      const d = await Config.findOne({username:req.user.username})
      if(d){
        res.send({code:1,data:d})
      }else{
        res.send({code:-1,msg:'没有对应用户的配置信息'})
      }
    })
    
    router.post('/setConfig',async (req,res)=>{
      //console.log(req.body)
      req.body.username = req.user.username
      const d = await Config.updateOne({username:req.user.username},{$set:req.body},{upsert:true})
      res.send({code:1,data:'ok'})
    })
    const multer = require('multer')
    const upload = multer({ dest: __dirname + '/../images' })
    router.post('/postFile',upload.single('file'),async (req,res)=>{
        const file = req.file
        console.log(file)
        res.send({code:1,msg:'上传成功',fileName:file.filename})
    })
    const authMiddleware = require('../middleware/auth')
    app.use('/admin/api', authMiddleware(), router)   
    //app.use('/admin/api',  router)   
  
  
      //获取短信验证码   用阿里云发送验证码 同时把验证码保存进mongodb 系统大了之后再考虑保存进redis
  app.post('/admin/call/get_sms',async (req,res)=>{
    const now = moment().unix()
    const sms = await Sms.findOne({phone_num:req.body.phone_num}).sort({expriess_at:-1})
    if(sms&&sms.expriess_at&&((sms.expriess_at - now)>40)){
      assert(false,422,'验证码有效期为5分钟，不用重复获取')
    }

    const time = moment().format('YYYY-MM-DD HH:mm:ss')
    const expriess_at = now + 5*60  //5分钟有效期
    const Num = String(Math.random()).slice(2,6)
    const code =JSON.stringify( {code:Num})
    const params = {
      "RegionId": "default",
      "PhoneNumbers": req.body.phone_num,
      "SignName": "零零漆",
      "TemplateCode": "SMS_131355018",
      "TemplateParam": code
    }
    const requestOption = {
      method: 'POST'
    }
    client.request('SendSms', params, requestOption).then(async (result) => {
      if(result.Message==='OK'){
        const a = await Sms.create({
          phone_num:req.body.phone_num,
          sms_num:Num,
          time:time,
          expriess_at:expriess_at
        })
        res.send(result)
      }else{
        
        res.send(result)
      }
    }, (ex) => {
      res.send(ex);
    })
  })
  //用户注册
  app.post('/admin/call/reg',async (req,res)=>{
    const now = moment().unix()
    const user = req.body
    
    //个人使用，只能有一个管理员
    //const allUser = await AdminUser.find().countDocuments()
    //assert(allUser === 0 ,422,'已有管理员,不能注册')

    assert(/^[a-z][a-z0-9_]{5,14}$/.test(user.username),422,'用户名须为6-15位字母及数字组成')
    assert(user.password === user.checkPass,422,'两次密码不相同')
    //同一手机，同一用户名，同一邮箱不能再注册
    const thisOne = await AdminUser.find({$or:[{username:req.body.username},{phone_num:req.body.phone_num},{email:req.body.email}]})
    assert(thisOne.length===0,422,'同一手机|用户名|邮箱只能注册一次')
    //个人使用，不用短信验证注册
    //const sms = await Sms.findOne({phone_num:req.body.phone_num}).sort({expriess_at:-1})
    //assert(sms,422,'请获取短信验证码，并输入')
    //assert(sms.expriess_at>now,422,'短信验证码过期，请重新获取')
    //assert(sms.sms_num===req.body.sms_num,422,'验证码不正确，请重新输入')
    const model = await AdminUser.create(user)
    res.send({code:1,message:'ok'})
  })
  //用户登陆
  app.post('/admin/call/login', async (req, res) => {
    const { username, password } = req.body
    // 1.根据用户名找用户
    const user = await AdminUser.findOne({ username }).select('+password').populate('config')
    assert(user, 422, '用户不存在')
    //console.log(user)
    // 2.校验密码
    const isValid = require('bcryptjs').compareSync(password, user.password)
    //console.log(isValid)
    assert(isValid, 422, '密码错误')
    // 3.返回token
    const iat = moment().unix() 
    const token = jwt.sign({ id:user._id,iat:iat,username:user.username }, app.get('secret'),{expiresIn:'24h'})
    res.send({ token })
  })
  //重置用户名与密码
    // 错误处理函数
    app.use(async (err, req, res, next) => {
       console.log(err)
      res.status(err.statusCode || 500).send({
        message: err.message
      })
    })
  }