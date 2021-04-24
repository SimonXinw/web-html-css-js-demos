<?php
/*
****************************************************

  请求方式:  get

	url:	form.php

	参数：   user = 用户名
			 pass = 密码
		
	return:	'登陆成功'
			'账号密码不能为空'
			'账号错误'
			'密码错误'

****************************************************
*/
$user = $_GET["user"];
$pass = $_GET["pass"];

// $user = $_POST["user"];
// $pass = $_POST["pass"];

if ($user == "laowang" && $pass == "12345"){
	echo '登陆成功';
}else{
	if ($user == "" || $pass == "") {
		echo '账号密码不能为空';
	} else if ($user != "laowang"){
		echo '账号错误';
	}else if ($pass != "12345"){
		echo '密码错误';
	};
};

?>
