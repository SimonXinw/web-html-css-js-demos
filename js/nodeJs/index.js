// 引入模块
var http = require('http');
var fs = require('fs')
// 创建http 服务
var server = http.createServer();

// 监听客户端请求
// 1.返回文字信息
server.on('request', (req,res) => {
    // 设置响应头 响应为纯文本
    res.setHeader("Content-type","text/plain;charset=utf-8"); 

    //  处理客户端请求逻辑
    console.log(); 
    // 1.返回文字信息
    res.end(req.method); // 必须结束，不然浏览器会被刮起
    
})

// 2.返回一个html页面
/* 不同于 apache node.js 没有web容器的概念，也就是说没有根目录，没有文件夹静态路径的概念 */
var server = http.createServer( (req, res) => {
    // node 必须使用 ./index.js 路径写法  返回文件
    fs.readFile('../缓冲运动.html',(err,data) =>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        if (!err) {
            res.end(data);
        }else {
            res.end('html not found');
        }
    });
})

//3.返回路由页面
var server = http.createServer(function(req, res){
    //http://127.0.0.1:3007/index_01.html    req.url =/index_01.html
    //http://127.0.0.1:3007/index_02.html    req.url =/index_02.html
      var url = req.url;
      //如果你愿意、也可以手写url以隐藏文件路径
      //比如
      if (req.url == '/lalala') url = './缓冲运动.html';
        fs.readFile('.'+url,(err,data) =>{
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/html');
            if (!err) {
                res.end(data);
            }else {
                res.end('html not found');
            }
        });
    });


// 启动http 服务，监听 3000 端口
server.listen(3000, () => {
    console.log('服务启动成功，监听3000端口')
})