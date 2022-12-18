<?php
require_once __DIR__.'/connectDB.php';
require_once __DIR__.'/Utils.php';
if (!isset($_GET['hash']) || !isset($_GET['code'])) {
    echo 'Liên kết hết hạn hoặc không hợp lệ';
    return;
}
$hash = $_GET['hash'];
$code = $_GET['code'];
$CONN = connectDB();
//get mail
$forgotInfoTable = 'forgot_info';
$sql = "SELECT email FROM $forgotInfoTable WHERE hash = '$hash' AND code = '$code'";
try {
    $result = mysqli_query($CONN, $sql);
    $count = mysqli_num_rows($result);
    if ($count == 1) {
        $row = mysqli_fetch_assoc($result);
        $email = $row['email'];
        //delete from forgot_info
        $sql = "DELETE FROM $forgotInfoTable WHERE hash = '$hash' AND code = '$code'";
        $result = mysqli_query($CONN, $sql);
        //get id
        $userTable = $DBS['prefix'] . 'user';
        $sql = "SELECT id FROM $userTable WHERE email = '$email'";
        $result = mysqli_query($CONN, $sql);
        $row = mysqli_fetch_assoc($result);
        $id = $row['id'];
        //update password
        $newPassword = 'Sura141.' . randomString(9, 9); //theo quy tắc mật khẩu
        $hashPassword = hash('sha256', $newPassword);
        $sql = "UPDATE user SET password = '$hashPassword' WHERE userid = '$id'";
        $result = mysqli_query($CONN, $sql);
        //send mail
        $subject = '[Thay đổi mật khẩu thành công]';
        //body is html
        $body = '<p>Mật khẩu mới của bạn là: '.$newPassword.'</p>'.
                '<p>Vui lòng đăng nhập và thay đổi mật khẩu!.</p>';
        sendMail([$email], $subject, $body);
        echo 'Đặt lại mật khẩu thành công. Vui lòng kiểm tra email để xem mật khẩu mới.';
        return;
    } else {
        echo 'Liên kết hết hạn hoặc không hợp lệ';
        return;
    }
        
} catch (\Throwable $th) {
    echo $th->getMessage();
}
