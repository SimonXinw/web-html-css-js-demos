<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<title>黑名单地址管理</title>
	<style type="text/css">
		body{
			/* background:#ccc; */
		}
		table,tr,td{
			border:1px solid #ccc;
			border-collapse: collapse;
		}
		
		.del{
				color:red;
				text-decoration: underline;
		}
		.row{
			height:28px;
		}
		/* 表头 */
		.dz td{
			font-weight:bold;
		}
		/* 按钮 */
		.btn input{
			width:100px; height:32px;
		}
	</style>
</head>

<body>
	<table border="1px" width="500px" style="margin-left:400px;text-align: center">
	<!-- 表头 -->
		<tr height="50px;">
			<td class="btn" colspan="2">
				<a href="./admin.php"><input type="button" name="sub" value="返回后台首页"></a>
				<a href="./add_address.php"><input type="button" name="sub" value="添加新地址"></a>
			</td>
		</tr>

		<th colspan="2" style="color: red;" height="50px;">黑名单地址管理</th>
		<!-- 表格 -->
		<tr class="dz">
			<td>地址名</td>
			<td>操作</td>
		</tr>
		<?php
			$add_json = file_get_contents('./address.json');
			$address = json_decode($add_json,true);
			$address_arr = $address["address"];
			// echo $address;

			for($i=0;$i<count($address_arr);$i++){
		?>
		<tr class="row">
			<td><?php echo $address_arr[$i]?></td>
			<td ><a class="del" href="del_address.php?name=<?php echo $address_arr[$i]?>" onclick="return confirm('确定要删除吗？')">删除</a></td>
		</tr>

		<?php
		}
		?>
	</table>
</body>
</html>
