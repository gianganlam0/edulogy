<?php
require_once 'DBInfo.php';
require_once '../vendor/autoload.php';
function logger(){
    echo "<script>alert('I am here');</script>";
}
function removeSign($str){ //bỏ dấu
    $unicode = array(
        'a' => 'á|à|ả|ã|ạ|ă|ắ|ặ|ằ|ẳ|ẵ|â|ấ|ầ|ẩ|ẫ|ậ',
        'd' => 'đ',
        'e' => 'é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ',
        'i' => 'í|ì|ỉ|ĩ|ị',
        'o' => 'ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ',
        'u' => 'ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự',
        'y' => 'ý|ỳ|ỷ|ỹ|ỵ',
        'A' => 'Á|À|Ả|Ã|Ạ|Ă|Ắ|Ặ|Ằ|Ẳ|Ẵ|Â|Ấ|Ầ|Ẩ|Ẫ|Ậ',
        'D' => 'Đ',
        'E' => 'É|È|Ẻ|Ẽ|Ẹ|Ê|Ế|Ề|Ể|Ễ|Ệ',
        'I' => 'Í|Ì|Ỉ|Ĩ|Ị',
        'O' => 'Ó|Ò|Ỏ|Õ|Ọ|Ô|Ố|Ồ|Ổ|Ỗ|Ộ|Ơ|Ớ|Ờ|Ở|Ỡ|Ợ',
        'U' => 'Ú|Ù|Ủ|Ũ|Ụ|Ư|Ứ|Ừ|Ử|Ữ|Ự',
        'Y' => 'Ý|Ỳ|Ỷ|Ỹ|Ỵ',
    );

    foreach ($unicode as $nonUnicode => $uni) {
        $str = preg_replace("/($uni)/i", $nonUnicode, $str);
    }

    $str = str_replace(' ', '_', $str);
    return $str;
}
function removeDir($dir = null){
    if (is_dir($dir)) {
        $objects = scandir($dir);
        foreach ($objects as $object) {
            if ($object != "." && $object != "..") {
                if (filetype($dir . "/" . $object) == "dir") removeDir($dir . "/" . $object);
                else unlink($dir . "/" . $object);
            }
        }
        reset($objects);
        rmdir($dir);
    }
}
function randomString($min , $max) {
    $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $length = rand($min, $max);
    $charactersLength = strlen($characters);
    $randomString = '';
    for ($i = 0; $i < $length; $i++) {
        $randomString .= $characters[rand(0, $charactersLength - 1)];
    }
    return $randomString;
}
function uploadImgur($file){
    //new token get: https://api.imgur.com/oauth2/authorize?client_id=89a2cb7a66dd32c&response_type=token
    //new access token link post: https://api.imgur.com/oauth2/token?client_id=89a2cb7a66dd32c&client_secret=4514d4922434f3f376b8ecb432eefb8b8df767b9&refresh_token=9c72c87271d2d628eb1311cc1abb8502b4cc3ba9&grant_type=refresh_token
    $YOUR_ACCESS_TOKEN = '3b2a0809d98660ee56bcf219470326c564530fb1';
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, 'https://api.imgur.com/3/image');
    curl_setopt($ch, CURLOPT_POST, TRUE);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
    curl_setopt($ch, CURLOPT_HTTPHEADER, array(
        'Authorization: Bearer '. $YOUR_ACCESS_TOKEN
    ));
    curl_setopt($ch, CURLOPT_POSTFIELDS, array(
        'image' => base64_encode(file_get_contents($file['tmp_name']))
    ));
    $reply = curl_exec($ch);
    curl_close($ch);
    $reply = json_decode($reply);
    return $reply->data;
}
function deleteImgur($deleteHash){
    $YOUR_ACCESS_TOKEN = '3b2a0809d98660ee56bcf219470326c564530fb1';
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, 'https://api.imgur.com/3/image/'.$deleteHash);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "DELETE");
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
    curl_setopt($ch, CURLOPT_HTTPHEADER, array(
        'Authorization: Bearer '. $YOUR_ACCESS_TOKEN
    ));
    $reply = curl_exec($ch);
    curl_close($ch);
    $reply = json_decode($reply);
    return $reply->data;
}
function sendMail($to, $subject, $message){
    //user gmail api send mail

}
?>
