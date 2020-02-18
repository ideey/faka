module.exports = app => {
    const mongoose = require("mongoose")
    mongoose.connect(process.env.MONGODB, {
      useNewUrlParser: true,
      useCreateIndex:true,
      useFindAndModify:false,
      auto_reconnect: true,
      poolSize: 10,
      useUnifiedTopology:true
    })  
    require('require-all')(__dirname + '/../models')
  }