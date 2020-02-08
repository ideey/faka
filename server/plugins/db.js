module.exports = app => {
    const mongoose = require("mongoose")
    //mongoose.connect('mongodb://q.deey.top:57890/faka', {
    mongoose.connect('mongodb://fakaapi.idaay.com:57890/faka', {
      useNewUrlParser: true,
      useCreateIndex:true,
      useFindAndModify:false,
      auto_reconnect: true,
      poolSize: 10,
      useUnifiedTopology:true
    })  
    require('require-all')(__dirname + '/../models')
  }