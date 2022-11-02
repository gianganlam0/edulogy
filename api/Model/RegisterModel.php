<?php

function handleregister($username, $password){
    require_once '../connectDB.php';

    if (!isset($_SESSION)) {
        session_start();
    }
    $CONN = connectDB();

    $sql = "SELECT * FROM user WHERE username = ?";
    //MySQLi (procedural)
    $stmt = mysqli_stmt_init($CONN);
    if (!mysqli_stmt_prepare($stmt, $sql)) {
        throw new Exception('SQL error');
    }
    mysqli_stmt_bind_param($stmt, "s", $username);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);
    if (mysqli_num_rows($result) > 0) {
        $res = array(
            'status' => -3,
        );
        return $res;
    }

    $sql = "INSERT INTO user (username, password) VALUES (?, ?)";
    //MySQLi (procedural)
    $stmt = mysqli_stmt_init($CONN);
    if (!mysqli_stmt_prepare($stmt, $sql)) {
        throw new Exception('SQL error');
    }
    mysqli_stmt_bind_param($stmt, "ss", $username, $password);
    mysqli_stmt_execute($stmt);
    $res = array(
        'status' => 0,
    );
    return $res;
}