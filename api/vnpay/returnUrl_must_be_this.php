<?php
require_once __DIR__."/../RechargeConfig.php";
$vnp_SecureHash = $_GET['vnp_SecureHash'];
$inputData = array();
foreach ($_GET as $key => $value) {
    if (substr($key, 0, 4) == "vnp_") {
        $inputData[$key] = $value;
    }
}

unset($inputData['vnp_SecureHash']);
ksort($inputData);
$i = 0;
$hashData = "";
foreach ($inputData as $key => $value) {
    if ($i == 1) {
        $hashData = $hashData . '&' . urlencode($key) . "=" . urlencode($value);
    } else {
        $hashData = $hashData . urlencode($key) . "=" . urlencode($value);
        $i = 1;
    }
}

$secureHash = hash_hmac('sha512', $hashData, $vnp_HashSecret);
if ($secureHash == $vnp_SecureHash) {
    if (isset($_GET['vpn_ResponseCode']) && $_GET['vnp_ResponseCode'] == '00') {
        echo "Giao dịch thành công";
    } 
    else {
        echo "Giao dịch không thành công";
        }
}
else {
    echo "Chữ ký không hợp lệ";
}