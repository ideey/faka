var TmcClient = require('../index.js').TmcClient;

var tmcClient = new TmcClient('453509','5642f38e5840714d77beb0574447f204','default');

tmcClient.connect('ws://mc.api.daily.taobao.net/',
    function (message,status) {
        console.log(message);
    });