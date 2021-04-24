<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<title>黑名单地址添加</title>
</head>
<?php
	if(isset($_GET['sub'])){
		$name = $_GET["name"];
		if(!$name){
			echo "<script language=\"JavaScript\">\r\n";
			echo " alert(\"地址不能为空\");\r\n";
			echo " window.location.href='./add_address.php';\r\n";
			echo "</script>";
			exit;
		}
		$add_json = file_get_contents('./address.json');
		$address_arr = json_decode($add_json,true);

		//判断地区唯一性
		$a = $address_arr["address"];
		foreach($a as $k=>$v){
			if($a[$k]==$name){
				echo "<script language=\"JavaScript\">\r\n";
				echo " alert(\"已有该地址，请勿重复添加\");\r\n";
				echo " window.location.href='./index.php';\r\n";
				echo "</script>";
				exit;
			}
		}
		
		$add_arr = $address_arr["address"];
		$add_arr[] = $name;
		$addres["address"] = $add_arr;
		$arr_json = json_encode($addres,JSON_UNESCAPED_UNICODE);

		if(file_put_contents("./address.json", $arr_json)){
			echo "<script language=\"JavaScript\">\r\n";
			echo " alert(\"添加成功\");\r\n";
			echo " window.location.href='./index.php';\r\n";
			echo "</script>";
		}else{
			echo "<script language=\"JavaScript\">\r\n";
			echo " alert(\"添加失败\");\r\n";
			echo " window.location.href='./index.php';\r\n";
			echo "</script>";
		}
	}
?>
<body>
<a href="./index.php" style="margin-left: 500px;">返回黑名单地址首页</a>
<div style="margin-left: 550px;">

	<h1>黑名单地址添加</h1>
	<form>
		地址名：<input type="text" name="name" required="" /><br/><br/>
		<input type="submit" name="sub" value="提交" style="margin-left: 100px;">
	</form>	
</div>
</body>
</html>
