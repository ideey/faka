module.exports = {
   outputDir: __dirname + '/../server/html/mobile',
   publicPath: process.env.NODE_ENV === 'production'
    ? '/m/'
    : '/' 
}