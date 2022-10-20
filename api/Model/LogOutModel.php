<?php
function handleLogout(){
    $fullname = $_SESSION['fullname'];
    $res = array(
        'status' => 1,
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