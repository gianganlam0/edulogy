<?php
require '../Model/LogoutModel.php';
session_start();
$res = array(
    'status' => 0,
    'message' => '',
    'data' => array()
);
//if you are logout before
if(!isset($_SESSION['id'])){
    $res['status'] = 0;
    $res['message'] = 'Bạn đã đăng xuất rồi!';
    echo json_encode($res);
}
else{
    echo handleLogout();
}
session_destroy();
return;
?>