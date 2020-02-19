module.exports = {
   outputDir: __dirname + '/../server/html',
   publicPath: process.env.NODE_ENV === 'production'
    ? '/web/'
    : '/' ,
    productionSourceMap: false
}