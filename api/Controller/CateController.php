<?php
require_once '../Model/CateModel.php';
require_once '../Utils.php';
// require_once '../Model/UserModel.php';
$rq = json_decode($_POST['data'], true);
$action = $_POST['action'];

$res = array(
    'status' => '',
    'message' => '',
    'data' => ''
);

//if chua bat dau thì bắt đầu sess
if (!isset($_SESSION)) {
    session_start();
    setcookie('PHPSESSID', session_id(), time() + 3600*24, '/');//1 ngày
}

if ($action == 'getCateList'){
    $keyword = $rq['keyword'];
    $sortby = $rq['sortBy'];
    $orderby = $rq['orderBy'];
    $offset = $rq['offset'];
    $itemPerPage = $rq['itemPerPage'];
    //anti sql injection in keyword
    if ($sortby != 'name' && $sortby != 'idnumber')
        $sortby = 'name';
    if ($orderby != 'asc' && $orderby != 'desc')
        $orderby = 'asc';
    //offset must be a number >= 0
    if (!is_numeric($offset) || $offset < 0)
        $offset = 0;
    //itemPerPage must be a number > 0
    if (!is_numeric($itemPerPage) || $itemPerPage <= 0)
        $itemPerPage = 10;

    try {
        $res = handleGetCate($keyword, $sortby, $orderby, $offset, $itemPerPage);
        if ($res['status'] == 0){ 
            echo json_encode($res);
            return;
        }
        // else if ($res['status'] == -1){
        //     $res['message']  = 'Sai tên đăng nhập hoặc mật khẩu';
        //     echo json_encode($res);
        //     return;
        // }
        // else if ($res['status'] == -2){
        //     $res['message']  = 'Tài khoản chưa cập nhật thông tin';
        //     echo json_encode($res);
        //     return;
        // }
    }
    catch (Throwable $th) {
        $res['status'] = -3;
        $res['message'] = 'Đã có lỗi xảy ra!';
        echo json_encode($res);
        return;
    }
    return;
}
else if ($action == 'addCate'){
    if ($_SESSION['role'] != 2 && $_SESSION['role'] != 1){
        $res['status'] = -1;
        $res['message'] = 'Bạn không có quyền thực hiện thao tác này!';
        echo json_encode($res);
        return;
    }
    $name = $rq['name'];
    $desc = $rq['desc'];
    $imgFile = null;
    $imageLink = null;

    if (isset($_FILES['imgFile'])){
        $imgFile = $_FILES['imgFile'];
    }
    //validate
    if (strlen($name) < 1 || strlen($name) > 255){
        $res['status'] = -2;
        $res['message'] = 'Tên danh mục không hợp lệ!';
        echo json_encode($res);
        return;
    }
    if ($imgFile != null){
        if ($imgFile['size'] > 1024*1024*5){
            $res['status'] = -2;
            $res['message'] = 'Kích thước ảnh quá lớn!';
            echo json_encode($res);
            return;
        }
        //check file type
        $fileType = strtolower(pathinfo($imgFile['name'], PATHINFO_EXTENSION));
        if ($fileType != 'jpg' && $fileType != 'png' && $fileType != 'jpeg'){
            $res['status'] = -2;
            $res['message'] = 'Định dạng ảnh không hợp lệ!';
            echo json_encode($res);
            return;
        }
        $uploadRes = uploadImgur($imgFile);
        $imageLink = $uploadRes->link;
    }
    
    try {
        $res = addCatePending($name, $desc, $imageLink);
        if ($res['status'] == 0){ 
            $res['message'] = 'Thêm danh mục thành công, danh mục sẽ được duyệt trong thời gian sớm nhất!';
            echo json_encode($res);
            return;
        }
        // else if ($res['status'] == -1){
        //     $res['message']  = 'Tên danh mục đã tồn tại!';
        //     echo json_encode($res);
        //     return;
        // }
    } catch (\Throwable $th) {
        $res['status'] = -3;
        $res['message'] = 'Đã có lỗi xảy ra!';
        echo json_encode($res);
        return;
    }
}