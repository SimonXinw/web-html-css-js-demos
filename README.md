<!--
 * @Author: your name
 * @Date: 2021-04-25 10:08:22
 * @LastEditTime: 2021-04-25 17:12:43
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web-js-demo\README.md
-->

# web-js-demo

这是用 原生 js 写的一些可供练习的逻辑的 demo

# 服务器上线

## 1.登录服务器

1. 直接去浏览器页面登录
2. 通过本地电脑的终端来登录

```javascript
$ ssh root@ip地址
```

3. 通过软件登录(window)
   MobaXterm

## 2.配置 Node.js 环境

1. 选择安装目录：cd /usr/local
2. 下载 NodeJs linux 包：wget https://npm.taobao.org/mirrors/node/v14.16.1/node-v14.16.1-linux-x64.tar.xz
   a. NodeJs 淘宝镜像地址：链接
   b. 更换版本的话，后续步骤中请都注意文件名修改问题
3. 解压：xz -d node-v14.16.1-linux-x64.tar.xz
4. 解压：tar -xvf node-v14.16.1-linux-x64.tar
5. 删除无用的 tar 文件：rm -rf node-v14.16.1-linux-x64.tar
6. 修改文件名字：mv node-v14.16.1-linux-x64 node
7. 配置环境变量，使 node 、npm、npx 命令在服务器中全局可用
   a. 编辑 /etc/profile 文件。使用命令 vim /etc/profile，
   b. 按下键盘的 [i]
   c. 按下方向键 [Down] 移动到最后一行，复制 export PATH=$PATH:/usr/local/node/bin
   d. 按下键盘的 [Esc]
   e. 输入键盘的 :wq (英文字符)
   f. 按下[Enter]
   g. 使配置生效：source /etc/profile
   h. 在任意目录下校验 node -v 是否可用

## 3.安装数据库

### 1.MongoDB

安装链接(可以翻译中文): https://docs.mongodb.com/manual/tutorial/install-mongodb-on-red-hat/

常用命令

```bash
# 启动服务，一次就好
$ service mongod start

# 停止服务
$ service mongod stop

# 查看服务状态
$ service mongod status

# 重启服务，在修改了一些 mongodb 的配置文件之后，需要重启服务
$ service mongod restart
```

本地电脑通过 Robo 3T 来连接服务器的 MongoDB

产生上面这个错误的问题是，服务器上的 MongoDB 有限制, 只允许服务器本地去连接。
解决这个问题，需要去修改服务器上 MongoDB 的配置文件，
文件是 /etc/mongod.conf

1. 将 bindIp: 127.0.0.1 修改为 bindIp: 0.0.0.0
2. 修改了配置文件，需要重启 MongoDB 服务

```
$ service mongod restart
```

3. 再通过本地 Robo 3T 试一试即可。

## 4.上线

将本地 Node 项目上传到服务器的某个目录下

1. 将 Node 项目中的 node_modules 文件夹先给删除掉。（不然上传过程将非常缓慢）
2. 下载一个远程传送文件的 ftp 工具。推荐使用 FileZilla
3. 在服务器的根目录下创建一个 projects 文件夹
4. 将项目上传至服务器的 /projects 目录下
5. 进入到服务器上的项目目录下，去安装依赖项（之前 node_modules 是删除了的）
   a. 可以先对 npm 做一个换源操作，让安装依赖时更快一些。
6. 启动项目，通过 node xxx.js 去启动即可
7. 访问项目，通过服务器公网 ip 地址加对应的端口号就好
   本地访问：http://localhost:3000
   上线访问：http://xxip:3000

## 5.使用 PM2 来守护进程

PM2 是 node 进程管理工具，可以利用他来简化很多 node 应用管理的繁琐任务，如性能监控、自动重启、负载均衡等。而且使用非常简单。

目前使用 node server.js 在服务器启动服务之后，不能随意去做其他的操作。

### 1.在服务器上全局安装

```
npm install pm2 -g
```

### 2.就可以使用 pm2 start 命令去替换 node 命令

```
node server.js    =>    pm2 start server.js
```

### 3. pm2 常用命令

```
# 启动
$ pm2 start app_name

# 停止
$ pm2 stop app_name|app_id

# 重启
$ pm2 restart app_name|app_id

# 删除
$ pm2 delete app_name|app_id

# 查看
$ pm2 list

# 查看日志（输出）
$ pm2 logs app_name|app_id
```

## 6.问题汇总

1. 思考，连接数据库时使用的是 localhost:27017 或者 127.0.0.1:27017 这个在上线之后需要修改么？

不需要修改。原因是这个是后端的 js 文件，指的就是服务器上的 MongoDB
