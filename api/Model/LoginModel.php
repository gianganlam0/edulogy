<?php

function handleLogin($username, $password){
    require_once '../connectDB.php';

    if (!isset($_SESSION)) {
        session_start();
    }
    $CONN = connectDB();

    $sql = "SELECT * FROM user WHERE username = ? AND password = ?";
    //MySQLi (procedural)
    $stmt = mysqli_stmt_init($CONN);
    if (!mysqli_stmt_prepare($stmt, $sql)) {
        throw new Exception('SQL error');
    }
    mysqli_stmt_bind_param($stmt, "ss", $username, $password);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);
    //check if wrong sql query
    if (!$result) {
        throw new Exception(mysqli_error($CONN));
    }
    $row = mysqli_fetch_array($result, MYSQLI_ASSOC);
    $count = mysqli_num_rows($result);
    $res = array(
        'status' => '',
        'message' => '',
        'data' => ''
    );
    if ($count == 1) {
        //lấy tên
        $userTable = $DBS['prefix'] . 'user';
        $sql = "SELECT * FROM $userTable WHERE username = ?";
        $stmt = mysqli_stmt_init($CONN);
        if (!mysqli_stmt_prepare($stmt, $sql)) {
            throw new Exception('SQL error');
        }
        mysqli_stmt_bind_param($stmt, "s", $username);
        mysqli_stmt_execute($stmt);
        $result = mysqli_stmt_get_result($stmt);
        //check if wrong sql query
        if (!$result) {
            throw new Exception(mysqli_error($CONN));
        }
        $row2 = mysqli_fetch_array($result, MYSQLI_ASSOC);

        $res['status'] = 0;
        $res['data'] = array(
            'id' => $row['userid'],
            'role' => $row['role'],
            'fullname' => $row2['lastname'] . ' ' . $row2['firstname'],
            'avatar' => $row['avatar'],
        );
    } else {
        $res['status'] = 2;
    }
    return $res;
}