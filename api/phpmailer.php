<?php
use PHPMailer\PHPMailer\PHPMailer;
require_once __DIR__ . '/../vendor/autoload.php';
$mail = new PHPMailer(true);
try {
    $mail = new PHPMailer();
    $mail->isSMTP();
    $mail->Mailer = "smtp";
    //$mail->SMTPDebug  = 2;  
    //$mail->Debugoutput = "html"; // Lỗi trả về hiển thị với cấu trúc HTML
    $mail->SMTPAuth   = true;
    $mail->SMTPSecure = "ssl";
    $mail->Port       = 465;
    $mail->Host       = "smtp.hostinger.com";
    $mail->setFrom('no-reply@edulogy.tech');
    $mail->Username   = "no-reply@edulogy.tech";
    $mail->Password   = "AnLam.0912";
    $mail->isHTML(true);
    $mail->SetFrom("", "Edulogy");
} catch (Exception $e) {
    echo "Message could not be sent";
}