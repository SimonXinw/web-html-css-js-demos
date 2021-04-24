<?php
// 1.确定编码格式
header("Content-type:text/html;charset=utf8");
//2.接收get 或者 post的对象
$sex = $_GET['sex'];

// 3.连接数据库
$link = mysqli_connect('','root','','xw');

// 4.判断是否连接成功
if(mysqli_connect_error($link)){
    echo '数据库连接失败：'.mysqli_connect_error();
    die();
} else{
    // echo 'OK-数据库连接成功！';
}

// 5.设置字符编码
mysqli_set_charset($link,'utf8');

// 6.要执行的sql语句
$sql = "select * from user where sex='{$sex}'";

//7. 执行sql语句之后，返回结果集(资源类型resource)
$results = mysqli_query($link,$sql);

$rows = [];
while($arr = mysqli_fetch_assoc($results)){
    $rows[] = $arr;
}
// print_r($rows);//二维数组

$arrLen = count($rows);

if($arrLen > 0){//有数据
    echo json_encode($rows,JSON_UNESCAPED_UNICODE);//把数组转成json字符串，返回
} else {// 没有数据
    echo '你查询的数据没有!';
}

mysqli_close($link); // 关闭数据库连接

?>