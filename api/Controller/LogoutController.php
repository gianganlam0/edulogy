<?php
require_once __DIR__.'/../Model/LogOutModel.php';
if (!isset($_SESSION)) {
    session_start();
}
$res = array(
    'status' => '',
    'message' => '',
    'data' => ''
);
//if you are logout before
if(!isset($_SESSION['id'])){
    $res['status'] = 1;
    $res['message'] = 'Bạn đã đăng xuất rồi!';
    //delete all session and cookie
    session_unset();
    foreach($_COOKIE as $key => $value){
        setcookie($key, '', time() - 3600, '/');
    }
    echo json_encode($res);
}
else{
    $res = handleLogout();
    echo json_encode($res);
}
session_destroy();
return;
