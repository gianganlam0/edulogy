<?php
date_default_timezone_set('Asia/Ho_Chi_Minh');
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
function recharge($userid,$amount){
    require_once '../connectDB.php';
    require_once '../RechargeConfig.php';
    $time = time();
    //get date in format dd-mm-yyyy
    $date = date('d-m-Y', $time);
    //get time in format hh:mm:ss
    $time2 = date('H:i:s', $time);
    $time2 = $date.' '.$time2;
    $CONN = connectDB();
    $content = "Nap tien vao tai khoan vao luc $time2, so tien $amount VND";
    $sql = "INSERT INTO transaction (userid, amount, content, time,type,status)
            VALUES ('$userid', '$amount', '$content', '$time','$vnp_OrderType',0)";
    $result = mysqli_query($CONN, $sql);
    if (!$result) {
        throw new Exception(mysqli_error($CONN));
    }
    $vnp_TxnRef = mysqli_insert_id($CONN);
    $vnp_OrderInfo = $content;
    $vnp_Amount = $amount*100; //vnpay require amount * 100
    //exp in 15 minutes
    $vnp_ExpireDate = date('YmdHis', strtotime('+15 minutes'));
    $inputData = array(
        "vnp_Version" => "2.1.0",
        "vnp_TmnCode" => $vnp_TmnCode,
        "vnp_Amount" => $vnp_Amount,
        "vnp_Command" => "pay",
        "vnp_CreateDate" => date('YmdHis'),
        "vnp_CurrCode" => "VND",
        "vnp_IpAddr" => $vnp_IpAddr,
        "vnp_Locale" => $vnp_Locale,
        "vnp_OrderInfo" => $vnp_OrderInfo,
        "vnp_OrderType" => $vnp_OrderType,
        "vnp_ReturnUrl" => $vnp_Returnurl,
        "vnp_TxnRef" => $vnp_TxnRef,
        "vnp_ExpireDate"=>$vnp_ExpireDate,
    );
    
    ksort($inputData);
    $query = "";
    $i = 0;
    $hashdata = "";
    foreach ($inputData as $key => $value) {
        if ($i == 1) {
            $hashdata .= '&' . urlencode($key) . "=" . urlencode($value);
        } else {
            $hashdata .= urlencode($key) . "=" . urlencode($value);
            $i = 1;
        }
        $query .= urlencode($key) . "=" . urlencode($value) . '&';
    }
    $vnp_Url = $vnp_Url . "?" . $query;
    if (isset($vnp_HashSecret)) {
        $vnpSecureHash = hash_hmac('sha512', $hashdata, $vnp_HashSecret);// 
        $vnp_Url .= 'vnp_SecureHash=' . $vnpSecureHash; 
    }
    $returnData = array(
        'status' => '0',
        'data' => $vnp_Url
    );
    return $returnData;

}
function getTrans($userid,$offset){
    require_once '../connectDB.php';
    $CONN = connectDB();
    //first count
    $sql = "SELECT COUNT(*) FROM transaction WHERE userid = '$userid'";
    $result = mysqli_query($CONN, $sql);
    $totalTrans = mysqli_fetch_assoc($result)['COUNT(*)'];

    $sql = "SELECT * FROM transaction WHERE userid = '$userid' ORDER BY
    time DESC
    LIMIT 10 OFFSET $offset";
    $result = mysqli_query($CONN, $sql);
    $transList = array();
    while ($row = mysqli_fetch_assoc($result)) {
        $transList[] = $row;
    }
    $returnData = array(
        'status' => 0,
        'data' => array(
            'totalTrans' => $totalTrans,
            'data' => $transList
        )
    );
    return $returnData;
}