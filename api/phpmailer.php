<?php
use PHPMailer\PHPMailer\PHPMailer;
require_once __DIR__ . '/../vendor/autoload.php';
$mail = new PHPMailer(true);
try {
    $mail = new PHPMailer();
    $mail->isSMTP();
    $mail->Mailer = "smtp";
    // $mail->SMTPDebug  = 2;  
    // $mail->Debugoutput = "html"; // Lỗi trả về hiển thị với cấu trúc HTML
    $mail->SMTPAuth   = TRUE;
    $mail->SMTPSecure = "tls";
    $mail->Port       = 587;
    $mail->Host       = "smtp.gmail.com";
    $mail->Username   = "1610177@hcmut.edu.vn";
    $mail->Password   = "16042000";
    $mail->isHTML(true);
    $mail->SetFrom("", "Edulogy");
} catch (Exception $e) {
    echo "Message could not be sent";
}