<?php

function handleLogin($username, $password){
    require '../connectDB.php';

    //anti sql injection
    $CONN = connectDB();
    $username = stripslashes($username);
    $password = stripslashes($password);
    $username = mysqli_real_escape_string($CONN, $username);
    $password = mysqli_real_escape_string($CONN, $password);

    $sql = "SELECT * FROM user WHERE username = '$username' AND password = '$password'";
    $result = mysqli_query($CONN, $sql);
    $row = mysqli_fetch_array($result, MYSQLI_ASSOC);
    $count = mysqli_num_rows($result);
    $res = array(
        'status' => '',
        'message' => '',
        'data' => ''
    );
    if ($count == 1) {
        $_SESSION['id'] = $row['userid'];
        setcookie('id', $row['userid'], time() + 3600*24, '/');//1 ngày
        $_SESSION['role'] = $row['role'];
        setcookie('role', $row['role'], time() + 3600*24, '/');//1 ngày
        $_SESSION['avatar'] = $row['avatar'];
        //lấy tên
        $userTable = $DBS['prefix'] . 'user';
        $sql = "SELECT * FROM $userTable WHERE username = '$username'";
        $result = mysqli_query($CONN, $sql);
        $row2 = mysqli_fetch_array($result, MYSQLI_ASSOC);
        $_SESSION['fullname'] = $row2['lastname'] . ' ' . $row2['firstname'];

        $res['status'] = 0;
        $res['message'] = 'Đăng nhập thành công';
        $res['data'] = array(
            'id' => $_SESSION['id'],
            'role' => $_SESSION['role'],
            'fullname' => $_SESSION['fullname'],
            'avatar' => $_SESSION['avatar']
        );
    } else {
        $res['status'] = 2;
        $res['message'] = 'Tên đăng nhập hoặc mật khẩu không đúng';
    }
    return json_encode($res);
}