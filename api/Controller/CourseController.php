<?php
require_once __DIR__.'/../Model/CourseModel.php';
require_once __DIR__.'/../Utils.php';
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
if ($action == 'getCourseList'){
    $offset = $rq['offset'];
    $itemPerPage = $rq['itemPerPage'];
    $keyword = $rq['keyword'];
    $cateid = $rq['cateid'];
    $teacherid = $rq['teacherid'];
    $mycourse = $rq['mycourse'];
    $searchby = $rq['searchby'];
    $sortby = $rq['sortby'];
    $orderby = $rq['orderby'];
    //anti sql injection in keyword
    if ($searchby != 'name' && $searchby != 'cate' && $searchby != 'teacher')
        $searchby = 'name';
    if ($sortby != 'rate' && $sortby != 'cost' && $sortby != 'student')
        $sortby = 'rate';
    if ($orderby != 'asc' && $orderby != 'desc')
        $orderby = 'asc';
    if (!is_numeric($cateid) || (int)$cateid < 0)
        $cateid = 0;
    if (!is_numeric($teacherid) || (int)$teacherid < 0)
        $teacherid = 0;
    if (!is_numeric($mycourse) || (int)$mycourse < 0 || (int)$mycourse > 1)
        $mycourse = 0;
    if (!is_numeric($offset) || (int)$offset < 0)
        $offset = 0;
    if (!is_numeric($itemPerPage) || (int)$itemPerPage <= 0)
        $itemPerPage = 10;
    try {
        $res = handleGetCourseList($offset, $itemPerPage, $keyword, $cateid, $teacherid, $mycourse, $searchby, $sortby, $orderby);
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
    //end day has format yyyy-mm-dd, check if it is < start day + 21 day
    if (strtotime($enddate) < strtotime($startdate) + 21 * 24 * 60 * 60){
        $res['status'] = -2;
        $res['message'] = 'Ngày kết thúc phải lớn hơn ngày bắt đầu ít nhất 21 ngày!';
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
    if (strlen($idnumber) > 100 || strlen($idnumber) == 0){
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
    if (isset($_SESSION['role']) && $_SESSION['role'] != 2){
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
else if ($action == 'getCourse'){
    $courseid = $rq['courseid'];
    //validate
    if (!is_numeric($courseid) || (int)$courseid <= 0){
        $res['status'] = -2;
        $res['message'] = 'ID khóa học không hợp lệ!';
        echo json_encode($res);
        return;
    }
    try {
        
        $res = getCourse($courseid);
        $canRate = false;
        if(!isset($_SESSION['id'])){
            $canRate = false;
        }
        else{
            $myid = $_SESSION['id'];
            $res2 = checkRateCourse($myid, $courseid);
            if ($res2['status'] == 0){
                $canRate = true;
            }
        }
        $res['canRate'] = $canRate;
        if ($res['status'] == 0){
            $res['message'] = '';
            echo json_encode($res);
            return;
        }
        if ($res['status'] == -1){
            $res['message'] = 'Id khóa học không hợp lệ!';
            echo json_encode($res);
            return;
        }
        if ($res['status'] == -2){
            $res['message'] = 'Khóa học đã đủ số lượng học viên!';
            echo json_encode($res);
            return;
        }
        if ($res['status'] == -3){
            $res['message'] = 'Khóa học đã hết hạn đăng ký!';
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
}
else if ($action == 'buyCourses'){
    $cart = $rq['cart'];
    //if cart is empty
    if (count($cart) == 0){
        $res['status'] = -2;
        $res['message'] = 'Giỏ hàng trống!';
        echo json_encode($res);
        return;
    }
    //validate
    //cart is array of object, each object has courseid is one of the key
    //get list of courseid
    $courseids = array();
    foreach ($cart as $item){
        $courseids[] = $item['courseid'];
    }
    //check if all courseid is valid
    foreach ($courseids as $courseid){
        if (!is_numeric($courseid) || (int)$courseid <= 0){
            $res['status'] = -2;
            $res['message'] = 'ID khóa học không hợp lệ!';
            echo json_encode($res);
            return;
        }
    }
    //check if all courseid is exist
    try {
        foreach ($courseids as $courseid){
            $res = getCourse($courseid);
            if ($res['status'] == -1){
                $res['status'] = -2;
                $res['message'] = 'Một số khóa học không tồn tại!';
                echo json_encode($res);
                return;
            }
        }
        //all courseid is valid and exist
        $res = buyCourses($courseids);
        if ($res['status'] == 0){
            $res['message'] = 'Đã mua thành công!';
            echo json_encode($res);
            return;
        }
        else if ($res['status'] == -1){
            $res['message'] = 'Bạn không đủ tiền để mua hết các khóa học này!';
            echo json_encode($res);
            return;
        }
        else if ($res['status'] == -2){
            $res['message'] = 'Bạn đã mua một trong các khóa học này!';
            echo json_encode($res);
            return;
        }
        else if ($res['status'] == -3){
            $res['message'] = 'Bạn chưa đăng nhập!';
            echo json_encode($res);
            return;
        }
        else if ($res['status'] == -4 || $res['status'] == -5){
            $msg = '';
            if ($res['status'] == -4)
                $msg = "Có sự trùng lặp thời khóa biểu giữa các khóa học trong giỏ hàng";
            else $msg = "Có sự trùng lặp thời khóa biểu giữa khóa học trong giỏ hàng với khóa học của bạn";
                
            $res['message']  = $msg.', khóa học: ' . $res['data']['fullname']
            . ', ngày bắt đầu trùng lặp: '. $res['data']['startdate']
            . ', ngày kết thúc trùng lặp: '. $res['data']['enddate']
            . ', thứ trùng lặp: ' . $res['data']['day'] //thứ 2, thứ 3, ...
            . ', giờ bắt đầu: ' . $res['data']['start']
            . ', giờ kết thúc: ' . $res['data']['end'];
            echo json_encode($res);
            return;
        }


        
    }
    catch (Throwable $th) {
        $res['status'] = -4;
        $res['message'] = 'Đã có lỗi xảy ra!';
        echo json_encode($res);
        return;
    }
}
else if ($action == 'getMemberList'){
    $courseid = $rq['courseid'];
    //validate
    if (!is_numeric($courseid) || (int)$courseid <= 0){
        $res['status'] = -1;
        $res['message'] = 'ID khóa học không hợp lệ!';
        echo json_encode($res);
        return;
    }
    //check if login 
    if (!isset($_SESSION['id'])){
        $res['status'] = -3;
        $res['message'] = 'Bạn chưa đăng nhập!';
        echo json_encode($res);
        return;
    }
    try {
        $res = getMemberList($courseid);
        if ($res['status'] == 0){
            $res['message'] = '';
            echo json_encode($res);
            return;
        }
        if ($res['status'] == -2){
            $res['message'] = 'Khóa học không tồn tại!';
            echo json_encode($res);
            return;
        }
        if ($res['status'] == -4){
            $res['message'] = 'Bạn không thuộc khóa học này!';
            echo json_encode($res);
            return;
        }
    }
    catch (Throwable $th) {
        $res['status'] = -5;
        $res['message'] = 'Đã có lỗi xảy ra!';
        echo json_encode($res);
        return;
    }
}
else if ($action == 'getSchedule'){
    $monday = $rq['monday'];
    $sunday = $rq['sunday'];
    //validate yyyy-mm-dd
    $regex = '/^([0-9]{4})-([0-9]{2})-([0-9]{2})$/';
    if (!preg_match($regex, $monday) || !preg_match($regex, $sunday)){
        $res['status'] = -1;
        $res['message'] = 'Ngày không hợp lệ!';
        echo json_encode($res);
        return;
    }
    //check if login
    if (!isset($_SESSION['id'])){
        $res['status'] = -3;
        $res['message'] = 'Bạn chưa đăng nhập!';
        echo json_encode($res);
        return;
    }
    try {
        $res = getSchedule($monday, $sunday);
        if ($res['status'] == 0){
            $res['message'] = '';
            echo json_encode($res);
            return;
        }
        if ($res['status'] == -2){
            $res['message'] = 'Không có lịch học trong khoảng thời gian này!';
            echo json_encode($res);
            return;
        }
    }
    catch (Throwable $th) {
        $res['status'] = -4;
        $res['message'] = 'Đã có lỗi xảy ra!';
        echo json_encode($res);
        return;
    }
}
else if ($action == 'getCourseComment'){
    $courseid = $rq['courseid'];
    $offset = $rq['offset'];
    //validate
    if (!is_numeric($courseid) || (int)$courseid <= 0){
        $res['status'] = -1;
        $res['message'] = 'ID khóa học không hợp lệ!';
        echo json_encode($res);
        return;
    }
    if (!is_numeric($offset) || (int)$offset < 0){
        $res['status'] = -2;
        $res['message'] = 'Offset không hợp lệ!';
        echo json_encode($res);
        return;
    }
    try {
        $res = getCourseComment($courseid,$offset);
        if ($res['status'] == 0){
            $res['message'] = '';
            echo json_encode($res);
            return;
        }
    }
    catch (Throwable $th) {
        $res['status'] = -4;
        $res['message'] = 'Đã có lỗi xảy ra!';
        echo json_encode($res);
        return;
    }
}
else if ($action == 'deleteComment'){
    $id = $rq['id'];
    //validate
    if (!is_numeric($id) || (int)$id <= 0){
        $res['status'] = -1;
        $res['message'] = 'ID bình luận không hợp lệ!';
        echo json_encode($res);
        return;
    }
    //check if admin
    if (isset($_SESSION['role']) && $_SESSION['role'] != 2){
        $res['status'] = -2;
        $res['message'] = 'Bạn không có quyền xóa bình luận!';
        echo json_encode($res);
        return;
    }
    try {
        $res = deleteComment($id);
        if ($res['status'] == 0){
            $res['message'] = 'Xóa bình luận thành công!';
            echo json_encode($res);
            return;
        }
        if ($res['status'] == -2){
            $res['message'] = 'Bình luận không tồn tại!';
            echo json_encode($res);
            return;
        }
    }
    catch (Throwable $th) {
        $res['status'] = -4;
        $res['message'] = 'Đã có lỗi xảy ra!';
        echo json_encode($res);
        return;
    }
}
else if ($action == 'rateCourse'){
    $courseid = $rq['courseid'];
    $userrate = $rq['userrate'];
    $usercomment = $rq['usercomment'];
    //validate
    if (!is_numeric($courseid) || (int)$courseid <= 0){
        $res['status'] = -1;
        $res['message'] = 'ID khóa học không hợp lệ!';
        echo json_encode($res);
        return;
    }
    if (!is_numeric($userrate) || (int)$userrate < 0 || (int)$userrate > 5){
        $res['status'] = -2;
        $res['message'] = 'Đánh giá không hợp lệ!';
        echo json_encode($res);
        return;
    }
    //check if login
    if (!isset($_SESSION['id'])){
        $res['status'] = -3;
        $res['message'] = 'Bạn chưa đăng nhập!';
        echo json_encode($res);
        return;
    }
    $userid = $_SESSION['id'];
    try {
        $res = rateCourse($userid,$courseid, $userrate,$usercomment);
        if ($res['status'] == 0){
            $res['message'] = 'Đánh giá thành công!';
            echo json_encode($res);
            return;
        }
        if ($res['status'] == -1){
            $res['message'] = 'Khóa học chưa kết thúc!';
            echo json_encode($res);
            return;
        }
        if ($res['status'] == -2){
            $res['message'] = 'Bạn đã đánh giá khóa học này!';
            echo json_encode($res);
            return;
        }
        if ($res['status'] == -3){
            $res['message'] = 'Bạn không có quyền đánh giá khóa học này!';
            echo json_encode($res);
            return;
        }
        if ($res['status'] == -4){
            $res['message'] = 'Khóa học đã kết thúc hơn 1 tháng, không thể đánh giá!';
            echo json_encode($res);
            return;
        }
    }
    catch (Throwable $th) {
        $res['status'] = -5;
        $res['message'] = 'Đã có lỗi xảy ra!';
        echo json_encode($res);
        return;
    }

}
else if ($action == 'getIncome'){
    if (!isset($_SESSION['role']) || $_SESSION['role'] == 0){
        $res['status'] = -1;
        $res['message'] = 'Bạn không có quyền truy cập!';
        echo json_encode($res);
        return;
    }
    $firstDay = $rq['firstDay'];
    $lastDay = $rq['lastDay'];
    $offset = $rq['offset'];
    if ($_SESSION['role'] == 2){
        $teacherId = $rq['teacherId'];
    }
    else if($_SESSION['role'] == 1) {
        $teacherId = $_SESSION['id'];
    }
    else{
        $res['status'] = -1;
        $res['message'] = 'Bạn không có quyền truy cập!';
        echo json_encode($res);
        return;
    }
    //validate
    if (!is_numeric($offset) || (int)$offset < 0){
        $res['status'] = -2;
        $res['message'] = 'Offset không hợp lệ!';
        echo json_encode($res);
        return;
    }
    //format yyyy-mm-dd
    $regex = '/^([0-9]{4})-([0-9]{2})-([0-9]{2})$/';
    if (!preg_match($regex, $firstDay) || !preg_match($regex, $lastDay)){
        $res['status'] = -2;
        $res['message'] = 'Ngày không hợp lệ!';
        echo json_encode($res);
        return;
    }
    try {
        $res = getIncome($firstDay, $lastDay, $teacherId, $offset);
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
}
else if ($action == 'getIncomeAll'){
    $offset = $rq['offset'];
    $firstDay = $rq['firstDay'];
    $lastDay = $rq['lastDay'];
    if (!isset($_SESSION['role']) || $_SESSION['role'] != 2){
        $res['status'] = -1;
        $res['message'] = 'Bạn không có quyền truy cập!';
        echo json_encode($res);
        return;
    }
    //validate
    if (!is_numeric($offset) || (int)$offset < 0){
        $res['status'] = -2;
        $res['message'] = 'Offset không hợp lệ!';
        echo json_encode($res);
        return;
    }
    //format yyyy-mm-dd
    $regex = '/^([0-9]{4})-([0-9]{2})-([0-9]{2})$/';
    if (!preg_match($regex, $firstDay) || !preg_match($regex, $lastDay)){
        $res['status'] = -2;
        $res['message'] = 'Ngày không hợp lệ!';
        echo json_encode($res);
        return;
    }
    try {
        $res = getIncomeAll($firstDay, $lastDay, $offset);
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
}