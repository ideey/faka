module.exports = {
   outputDir: __dirname + '/../server/html/admin',
   publicPath: process.env.NODE_ENV === 'production'
    ? '/admin/'
    : '/' ,
   productionSourceMap: false
}