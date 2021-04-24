<?php

/*
****************************************************
 
	请求方式: get

	url:	baidu.php
	参数：   wd = 搜索关键字
		
	return:	'{s:['数据1','数据2'.。。。]}'
			 json字符串

****************************************************
*/

	header("Access-Control-Allow-Origin:*");

	$url='http://suggestion.baidu.com/su?wd=';//由服务器来获取数据
	// $url=$_GET['sc'];//页面传过来数据地址，由服务器去获取
	
	function getJSONStr($str){
		return substr($str,17);
	}
	
	function crul($key){
		global $url;
		$data = file_get_contents($url.$key);
		$data = getJSONStr($data);
		$data = str_replace("{q:\"","",$data);
		$data = str_replace("\",p:","{%aaa%}",$data);
		$data = str_replace(",s:[","{%aaa%}",$data);
		$data = str_replace("]});","",$data);
		$arr = explode("{%aaa%}",$data);
		$res = array();
		$res['q'] = iconv("GB2312","UTF-8",$arr[0]);

		if ($arr[1] == 'true'){
			$arr[1] = true;
		}else{
			$arr[1] = false;
		}

		$res['p'] = $arr[1];

		if (strlen($arr[2])>0){
			$arr[2] = substr($arr[2],1,-1);
			$arr[2] = str_replace("\",\"",",",$arr[2]);
			$arr[2] = iconv("GB2312","UTF-8",$arr[2]);
		}
		
		$res['s'] = explode(',',$arr[2]);
		echo json_encode($res);//json_encode()转换成json字符串
	}

	$key = $_REQUEST['wd'];
	crul($key);
?>