<?php

require_once '../Model/LoginModel.php';
require_once '../Model/UserModel.php';
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
    $res['message'] = 'Bạn đã đăng nhập rồi!';
    $userInfo = getInfo($_SESSION['id']);
    setcookie('id', $_SESSION['id'], time() + 3600*24, '/');//1 ngày
    setcookie('role', $_SESSION['role'], time() + 3600*24, '/');//1 ngày
    $res['data'] = array(
        'id' => $_SESSION['id'],
        'role' => $userInfo['data']['role'],
        'fullname' => $userInfo['data']['lastname'].' '.$userInfo['data']['firstname'],
        'avatar' => $userInfo['data']['avatar'],
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

//password is a sha256 string
$regexPassword = '/^[a-f0-9]{64}$/';
if (!preg_match($regexPassword, $password)) {
    $res['status'] = 4;
    $res['message'] = 'Mật khẩu không hợp lệ!';
    echo json_encode($res);
    return;
}

try {
    $res = handleLogin($username, $password);
    if ($res['status'] == 0){
        $res['message'] = 'Đăng nhập thành công';
        $_SESSION['id'] = $res['data']['id'];
        setcookie('id', $res['data']['id'], time() + 3600*24, '/');//1 ngày
        $_SESSION['role'] = $res['data']['role'];
        setcookie('role', $res['data']['role'], time() + 3600*24, '/');//1 ngày
        $_SESSION['fullname'] = $res['data']['fullname'];
        $_SESSION['avatar'] = $res['data']['avatar'];
        echo json_encode($res);
        return;
    }
    else if ($res['status'] == 2){
        $res['message']  = 'Sai tên đăng nhập hoặc mật khẩu';
        echo json_encode($res);
        return;
    }
}
catch (Throwable $th) {
    $res['status'] = -1;
    $res['message'] = 'Đã có lỗi xảy ra!';
    echo json_encode($res);
    return;
}
return;