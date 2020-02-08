module.exports = app => {
    const moment = require('moment')
    console.log('开始定时任务')
    function intervalFunc() {
        console.log(moment().format('YYYY-MM-DD HH:mm:ss')+':定时任务执行了');
      }
      
      //setInterval(intervalFunc, 10*1000);
    
  }