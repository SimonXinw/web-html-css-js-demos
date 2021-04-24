<?php
    $user = $_GET['user'];
    $num = $_GET['code'];
    if ($user == 'xiaocuo'){
        switch ($num) {
            case 'info':
                echo '{"name":"小刘","age":"18","sex":"女","id":"a001"}';
                break;
            case 'a001':
                echo '{"idcar":"455222199910101234","ipone":"13800002222","id":"b001"}';
                break;
            case 'b001':
                echo '{"address":"广东省深圳市宝安区后瑞地铁站b出口100米"}';
                break;
        }
    }
?>