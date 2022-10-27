<?php

use function PHPSTORM_META\type;

require_once '../Model/UserModel.php';
$rq = json_decode($_POST['data'], true);
$id = $rq['id'];

$res = array(
    'status' => '',
    'message' => '',
    'data' => ''
);

//if chua dang nhap thì bắt đầu sess
if (!isset($_SESSION)) {
    session_start();
}
if (!isset($_SESSION['id'])) {
    $res['status'] = -1;
    $res['message'] = 'Bạn chưa đăng nhập!';
    echo json_encode($res);
}
else {
    if ($id == ''){
        $id = $_SESSION['id'];
        try {
            echo getInfo($id);
        }
        catch (Throwable $th) {
            $res['status'] = -1;
            $res['message'] = 'Đã có lỗi xảy ra!';
            echo json_encode($res);
        }
    }
    else {
        $regex = '/^[0-9]+$/';
        if (preg_match($regex, $id)) {
            if ($id == '1'){ //id của người dùng guest
                $res['status'] = -2;
                $res['message'] = 'ID không hợp lệ!';
                echo json_encode($res);
                return;
            }
            try {
                $res = json_decode(getInfo($id), true);
                unset($res['data']['phone']);
                unset($res['data']['IDNumber']);
                unset($res['data']['sex']);
                unset($res['data']['birthday']);
                if ($_SESSION['role'] != 2){
                    unset($res['data']['balance']);
                }
                echo json_encode($res);
            }
            catch (Throwable $th) {
                $res['status'] = -2;
                $res['message'] = 'Không tìm thấy người dùng!';
                echo json_encode($res);
            }
        }
        else {
            $res['status'] = -2;
            $res['message'] = 'ID không hợp lệ!';
            echo json_encode($res);
        }
        
    }
}
return;