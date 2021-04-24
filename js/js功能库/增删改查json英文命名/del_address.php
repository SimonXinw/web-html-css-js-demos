<?php
	$name = $_GET['name'];
	if(!$name){
		echo "<script language=\"JavaScript\">\r\n";
		echo " alert(\"您没有选择姓名\");\r\n";
		echo " window.location.href='./index.php';\r\n";
		echo "</script>";
		exit;
	}

	$add_json = file_get_contents('./address.json');
	$address_arr = json_decode($add_json,true);

	foreach($address_arr as $key=>$val){
		foreach($val as $k=>$v){
			if($name==$v){
				unset($address_arr['address'][$k]);
			}
		}
	}
	
	$ar = $address_arr["address"];
	$ars = array_values($ar);
	$address_arr['address'] = $ars;
	$arr_json = json_encode($address_arr,JSON_UNESCAPED_UNICODE);

	if(file_put_contents("./address.json", $arr_json)){
		echo "<script language=\"JavaScript\">\r\n";
		echo " alert(\"删除成功\");\r\n";
		echo " window.location.href='./index.php';\r\n";
		echo "</script>";
	}else{
		echo "<script language=\"JavaScript\">\r\n";
		echo " alert(\"删除失败\");\r\n";
		echo " window.location.href='./index.php';\r\n";
		echo "</script>";
	}
?>
