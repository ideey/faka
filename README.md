# IDeeY发卡系统


## 简介
> IDeeY发卡系统，定位于个人业务，对接目前主流支持个人收款的接口，可用于个人出售一些虚拟商品，比如点卡/会员卡/激活码等。


## 技术栈
> ### 后端:
>> 采用 node.js + express + mongodb   （源码中的server目录）
> ###  管理后端:
>> 采用 vue + element （源码中的admin目录）
> ### 商品PC端：
>> 采用 vue + element (源码中的web目录)
> ### 商品移动端：
>> 采用 vue + vant-ui  (源码中的mobile目录)
> ### 小程序端:
>> 微信小程序对虚拟物品严格限制，暂时没有打算出
___

## 后端环境搭建:
> 后端不是常见的php+mysql环境，是node.js + mongodb环境。
 ### 简易node安装 (以下安装在centOS7.2上测试ok，更多环境请自行搜索搞定,也类似)，
> [node安装参考教程](https://www.cnblogs.com/Logan626/p/11191894.html)
>> 1. 用ssh登陆自己的主机，假定为root用户，登陆之后目录在 /root
>> 2. 在node.js的官网，找到适用于centOS的文件,选LTS下面的Linux Binaries (x64)项目下的64位，右键点击复制连接 
>> 3. 在主机上:  `wget https://nodejs.org/dist/v12.16.1/node-v12.16.1-linux-x64.tar.xz`
>> 4. 解压文件 : `tar -xvf node-v12.16.1-linux-x64.tar.xz`
>> 5. 文件夹名改短点-方便 `mv node-v12.16.1-linux-x64 node-v12`  ,移动到local目录 ` mv node-v12 /usr/local/` (非必须，为了方便统一管理)
>> 6. 编辑系统配置文件 `vim /etc/profile`
>> 7. 在这个文件的最下面加入:`export PATH=/usr/local/node-v12/bin:$PATH` (具体路径看你把node-v12放到哪里了,做相应修改),保存退出。关于vim的使用请自行搜索，很简单，或是在宝塔下面操作也方便。
>> 8. 使修改生效 `source /etc/profile` 
>> 9. 测试 `node -v`及`npm -v`，分别输出:  `v12.16.1`,`6.13.4`,安装成功。
___
> node的二进制包安装总结就是三步,各种教程也都是如此(编译安装不算)
>> 1. 下载，解压，把文件放到某个熟悉的地方
>> 2. 把文件夹中bin目录中的node  npm 等命令放到系统变量中，这样运行时才可以找到。这里有两种方法:
>>> + 用软连接ln -s把bin下面这些命令连接到当前的环境变量目录中，比如/usr/bin中。
>>> + 修改/etc/profile文件，在其中把bin整个目录都加入到环境变量，我推荐这个法子，因为以后使用node时可能这个目录会增加别的命令，比如现在还有npx,以及后面部署用到的pm2工具。这样就不用为每个命令单独软连接。
>> 3. 使用环境变量生效，测试ok


 ### mongodb数据库的安装: [官方安装教程点此](https://docs.mongodb.com/master/tutorial/install-mongodb-on-red-hat/)  注意选当前最新稳定版本为4.2
> #### 上面的官方教程中有各种Linux系统下的安装方式，翻译一下很明白。以下为centOS上的简易说明：
>> 1. 创建mongodb的yum源文件 `vim /etc/yum.repos.d/mongodb-org-4.2.repo`
>> 2. 在里面输入以下内容，并保存退出
>>> ```
>>> [mongodb-org-4.2]
>>> name=MongoDB Repository
>>> baseurl=https://repo.mongodb.org/yum/redhat/$releasever/mongodb-org/4.2/x86_64/
>>> gpgcheck=1
>>> enabled=1
>>> gpgkey=https://www.mongodb.org/static/pgp/server-4.2.asc
>>> ```
>> 3. 安装： `sudo yum install -y mongodb-org`
>> 4. 安装之后 启动: `sudo systemctl start mongod`
>> 5. 开机启动:   `sudo systemctl enable mongod`
>> 6. 另外的一些操作命令,停止:`sudo systemctl stop mongod`
>> 7. 查看mongodb是否启动成功,服务端口是否打开： `ss -ntl`,如果输出中有` 127.0.0.1:27017`说明服务启动，端口打开.

#### nginx的安装 [参考教程](https://blog.csdn.net/sqlquan/article/details/101099850)
> + 如果有宝塔环境,或是lnmp环境，那nginx已经ok了，只要做相应配置。
> + 单独安装nginx，也很简单:` sudo yum -y install nginx` （删除nginx为: ` sudo yum remove nginx`）
> + `ss -ntl`看80端口是否打开，有就ok了

#### 安装TSL证书服务（Let's Encrypt）
> + 非必须，但强烈建议上tsl，开启https，毕竟也是免费的。
> + 安装acme.sh ` curl  https://get.acme.sh | sh `
> + 安装的时候会有三条红色字提示，让我们先安装`socat`，但不用管，因为我们已经安装了nginx，用nginx验证就行了。
#### 安装git，用于下载源码到服务器
> + `yum install git -y`
#### 安装pm2，用于部署服务端
> + `npm install pm2 -g`


## 安装步骤
1. 解析两个域名到主机。为了部署方便及以后的扩展，采用双域名。一个为前端访问域名，一个为后端api接口域名。
> 比如`faka.mm23k.cn` 为前端访问域名,`fakaapi.mm23k.cn`为后端api域名
### 服务端的安装
2. 下载源码，修改服务端服务
> + 我习惯放在`/home/www`目录下。进入home目录:`cd /home `, 列出目录中的文件及文件夹:`ls`,如果home中没有`www`目录就新建一个:`mkdir www`,然后进入:`cd www`.
> + 下载 `git clone https://github.com/ideey/faka.git`，这个过程视网络情况而定，如果是国内服务，可能比较慢。也可以手动下载好了，再上传到服务器。
> + 进入服务器目录 `cd /home/www/faka/server`，修改mongodb连接地址 `vim pm2.config.js`，保存退出
>>```
>>{
>>    name: 'faka', //这里可以修改，是pm2启动后的项目名称,意义不大
>>    script: 'index.js',  //启动脚本名称,不要修改
>>    cwd:'/home/www/faka/server', //这是服务端的目录，根据情况修改
>>    env_production: {
>>      NODE_ENV: 'production',
>>      MONGODB:'mongodb://127.0.0.1:27017/faka' //如果你修改了mongdb的默认端口这里也做相应修改。faka就是数据库的名称，也可以修改。(faka这个数据库不用事先建立,与mysql不同)
>>      SECRET:"i8efnj98fjeEfJFE8fnza09"  //修改为自己的随机安全字符串 可以为大小写字母及数字 16-32位
>>  } 
>>}
>>```
3.  启动服务端: `pm2 start pm2.config.js`
4.  `ss -ntl`查看8889端口是否打开，8889端口打开，服务端就起来了。
> pm2相关命令：
>> + `pm2 ls` 查看应用状态
>> + `pm2 stop 0` 停止id为0的应用
>> + `pm2 restart 0` 重启id为0的应用

### 前端的安装
+ 进入项目目录 `cd /home/www/faka`
+ 在三个前端项目文件夹admin web mobile下都有一个`.env.production`文件,把里面的`VUE_APP_API_URL=https://fakaapi.mm23k.cn`修改为你的后端api接口域名,最后面不要加/，注意根据你是否配置https选择协议前缀。`http/https`  (三个都要改)
+ **以下三步按顺序，不能乱，否则会造成生面的页面缺失。(一定要先构建PC端页面)**
+ 进入PC端项目`cd /home/www/faka/web`,安装依赖:`npm install`,构建页面:`npm run build` (时间根据服务器配置而定)
+ 进入管理端项目`cd /home/www/faka/admin`,安装依赖：`npm install`,构建页面:`npm run build`
+ 进入移动端项目`cd /home/www/faka/mobile`,安装依赖:`npm install`,构建页面: `npm run build`
___
## 前端/后端部署在nginx后
### 生成域名证书 (不需要可以跳过)
+ `acme.sh --issue -d faka.mm23k.cn --webroot /usr/share/nginx/html/` 按自己的域名做修改，特别注意webroot参数是一个目录，是一个可以在当前nginx运行时访问到的目录，也就是网站根目录。acme.sh会向里面放入一些文件让Let's Encrypt来访问以此验证服务器。因为我的nginx是默认安装的，根目录就是`/usr/share/nginx/html/`，如果你是lnmp或宝塔之类，要根据情况修改。当然lnmp与宝塔默认就带了自动安装Let's Encrypt的服务，会更方便。
+ `acme.sh --issue -d fakaapi.mm23k.cn --webroot /usr/share/nginx/html/`
+ 以上两步后这两个域名的tsl证书，就会在`/root/.acme.sh/`目录中
### 安装证书 (这一步的实际意义是为了以后更新证书后nginx可以自动重启生效)
+  新建存放证书的目录： `mkdir -p /etc/nginx/ssl/fakaapi.mm23k.cn`
+  新建存放证书的目录:  `mkdir -p /etc/nginx/ssl/faka.mm23k.cn`
+  安装: `acme.sh --installcert -d fakaapi.mm23k.cn --key-file /etc/nginx/ssl/fakaapi.mm23k.cn/key.pem --fullchain-file /etc/nginx/ssl/fakaapi.mm23k.cn/cert.pem --reloadcmd "service nginx force-reload" `
+  安装 `acme.sh --installcert -d faka.mm23k.cn --key-file /etc/nginx/ssl/faka.mm23k.cn/key.pem --fullchain-file /etc/nginx/ssl/faka.mm23k.cn/cert.pem --reloadcmd "service nginx force-reload" `
+ 以上步骤将两个域名的ssl证书放到了/etc/nginx/ssl目录下，方便配置，acme.sh重点提示配置时不要直接使用.acme.sh目录中的文件，而是采用安装的方式把证书复制到别处。
+ 为ssl生成一个交易密钥:`openssl dhparam -out /etc/nginx/ssl/dhparam.pem 2048` (要一定时间,看配置)

### 配置后端nginx。
> 相当于nginx反向代理node的8889端口服务。
> 进入nginx虚拟主机配置目录新建一个配置:`cd /etc/nginx/conf.d/`,`vim fakaapi.mm23k.cn.conf`,内容如下:
```
server
    {
        listen 80;
        server_name fakaapi.mm23k.cn ; #改为你的后端域名
        index index.html index.htm index.php default.html default.htm default.php;
        location / {
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forward-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $http_host;
        proxy_set_header X-Nginx-Proxy true;
        proxy_pass http://127.0.0.1:8889;    #如果你修改了服务端默认端口，记得这里一起修改
        proxy_redirect off;
        #return 301 https://$server_name$request_uri; #如果强制启用https，就把这一行打开
        }
    }
server
    {
        listen 443 ssl http2;
        #listen [::]:443 ssl http2;
        server_name fakaapi.mm23k.cn;  #改为你的后端域名
        index index.html index.htm index.php default.html default.htm default.php;
        ssl on;
        ssl_certificate /etc/nginx/ssl/fakaapi.mm23k.cn/cert.pem;   #注意路径
        ssl_certificate_key /etc/nginx/ssl/fakaapi.mm23k.cn/key.pem;  #注意路径
        ssl_session_timeout 5m; 
        ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
        ssl_prefer_server_ciphers on;
        ssl_ciphers "EECDH+CHACHA20:EECDH+CHACHA20-draft:EECDH+AES128:RSA+AES128:EECDH+AES256:RSA+AES256:EECDH+3DES:RSA+3DES:!MD5";
        ssl_session_cache builtin:1000 shared:SSL:10m;
        ssl_dhparam /etc/nginx/ssl/dhparam.pem;  #注意路径

        location / {
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forward-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $http_host;
        proxy_set_header X-Nginx-Proxy true;
        proxy_pass http://127.0.0.1:8889;   #如果你修改了服务端默认端口，记得这里一起修改
        proxy_redirect off;
    }
        access_log off;
    }
```

### 配置前端页面的nginx:
> 就是与平时的配置一样，根目录为 `/home/www/faka/server/html` (三个前端页面构建好后，都会放在这个目录)
> 进入nginx的虚拟主机目录，再新建一个配置文件:` vim /etc/nginx/conf.d/faka.mm23k.cn`,内容如下,根据实际情况修改:
```
server
    {
        listen 80;
        server_name  faka.mm23k.cn; #注意域名,这是前端访问域名
        index index.html index.htm index.php default.html default.htm default.php;
        root  /home/www/faka/server/html;
        #return 301 https://$server_name$request_uri; #这一条强制启用https，访问http会强制跳转到https
        location ~ .*\.(gif|jpg|jpeg|png|bmp|swf)$
        {
            expires      30d;
        }
        location ~ .*\.(js|css)?$
        {
            expires      12h;
        }

        location ~ /.well-known {
            allow all;
        }
        location ~ /\.
        {
            deny all;
        }
        access_log off;
    }

server
    {
        listen 443 ssl http2;
        server_name faka.mm23k.cn ; #注意域名,这是前端访问域名
        index index.html index.htm index.php default.html default.htm default.php;
        root  /home/www/faka/server/html; #注意目录
        ssl on;
        ssl_certificate /etc/nginx/ssl/faka.mm23k.cn/cert.pem;  #注意路径
        ssl_certificate_key /etc/nginx/ssl/faka.mm23k.cn/key.pem; #注意路径
        ssl_session_timeout 5m;
        ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
        ssl_prefer_server_ciphers on;
        ssl_ciphers "EECDH+CHACHA20:EECDH+CHACHA20-draft:EECDH+AES128:RSA+AES128:EECDH+AES256:RSA+AES256:EECDH+3DES:RSA+3DES:!MD5";
        ssl_session_cache builtin:1000 shared:SSL:10m;
        # openssl dhparam -out /usr/local/nginx/conf/ssl/dhparam.pem 2048
        ssl_dhparam /etc/nginx/ssl/dhparam.pem; #注意路径

        location ~ .*\.(gif|jpg|jpeg|png|bmp|swf)$
        {
            expires      30d;
        }
        location ~ .*\.(js|css)?$
        {
            expires      12h;
        }
        location ~ /.well-known {
            allow all;
        }
        location ~ /\.
        {
            deny all;
        }
        access_log off;
    }
```

> 重启nginx让配置生效 `systemctl restart nginx`

## 注册管理员
> 在`https://faka.mm23k.cn/admin/`(域名换为你自己的)中注册管理员,只能注册一个，之后不能再注册。个人业务,不支持普通用户注册。普通用户直接在前端用下单时的联系方式与查询密码，查询订单信息。
## 系统更新
> + 进入项目目录:`cd /home/www/faka`
> + 拉取代码： `git pull`
> + 如果只有服务端更新 : `pm2 restart ./server/pm2.config.js`
> + 如果前端页面有更新,在对应项目中重新构建 ,例如管理端有更新:`cd /home/www/faka/admin`,`npm run build`
# 安全说明
> + 强烈推荐使用https
> + 不要开放mongodb端口外网访问权限.除非你确定知道自己在做什么。

