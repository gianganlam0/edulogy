<?php
date_default_timezone_set('Asia/Ho_Chi_Minh');
$vnp_Url = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
$vnp_Returnurl = "http://localhost/edulogy/api/vnpay/returnUrl.php";
$vnp_TmnCode = "XZHS9J35";//Mã website tại VNPAY 
$vnp_HashSecret = "PQOYHHGRCYMBFGEIOXVWLURCYROAQSKP"; //Chuỗi bí mật
$vnp_OrderType = 'topup';
$vnp_Locale = 'vn';
$vnp_IpAddr = $_SERVER['REMOTE_ADDR'];

?>