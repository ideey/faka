module.exports = app => {
    const mongoose = require("mongoose")
    
    mongoose.connect('mongodb://127.0.0.1:57890/faka', {
      useNewUrlParser: true,
      useCreateIndex:true,
      useFindAndModify:false,
      auto_reconnect: true,
      poolSize: 10,
      useUnifiedTopology:true
    })  
    require('require-all')(__dirname + '/../models')
  }