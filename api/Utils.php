<?php
require_once __DIR__.'/DBInfo.php';
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
function randomString($min = 8, $max = 16) {
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
function sendMail($toList, $subject, $body){
    require __DIR__.'/phpmailer.php';
    for ($i = 0; $i < count($toList); $i++) {
        $mail->AddAddress($toList[$i]);
    }
    //utf8
    $mail->CharSet = "UTF-8";
    // $mail->AddReplyTo("reply-to-email@domain", "reply-to-name");
    // $mail->AddCC("cc-recipient-email@domain", "cc-recipient-name");
    $mail->Subject = $subject;
    $mail->MsgHTML($body); 
    if(!$mail->Send()) {
        throw new Exception('Error sending email: ' . $mail->ErrorInfo);
    }
}
function string2time($str){
    $time = explode(':', $str);
    return $time[0]*60 + $time[1];
}
function time2string($time){
    $hour = floor($time/60);
    $minute = $time%60;
    //return padding 2 zero
    return sprintf("%02d:%02d", $hour, $minute);
}
function checkOverlapSche($sche1, $sche2){
    date_default_timezone_set('Asia/Ho_Chi_Minh');
    //first get overlap date
    $overlapDate = array();
    $startDate1 = $sche1['startdate'];
    $endDate1 = $sche1['enddate'];
    $startDate2 = $sche2['startdate'];
    $endDate2 = $sche2['enddate'];
    $overlapDate['startdate'] = max($startDate1, $startDate2);
    $overlapDate['enddate'] = min($endDate1, $endDate2);
    if($overlapDate['startdate'] > $overlapDate['enddate']){
        return array(
            'isOverlap' => false,
            'data' => array(),
        );
    }
    //count number of day between 2 overlap date
    $numDay = (strtotime($overlapDate['enddate']) - strtotime($overlapDate['startdate']))/86400 + 1;
    $notCheckDay = array(
        '1' => 'Sunday',
        '2' => 'Monday',
        '3' => 'Tuesday',
        '4' => 'Wednesday',
        '5' => 'Thursday',
        '6' => 'Friday',
        '7' => 'Saturday',
    );
    if ($numDay < 7) {
        //get dayofweek not in overlap date
        for ($i = 0; $i < count($numDay); $i++) {
            $dow = date('N', strtotime($overlapDate['startdate'].' +'.$i.' day')) + 1;
            if ($dow > 7) {
                $dow = 1;
            }
            $dow = (string)$dow;
            unset($notCheckDay[$dow]);
        }
    }
    else {
        $notCheckDay = array();
    }
    //get overlap schedule
    $overlapSche = array();
    $sches1 = $sche1['schedule'];
    $sches2 = $sche2['schedule'];
    $sches1 = json_decode($sches1, true);
    $sches2 = json_decode($sches2, true);
    //join 2 schedule
    $sche = array_merge($sches1, $sches2);
    //check overlap
    for ($i = 0; $i < count($sche); $i++) {
        for ($j = $i+1; $j < count($sche); $j++) {
            if($sche[$i]['day'] == $sche[$j]['day'] && !in_array($sche[$i]['day'], $notCheckDay)){
                $start1 = string2time($sche[$i]['start']);
                $end1 = string2time($sche[$i]['end']);
                $start2 = string2time($sche[$j]['start']);
                $end2 = string2time($sche[$j]['end']);
                if($start1 < $end2 && $start2 < $end1){  
                    $day =''; 
                    if ($sche[$i]['day'] == '1') {
                        $day = 'Chủ nhật';
                    }
                    else {
                        $day = 'Thứ '.$sche[$i]['day'];
                    }          
                    $overlapSche = array(
                        'startdate'=> date('d/m/Y', $overlapDate['startdate']),
                        'enddate'=> date('d/m/Y', $overlapDate['enddate']),
                        'day' => $day,
                        'start' => time2string(max($start1, $start2)),
                        'end' => time2string(min($end1, $end2)),
                    );
                    return array(
                        'isOverlap' => true,
                        'data' => $overlapSche,
                    );
                }
            }
        }
    }
}
function array2Csv($arr){
    //array is array of object
    $csv = '';
    //get header
    $header = array_keys((array)$arr[0]);
    $csv .= implode(',', $header)."\n";
    //get data
    for ($i = 0; $i < count($arr); $i++) {
        $data = array_values((array)$arr[$i]);
        $csv .= implode(',', $data)."\n";
    }
    return $csv;
}
function csv2Array($csv){
    $arr = array();
    //csv2array with key is header, value is data
    $csv = explode("\n", $csv);
    $header = explode(',', $csv[0]);
    for ($i = 1; $i < count($csv) - 1; $i++) {
        $data = explode(',', $csv[$i]);
        $obj = array();
        for ($j = 0; $j < count($header); $j++) {
            $obj[$header[$j]] = $data[$j];
        }
        $arr[] = $obj;
    }
    return $arr;
}
function test($msg = ''){
    var_dump($msg);
    // exit;
}
?>
