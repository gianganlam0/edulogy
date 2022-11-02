<?php

require_once '../Model/RegisterModel.php';
require_once '../Model/LogoutModel.php';
$rq = json_decode($_POST['data'], true);
$username = $rq['username'];
$password = $rq['password'];

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
if (isset($_SESSION['id'])) {//phải đăng xuất trước khi đăng ký
    $res['status'] = -1;
    $res['message'] = 'Bạn phải đăng xuất trước khi đăng ký. Đã tự động đăng xuất';
    handleLogout();
    echo json_encode($res);
    return;
}
//username start with lowercase letter and only has lowercase letters, numbers, ., _ and length 1 to 100
$regexUsername = '/^[a-z][a-z0-9._]{1,100}$/';
if (!preg_match($regexUsername, $username)) {
    $res['status'] = -2;
    $res['message'] = 'Tên đăng nhập không hợp lệ!';
    echo json_encode($res);
    return;
}

//password is a sha256 string
$regexPassword = '/^[a-f0-9]{64}$/';
if (!preg_match($regexPassword, $password)) {
    $res['status'] = -2;
    $res['message'] = 'Mật khẩu không hợp lệ!';
    echo json_encode($res);
    return;
}

try {
    $res = handleRegister($username, $password);
    if ($res['status'] == 0){ 
        $res['message'] = 'Đăng ký thành công, bạn hãy cập nhập thông tin bên trang http://localhost/saru/ trước khi đăng nhập tại trang này.';
        echo json_encode($res); 
        return;
    }
    else if ($res['status'] == -3){
        $res['message']  = 'Tên đăng nhập đã tồn tại';
        echo json_encode($res);
        return;
    }
}
catch (Throwable $th) {
    $res['status'] = -3;
    $res['message'] = 'Đã có lỗi xảy ra!';
    echo json_encode($res);
    return;
}
return;