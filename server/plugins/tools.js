module.exports =  {
    
    getElofNum:function(arr1,n){
        const arr = [...arr1]
        let arr_length = arr.length
        if(arr_length<=n){
            return arr
        }else{
            const a = []
            for(let i =0;i<n;i++){
                let rand = Math.floor(Math.random()*arr_length)
                a.push(arr[rand])
                arr.splice(rand,1)
                arr_length --
            }
            return a
        }
    },
     getClientIp : function (req) {
        return req.headers['x-real-ip']  ||
        req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
      }
  
    }