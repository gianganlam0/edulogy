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
            'avatar' => $row['avatar'],
            'deletehash' => $row['deletehash']
        );
    }
    return $res;
}
function updateInfo($id, $lastname, $firstname, $phone, $IDNumber, $sex, $birthday, $email, $role, $desc, $avatar, $deleteHash){
    require_once '../connectDB.php';

    if (!isset($_SESSION)) {
        session_start();
    }
    $CONN = connectDB();
    $deleteHash == null ? $deleteHash = 'deletehash' : $deleteHash = "'". $deleteHash . "'";
    if ($deleteHash != null) deleteAvatar($id); //xóa ảnh cũ
    $birthday == null ? $birthday = 'null' : $birthday = "'". $birthday . "'";
    $sql = "UPDATE user
            SET role = '$role', sex = '$sex', birthday = $birthday, avatar = '$avatar', deleteHash = $deleteHash
            WHERE userid = '$id'";

    $result = mysqli_query($CONN, $sql);
    if (!$result) {
        throw new Exception(mysqli_error($CONN));
    }
    $userTable = $DBS['prefix'] . 'user';
    //wrap string in ""
    $lastname = '"' . $lastname . '"';
    $firstname = '"' . $firstname . '"';
    $desc = '"' . $desc . '"';
    $sql = "UPDATE $userTable
            SET lastname = $lastname, firstname = $firstname, phone2 = '$phone', idnumber = '$IDNumber', email = '$email', description = $desc
            WHERE id = '$id'";
    $result = mysqli_query($CONN, $sql);
    if (!$result) {
        throw new Exception(mysqli_error($CONN));
    }
    $res = array(
        'status' => 0,
        'message' => '',
        'data' => ''
    );
    return $res;
}
function updateAnotherInfo($id, $role){
    require_once '../connectDB.php';

    if (!isset($_SESSION)) {
        session_start();
    }
    $CONN = connectDB();
    $sql = "UPDATE user
            SET role = '$role'
            WHERE userid = '$id'";
    $result = mysqli_query($CONN, $sql);
    if (!$result) {
        throw new Exception(mysqli_error($CONN));
    }
    $res = array(
        'status' => 0,
        'message' => '',
        'data' => ''
    );
    return $res;
}
function deleteAvatar($id){
    require_once '../connectDB.php';
    if (!isset($_SESSION)) {
        session_start();
    }
    $CONN = connectDB();
    //set avatar to it's default value in mysql column
    $sql = "UPDATE user
            SET avatar = default
            WHERE userid = '$id'";
    $result = mysqli_query($CONN, $sql);
    if (!$result) {
        throw new Exception(mysqli_error($CONN));
    }
    //get the avatar, deletehash of the user
    $sql = "SELECT avatar, deleteHash FROM user WHERE userid = '$id'";
    $result = mysqli_query($CONN, $sql);
    if (!$result) {
        throw new Exception(mysqli_error($CONN));
    }
    $row = mysqli_fetch_array($result, MYSQLI_ASSOC);
    $avatar = $row['avatar']; //basic
    $deleteHash = $row['deleteHash'];
    //delete the avatar in imgur
    deleteImgur($deleteHash);
    //delete deletehash in mysql
    $sql = "UPDATE user
            SET deleteHash = ''
            WHERE userid = '$id'";
    $result = mysqli_query($CONN, $sql);
    if (!$result) {
        throw new Exception(mysqli_error($CONN));
    }
    $res = array(
        'status' => 0,
        'message' => '',
        'data' => array(
            'avatar' => $avatar
        )
    );
    return $res;
}
function changePassword($id, $oldPassword, $newPassword){
    require_once '../connectDB.php';
    if (!isset($_SESSION)) {
        session_start();
    }
    $CONN = connectDB();
    $sql = "SELECT password FROM user WHERE userid = '$id' AND password = '$oldPassword'";
    $result = mysqli_query($CONN, $sql);
    if (!$result) {
        throw new Exception(mysqli_error($CONN));
    }
    $count = mysqli_num_rows($result);
    $res = array(
        'status' => '',
        'message' => '',
        'data' => ''
    );
    if ($count == 1) {
        $sql = "UPDATE user
                SET password = '$newPassword'
                WHERE userid = '$id'";
        $result = mysqli_query($CONN, $sql);
        if (!$result) {
            throw new Exception(mysqli_error($CONN));
        }
        $res['status'] = 0;
        
    } else {
        $res['status'] = -1;
    }
    return $res;
}
function handleForgotPassword($email){
    require_once '../connectDB.php';

    if (!isset($_SESSION)) {
        session_start();
    }
    $CONN = connectDB();
    $userTable = $DBS['prefix'] . 'user';
    $sql = "SELECT id FROM $userTable WHERE email = '$email'";
    $result = mysqli_query($CONN, $sql);
    if (!$result) {
        throw new Exception(mysqli_error($CONN));
    }
    $count = mysqli_num_rows($result);
    $res = array(
        'status' => '',
        'message' => '',
        'data' => ''
    );
    if ($count == 1) {
        $res['status'] = 0;
        $code = randomString(64,64);
        //sha 256 timestamp
        $hash = hash('sha256', time());
        //now send mail
        //$body has html format
        $body = '<p>Click vào <a href="http://localhost/edulogy/api/ResetPassword.php?code='.$code.'&hash='.$hash.'">Link này</a> để đặt lại mật khẩu 
        cho tài khoản Edulogy</p>';
        $subject = '[Đặt lại mật khẩu cho tài khoản Edulogy]';
        try {
            sendMail([$email], $subject, $body);
            $forgotInfoTable = 'forgot_info';
            //upsert
            $sql = "INSERT INTO $forgotInfoTable (email, code, hash)
                    VALUES ('$email', '$code', '$hash')
                    ON DUPLICATE KEY UPDATE code = '$code', hash = '$hash'";
            $result = mysqli_query($CONN, $sql);
        } catch (\Throwable $th) {
            $res['status'] = -1;
            $res['message'] = 'Không thể gửi mail';
        }
    } else {
        $res['status'] = -3;
    }
    return $res;
}