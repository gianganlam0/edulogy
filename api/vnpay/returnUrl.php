<?php
require_once __DIR__."/../RechargeConfig.php";
require_once __DIR__."/../connectDB.php";
$inputData = array();
$returnData = array();

foreach ($_GET as $key => $value) {
    if (substr($key, 0, 4) == "vnp_") {
        $inputData[$key] = $value;
    }
}

$vnp_SecureHash = $inputData['vnp_SecureHash'];
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
$vnpTranId = $inputData['vnp_TransactionNo']; //Mã giao dịch tại VNPAY
$vnp_BankCode = $inputData['vnp_BankCode']; //Ngân hàng thanh toán
$vnp_Amount = $inputData['vnp_Amount']/100; // Số tiền thanh toán VNPAY phản hồi

$Status = 0; // Là trạng thái thanh toán của giao dịch chưa xử lý xong
$orderId = $inputData['vnp_TxnRef'];
try {   
    if ($secureHash == $vnp_SecureHash) {//Kiểm tra checksum của dữ liệu
        $CONN = connectDB();
        $sql = "SELECT * FROM `transaction` WHERE `id` = '$orderId'";
        $result = mysqli_query($CONN, $sql);
        $order = mysqli_fetch_assoc($result);
        if ($order != NULL) {
            if($order["amount"] == $vnp_Amount){ //Kiểm tra số tiền thanh toán của giao dịch
                if ($order["status"] != NULL && $order["status"] == 0) {
                    if ($inputData['vnp_ResponseCode'] == '00' || $inputData['vnp_TransactionStatus'] == '00') {
                        $status = 1; // Trạng thái thanh toán thành công
                    }
                    else {
                        $status = 2; // Trạng thái thanh toán thất bại / lỗi
                    }
                    //Cài đặt Code cập nhật kết quả thanh toán, tình trạng đơn hàng vào DB
                    $sql = "UPDATE `transaction` SET `status` = '$status' WHERE `id` = '$orderId'";
                    mysqli_query($CONN, $sql);
                    if ($status == 1) {
                        $sql = "UPDATE `user` SET `balance` = `balance` + '$vnp_Amount' WHERE `userid` = '$order[userid]'";
                        mysqli_query($CONN, $sql);
                        $returnData['RspCode'] = '00';
                        $returnData['Message'] = 'Giao dịch thành công';
                    }   
                    else{
                        $returnData['RspCode'] = '24';
                        $returnData['Message'] = 'Bạn đã hủy giao dịch';
                    }                 
                }
                else {
                    $returnData['RspCode'] = '02';
                    $returnData['Message'] = 'Đơn hàng đã được xác nhận trước đó';
                }
            }
            else {
                $returnData['RspCode'] = '04';
                $returnData['Message'] = 'Số tiền không khớp';
            }
        } else {
            $returnData['RspCode'] = '01';
            $returnData['Message'] = 'Không tìm thấy giao dịch';
        }
    } else {
        $returnData['RspCode'] = '97';
        $returnData['Message'] = 'Sai chữ ký';
    }
} catch (Exception $e) {
    $returnData['RspCode'] = '99';
    $returnData['Message'] = 'Lỗi không xác định';
}
//Trả lại VNPAY theo định dạng JSON
// echo json_encode($returnData);
echo $returnData['Message'];