<?php
require_once '../Model/CourseModel.php';
require_once '../Utils.php';
// require_once '../Model/UserModel.php';
date_default_timezone_set('Asia/Ho_Chi_Minh');
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
else if ($action == 'addCourse'){
    if ($_SESSION['role'] != 2 && $_SESSION['role'] != 1){
        $res['status'] = -1;
        $res['message'] = 'Bạn không có quyền thực hiện thao tác này!';
        echo json_encode($res);
        return;
    }
    $fullname = $rq['fullName'];
    $shortname = $rq['shortName'];
    $schedule = $rq['schedule'];
    $category = $rq['cateId'];
    $startdate = $rq['startDay'];
    $enddate = $rq['endDay'];
    $idnumber = $rq['idNumber'];
    $desc = $rq['desc'];
    $cost = $rq['cost'];
    $imgFile = null;
    $imageLink = null;

    if (isset($_FILES['imgFile'])){
        $imgFile = $_FILES['imgFile'];
    }
    //validate
    if (strlen($fullname) == 0 || strlen($fullname) > 254){
        $res['status'] = -2;
        $res['message'] = 'Tên khóa học không hợp lệ!';
        echo json_encode($res);
        return;
    }
    if (strlen($shortname) == 0 || strlen($shortname) > 100){
        $res['status'] = -2;
        $res['message'] = 'Tên rút gọn khóa học không hợp lệ!';
        echo json_encode($res);
        return;
    }

    $regex = '/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/';
    if (!preg_match($regex, $startdate)){
        $res['status'] = -2;
        $res['message'] = 'Ngày bắt đầu không hợp lệ!';
        echo json_encode($res);
        return;
    }
    if (!preg_match($regex, $enddate)){
        $res['status'] = -2;
        $res['message'] = 'Ngày kết thúc không hợp lệ!';
        echo json_encode($res);
        return;
    }

    //now check end time must larger than start time as least 30 minutes
    for ($i = 0; $i < count($schedule); $i++){
        if (string2time($schedule[$i]['end']) - string2time($schedule[$i]['start']) < 30){
            $res['status'] = -2;
            $res['message'] = 'Thời gian học phải lớn hơn 30 phút!';
            echo json_encode($res);
            return;
        }
    }
    // now check schedule must not overlap
    for ($i = 0; $i < count($schedule); $i++){
        for ($j = $i + 1; $j < count($schedule); $j++){
            if ($schedule[$i]['day'] == $schedule[$j]['day']){
                if (string2time($schedule[$i]['start']) < string2time($schedule[$j]['end']) && string2time($schedule[$i]['end']) > string2time($schedule[$j]['start'])){
                    $res['status'] = -2;
                    $res['message'] = 'Thời gian học không được trùng nhau!';
                    echo json_encode($res);
                    return;
                }
            }
        }
    }
    //now get first dayofweek of schedule
    $firstDayOfWeek = '7'; //saturday
    for ($i = 0; $i < count($schedule); $i++){
        if ($schedule[$i]['day'] < $firstDayOfWeek)
            $firstDayOfWeek = $schedule[$i]['day'];
    }
    $firstDayOfWeek = (int)$firstDayOfWeek;
    //now get last dayofweek of schedule
    $lastDayOfWeek = '1'; //sunday
    for ($i = 0; $i < count($schedule); $i++){
        if ($schedule[$i]['day'] > $lastDayOfWeek)
            $lastDayOfWeek = $schedule[$i]['day'];
    }
    $lastDayOfWeek = (int)$lastDayOfWeek;
    $schedule = json_encode($schedule);
    //start day has format yyyy-mm-dd, check if it is < today + 7 days
    if (strtotime($startdate) < time() + 7 * 24 * 60 * 60){
        $res['status'] = -2;
        $res['message'] = 'Ngày bắt đầu phải lớn hơn ngày hiện tại ít nhất 7 ngày!';
        echo json_encode($res);
        return;
    }
    //end day has format yyyy-mm-dd, check if it is < start day
    if (strtotime($enddate) <= strtotime($startdate)){
        $res['status'] = -2;
        $res['message'] = 'Ngày kết thúc không hợp lệ!';
        echo json_encode($res);
        return;
    }
    // get dayofweek of startdate
    $startdayofweek = date('N', strtotime($startdate)) + 1;
    if ($startdayofweek > 7)
        $startdayofweek = 1;
    // get dayofweek of enddate
    $enddayofweek = date('N', strtotime($enddate)) + 1;
    if ($enddayofweek > 7)
        $enddayofweek = 1;
    
    if ($startdayofweek < $firstDayOfWeek){
        //startday become firstdayofweek
        $startdate = date('Y-m-d', strtotime($startdate) + ($firstDayOfWeek - $startdayofweek) * 24 * 60 * 60);
    }
    if ($startdayofweek > $firstDayOfWeek && $startdayofweek < $lastDayOfWeek){
        //startday become last day of week
        $startdate = date('Y-m-d', strtotime($startdate) + ($lastDayOfWeek - $startdayofweek) * 24 * 60 * 60);
    }
    if ($startdayofweek > $lastDayOfWeek){
        //startday become firstdayofweek of next week
        $startdate = date('Y-m-d', strtotime($startdate) + (7 - $startdayofweek + $firstDayOfWeek) * 24 * 60 * 60);
    }
    if ($enddayofweek > $lastDayOfWeek){
        //endday become lastdayofweek
        $enddate = date('Y-m-d', strtotime($enddate) - ($enddayofweek - $lastDayOfWeek) * 24 * 60 * 60);
    }
    if ($enddayofweek < $lastDayOfWeek && $enddayofweek > $firstDayOfWeek){
        //endday become first day of week
        $enddate = date('Y-m-d', strtotime($enddate) - ($enddayofweek - $firstDayOfWeek) * 24 * 60 * 60);
    }
    if ($enddayofweek < $firstDayOfWeek){
        //endday become lastdayofweek of previous week
        $enddate = date('Y-m-d', strtotime($enddate) - ($enddayofweek + 7 - $lastDayOfWeek) * 24 * 60 * 60);
    }


    //vali id number
    if (strlen($idnumber) > 100){
        $res['status'] = -2;
        $res['message'] = 'Mã khóa học không hợp lệ!';
        echo json_encode($res);
        return;
    }
    //vali cost is not positive integer
    if (strlen($cost) == 0){
        $res['status'] = -2;
        $res['message'] = 'Giá khóa học không hợp lệ!';
        echo json_encode($res);
        return;
    }
    if (!is_numeric($cost)){
        $res['status'] = -2;
        $res['message'] = 'Giá khóa học không hợp lệ!';
        echo json_encode($res);
        return;
    }
    else if ($cost != (int)$cost){
        $res['status'] = -2;
        $res['message'] = 'Giá khóa học không hợp lệ!';
        echo json_encode($res);
        return;
    }
    else if ($cost < 0){
        $res['status'] = -2;
        $res['message'] = 'Giá khóa học không hợp lệ!';
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
        $res = addCoursePending($fullname, $shortname, $schedule, $category, $startdate, $enddate, $idnumber, $desc, $cost, $imageLink);
        if ($res['status'] == 0){ 
            $res['message'] = 'Thêm khóa học thành công, khóa học sẽ được duyệt trong thời gian sớm nhất!';
            echo json_encode($res);
            return;
        }
        else if ($res['status'] == -1){
            $res['message']  = 'Tên rút gọn đã tồn tại!';
            echo json_encode($res);
            return;
        }
        else if ($res['status'] == -2){
            $res['message']  = 'ID khóa học đã tồn tại!';
            echo json_encode($res);
            return;
        }
    } catch (\Throwable $th) {
        $res['status'] = -3;
        $res['message'] = 'Đã có lỗi xảy ra!';
        echo json_encode($res);
        return;
    }
}
else if ($action == 'getCoursePending'){
    if ($_SESSION['role'] != 2){
        $res['status'] = -1;
        $res['message'] = 'Bạn không có quyền thực hiện thao tác này!';
        echo json_encode($res);
        return;
    }
    $offset = $rq['offset'];
    //offset must be a number >= 0
    if (!is_numeric($offset) || $offset < 0)
        $offset = 0;
    //itemPerPage must be a number > 0
    try {
        $res = getCoursePending($offset);
        if ($res['status'] == 0){ 
            echo json_encode($res);
            return;
        }
    }
    catch (Throwable $th) {
        $res['status'] = -3;
        $res['message'] = 'Đã có lỗi xảy ra!';
        echo json_encode($res);
        return;
    }
    return;
}
else if ($action == 'getMyCoursePending'){
    if ($_SESSION['role'] != 1){
        $res['status'] = -1;
        $res['message'] = 'Bạn không có quyền thực hiện thao tác này!';
        echo json_encode($res);
        return;
    }
    $offset = $rq['offset'];
    //offset must be a number >= 0
    if (!is_numeric($offset) || $offset < 0)
        $offset = 0;
    //itemPerPage must be a number > 0
    try {
        $res = getMyCoursePending($offset, $_SESSION['id']);
        if ($res['status'] == 0){ 
            echo json_encode($res);
            return;
        }
    }
    catch (Throwable $th) {
        $res['status'] = -3;
        $res['message'] = 'Đã có lỗi xảy ra!';
        echo json_encode($res);
        return;
    }
    return;
}
else if ($action == 'acceptCourse'){
    if ($_SESSION['role'] != 2){
        $res['status'] = -1;
        $res['message'] = 'Bạn không có quyền thực hiện thao tác này!';
        echo json_encode($res);
        return;
    }
    $id = $rq['id'];
    //validate
    if (!is_numeric($id) || $id <= 0){
        $res['status'] = -2;
        $res['message'] = 'ID khóa học không hợp lệ!';
        echo json_encode($res);
        return;
    }
    try {
        $res = acceptCourse($id);
        if ($res['status'] == 0){ 
            $res['message'] = 'Duyệt khóa học thành công!';
            echo json_encode($res);
            return;
        }
        else if ($res['status'] == -1){
            $res['message']  = 'Khóa học không tồn tại!';
            echo json_encode($res);
            return;
        }
        else if ($res['status'] == -4){
            $res['message']  = 'Có sự trùng lặp lịch học với khóa học: ' . $res['data']['fullname']
            . ', ngày bắt đầu trùng lặp: '. $res['data']['startdate']
            . ', ngày kết thúc trùng lặp: '. $res['data']['enddate']
            . ', thứ trùng lặp: ' . $res['data']['day'] //thứ 2, thứ 3, ...
            . ', giờ bắt đầu: ' . $res['data']['start']
            . ', giờ kết thúc: ' . $res['data']['end'];
            echo json_encode($res);
            return;
        }
    } catch (\Throwable $th) {
        $res['status'] = -3;
        $res['message'] = 'Đã có lỗi xảy ra!';
        echo json_encode($res);
        return;
    }
}
else if ($action == 'rejectCourse'){
    if ($_SESSION['role'] != 2){
        $res['status'] = -1;
        $res['message'] = 'Bạn không có quyền thực hiện thao tác này!';
        echo json_encode($res);
        return;
    }
    $id = $rq['id'];
    //validate
    if (!is_numeric($id) || $id <= 0){
        $res['status'] = -2;
        $res['message'] = 'ID khóa học không hợp lệ!';
        echo json_encode($res);
        return;
    }
    try {
        $res = rejectCourse($id);
        if ($res['status'] == 0){ 
            $res['message'] = 'Từ chối khóa học thành công!';
            echo json_encode($res);
            return;
        }
        else if ($res['status'] == -1){
            $res['message']  = 'Khóa học không tồn tại!';
            echo json_encode($res);
            return;
        }
    } catch (\Throwable $th) {
        $res['status'] = -3;
        $res['message'] = 'Đã có lỗi xảy ra!';
        echo json_encode($res);
        return;
    }
}
else if ($action == 'checkStartDate'){
    $offset = $rq['offset'];
    //offset must be a number >= 0
    if (!is_numeric($offset) || $offset < 0)
        $offset = 0;
    //itemPerPage must be a number > 0
    try {
        $res = checkStartDate($offset);
        if ($res['status'] == 0){ 
            echo json_encode($res);
            return;
        }
    }
    catch (Throwable $th) {
        $res['status'] = -3;
        $res['message'] = 'Đã có lỗi xảy ra!';
        echo json_encode($res);
        return;
    }
    return;
}
else if ($action == 'saveCsvCourse'){
    if ($_SESSION['role'] != 2){
        $res['status'] = -1;
        $res['message'] = 'Bạn không có quyền thực hiện thao tác này!';
        echo json_encode($res);
        return;
    }
    try {
        $res = saveCsvCourse();
        if ($res['status'] == 0){
            $res['message'] = 'Đã lưu danh sách khóa học đã duyệt!';
            echo json_encode($res);
            return;
        }
        if ($res['status'] == -2){
            $res['message'] = 'Đã xuất hết khóa học đã duyệt sang csv!';
            echo json_encode($res);
            return;
        }
    }
    catch (Throwable $th) {
        $res['status'] = -3;
        $res['message'] = 'Đã có lỗi xảy ra!';
        echo json_encode($res);
        return;
    }
    return;
}
else if ($action == 'getCourseCsv'){
    if ($_SESSION['role'] != 2){
        $res['status'] = -1;
        $res['message'] = 'Bạn không có quyền thực hiện thao tác này!';
        echo json_encode($res);
        return;
    }
    try {
        $res = getCourseCsv();
        if ($res['status'] == 0){
            $res['message'] = '';
            echo json_encode($res);
            return;
        }
    }
    catch (Throwable $th) {
        $res['status'] = -3;
        $res['message'] = 'Đã có lỗi xảy ra!';
        echo json_encode($res);
        return;
    }
    return;
}
else if ($action == 'confirmCourseCsv'){
    if ($_SESSION['role'] != 2){
        $res['status'] = -1;
        $res['message'] = 'Bạn không có quyền thực hiện thao tác này!';
        echo json_encode($res);
        return;
    }
    $id = $rq['id'];
    //validate
    if (!is_numeric($id) || $id <= 0){
        $res['status'] = -2;
        $res['message'] = 'ID kết quả không hợp lệ!';
        echo json_encode($res);
        return;
    }
    try {
        $res = confirmCourseCsv($id);
        if ($res['status'] == 0){
            $res['message'] = 'Đã xác nhận kết quả upload!';
            echo json_encode($res);
            return;
        }
        if ($res['status'] == -1){
            $res['message'] = 'Kết quả upload không tồn tại!';
            echo json_encode($res);
            return;
        }
    }
    catch (Throwable $th) {
        $res['status'] = -3;
        $res['message'] = 'Đã có lỗi xảy ra!';
        echo json_encode($res);
        return;
    }
    return;
}
