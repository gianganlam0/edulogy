<?php
function handleLogout(){
    if (!isset($_SESSION)) {
        session_start();
    }
    $fullname = $_SESSION['fullname'];
    $res = array(
        'status' => 0,
        'message' => $fullname . " đã đăng xuất thành công!",
        'data' => array()
    );
    //delete all session and cookie
    session_unset();
    foreach($_COOKIE as $key => $value){
        setcookie($key, '', time() - 3600, '/');
    }
    return json_encode($res);
}
?>