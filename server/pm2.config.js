module.exports = {
    apps : [
        {
            name: 'faka', //发卡系统
            script: 'index.js',
            cwd:'/home/www/faka/server',
            //args: 'one two',
            instances: 1,
            autorestart: true,
            watch: false,
            max_memory_restart: '100M',
            env: {
            NODE_ENV: 'development',
            MONGODB:'mongodb://127.0.0.1:27017/faka'
            },
            env_production: {
            NODE_ENV: 'production',
            MONGODB:'mongodb://127.0.0.1:27017/faka'
            }
        },
    ]
}