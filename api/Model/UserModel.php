<?php
function getInfo($id){
    require_once '../connectDB.php';

    if (!isset($_SESSION)) {
        session_start();
    }
    $CONN = connectDB();
    $sql = "SELECT * FROM user WHERE userid = '$id'";
    $result = mysqli_query($CONN, $sql);
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
        //lấy thông tin bên bảng user lớn
        $userTable = $DBS['prefix'] . 'user';
        $sql = "SELECT * FROM $userTable WHERE id = '$id'";
        $result = mysqli_query($CONN, $sql);
        if (!$result) {
            throw new Exception(mysqli_error($CONN));
        }
        $row2 = mysqli_fetch_array($result, MYSQLI_ASSOC);

        $res['status'] = 0;
        $res['message'] = '';
        $res['data'] = array(
            'id' => $row['userid'],
            'lastname' => $row2['lastname'],
            'firstname' => $row2['firstname'],
            'phone' => $row2['phone2'],
            'IDNumber' => $row2['idnumber'],
            'sex' => $row['sex'],
            'birthday' => $row['birthday'],
            'username' => $row['username'],
            'email' => $row2['email'],
            'role' => $row['role'],
            'balance' => $row['balance'],
            'desc' => $row2['description'],
            'avatar' => $row['avatar']
        );
    }
    return json_encode($res);
}