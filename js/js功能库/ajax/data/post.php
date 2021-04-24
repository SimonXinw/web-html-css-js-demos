<?php
	$age = $_POST['age'];
	switch ($age) {
		case '18':
			echo '{"name":"小刘","age":"18","sex":"女"}';
			break;
		case '28':
			echo '{"name":"张三","age":"28","sex":"未知"}';
			break;
		case '38':
			echo '{"name":"老王","age":"38","sex":"男"}';
			break;
		default:
			echo '{"name":"未知","age":"未知","sex":"未知"}';
			break;
	}
?>