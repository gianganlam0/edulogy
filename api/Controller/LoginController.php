<?php

require_once '../Model/LoginModel.php';
$rq = json_decode($_POST['data'], true);
$username = $rq['username'];
$password = $rq['password'];
// echo $username;
$res = array(
    'status' => '',
    'message' => '',
    'data' => ''
);

//if chua dang nhap thì bắt đầu sess
if (!isset($_SESSION)) {
    session_start();
    setcookie('PHPSESSID', session_id(), time() + 3600*24, '/');//1 ngày
}
if (isset($_SESSION['id'])) {
    $res['status'] = 1;
    $res['message'] = 'Bạn đã đăng nhập rồi';
    $res['data'] = array(
        'id' => $_SESSION['id'],
        'role' => $_SESSION['role'],
        'fullname' => $_SESSION['fullname'],
        'avatar' => $_SESSION['avatar']
    );
    echo json_encode($res);
    return;
}
//username start with lowercase letter and only has lowercase letters, numbers, ., _ and length 1 to 100
$regexUsername = '/^[a-z][a-z0-9._]{1,100}$/';
if (!preg_match($regexUsername, $username)) {
    $res['status'] = 3;
    $res['message'] = 'Tên đăng nhập không hợp lệ!';
    echo json_encode($res);
    return;
}

//Password must have at least 8 characters, at least 1 number, at least 1 lowercase character, at least 1 uppercase character, at least 1 non-numeric character
// $regexPassword = '/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/';
// if (!preg_match($regexPassword, $password)) {
//     $res['status'] = 0;
//     $res['message'] = 'Mật khẩu không hợp lệ!';
//     echo json_encode($res);
//     return;
// }

try {
    echo handleLogin($username, $password);
}
catch (Throwable $th) {
    $res['status'] = -1;
    $res['message'] = 'Đã có lỗi xảy ra!';
    echo json_encode($res);
}
return;