const http = require('http');
var url = require('url');

var hostName = '127.0.0.1';
var port = 3010;
  　　
http.createServer((req,res) => {
　　
    var queryJson = url.parse(req.url,true).query;
    var name = queryJson.name;
    var age = queryJson.age;
    var sex = queryJson.sex;
　  //支持中文显示
    res.writeHead(200, {
        "Content-Type": "text/html;charset=utf-8"
    });
  　　
　  　
    res.write(`<h1>服务器收到了表单请求</h1>`);
    res.write(`姓名:${name}
年龄:${age}
性别:${sex}`);
　　
　　
    res.end();
}).listen(port,hostName,()=>{
    console.log(`成功监听 http://${hostName}:${port}/`);
});