function ajax(option){
    // 1.创建XMLHttpRequest对象(数据交互对象)
    if (window.XMLHttpRequest) {
        var xhr = new XMLHttpRequest();
    } else {
        var xhr = ActiveXObject('Microsoft.XMLHTTP');//ie 5 6
    }
    // data -> 'a=123&b=456'
    if (option.type == 'get' || option.type == 'GET') {
        // 2.打开与服务器的链接
        xhr.open(option.type,option.url + '?'+ option.data + '&_='+new Date().getTime(),true);//解决缓存
        // 3.发送请求
        xhr.send(null);//get请求
    } else if (option.type == 'post' || option.type == 'POST'){
        // 2.打开与服务器的链接
        xhr.open(option.type,option.url,true);//解决缓存
        // 模拟表单form的post方式提交数据，在send之前设置
        xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
        // 3.发送请求
        xhr.send(option.data);//post请求
    } else {
        alert('目前只支持get和post请求方式!');
    }

    // 4.等待服务的响应
    xhr.onreadystatechange = function (){
        // console.log(xhr.readyState);//2 3 4
        if (xhr.readyState == 4) {//请求完成
            if (xhr.status == 200) {//请求成功
                option.success(xhr.responseText);
            }else {//请求失败
                option.failed(xhr.status);
            }
        }
    }
}