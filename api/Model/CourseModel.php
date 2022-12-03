<?php
//set timezone gmt+7
date_default_timezone_set('Asia/Ho_Chi_Minh');
function handleGetCate($keyword, $sortby, $orderby, $offset, $itemPerPage){
    require_once '../connectDB.php';

    if (!isset($_SESSION)) {
        session_start();
    }
    $CONN = connectDB();
    $cateTable = $DBS['prefix'] . "course_categories";
    $keyword = mysqli_real_escape_string($CONN, $keyword);
    if ($keyword == ''){
        //first count total
        $sql = "SELECT COUNT(*) FROM $cateTable";
        $result = mysqli_query($CONN, $sql);
        $row = mysqli_fetch_array($result);
        $total = $row[0];
        //now get data
        $sql = "SELECT id, name, idnumber, description,coursecount,avatar FROM $cateTable ORDER BY $sortby $orderby LIMIT $offset, $itemPerPage";
        $result = mysqli_query($CONN, $sql);
        $data = array();
        while ($row = mysqli_fetch_array($result)){
            $data[] = array(
                'id' => $row['id'],
                'name' => $row['name'],
                'IDNumber' => $row['idnumber'],
                'desc' => $row['description'],
                'courseCount' => $row['coursecount'],
                'avatar' => $row['avatar']
            );
        }
        $res = array(
            'status'=> 0,
            'message' => '',
            'data' => array(
                'total' => $total,
                'data' => $data
            )
        );
        return $res;
    }
    else{
        //first count total
        $sql = "SELECT COUNT(*) FROM $cateTable WHERE $sortby LIKE '%$keyword%'";
        $result = mysqli_query($CONN, $sql);
        $row = mysqli_fetch_array($result);
        $total = $row[0];
        //now get data
        $sql = "SELECT id, name, idnumber, description,coursecount,avatar FROM $cateTable WHERE $sortby LIKE '%$keyword%' ORDER BY $sortby $orderby LIMIT $offset, $itemPerPage";
        $result = mysqli_query($CONN, $sql);
        $data = array();
        while ($row = mysqli_fetch_array($result)){
            $data[] = array(
                'id' => $row['id'],
                'name' => $row['name'],
                'IDNumber' => $row['idnumber'],
                'desc' => $row['description'],
                'courseCount' => $row['coursecount'],
                'avatar' => $row['avatar']
            );
        }
        $res = array(
            'status'=> 0,
            'message' => '',
            'data' => array(
                'total' => $total,
                'data' => $data
            )
        );
        return $res;
    }
    
}
function addCoursePending($fullname, $shortname, $schedule, $category, $startdate, $enddate, $idnumber, $desc, $cost, $imageLink){
    require_once '../connectDB.php';
    // require_once '../Utils.php';
    if (!isset($_SESSION)) {
        session_start();
    }
    $CONN = connectDB();
    $fullname = mysqli_real_escape_string($CONN, $fullname);
    $shortname = mysqli_real_escape_string($CONN, $shortname);
    $startdate = strtotime($startdate);
    $enddate = strtotime($enddate);
    $idnumber = mysqli_real_escape_string($CONN, $idnumber);
    $desc = mysqli_real_escape_string($CONN, $desc);
    $CONN = connectDB();
    $coursePendingTable = "course_pending";
    $userid = $_SESSION['id'];
    $time = time();
    $sql = '';

    //now check if shortname is existed
    $sql = "SELECT id FROM $coursePendingTable WHERE shortname = '$shortname'";
    $result = mysqli_query($CONN, $sql);
    if (mysqli_num_rows($result) > 0 || $shortname == 'saru'){// default shortname in table course
        $res = array(
            'status'=> -1,
            'message' => ''
        );
        return $res;
    }
    //now check if idnumber is existed
    if ($idnumber != ''){
        $sql = "SELECT id FROM $coursePendingTable WHERE idnumber = '$idnumber'";
        $result = mysqli_query($CONN, $sql);
        if (mysqli_num_rows($result) > 0){
            $res = array(
                'status'=> -2,
                'message' => ''
            );
            return $res;
        }
    }
    

    if ($imageLink == null){
        $sql = "INSERT INTO $coursePendingTable (fullname, shortname, schedule, category, startdate, enddate, idnumber, summary, cost, userid, time) VALUES ('$fullname', '$shortname', '$schedule', '$category', '$startdate', '$enddate', '$idnumber', '$desc', '$cost', '$userid', '$time')";
    }
    else{
        $sql = "INSERT INTO $coursePendingTable (fullname, shortname, schedule, category, startdate, enddate, idnumber, summary, cost, image, userid, time) VALUES ('$fullname', '$shortname', '$schedule', '$category', '$startdate', '$enddate', '$idnumber', '$desc', '$cost', '$imageLink', '$userid', '$time')";
    }
    
    $result = mysqli_query($CONN, $sql);
    //get inserted id
    $insertedId = mysqli_insert_id($CONN);
    if ($idnumber == ''){
        $idnumber = 'C' . $insertedId;
        $sql = "UPDATE $coursePendingTable SET idnumber = '$idnumber' WHERE id = $insertedId";
        $result = mysqli_query($CONN, $sql);
    }
    if (!$result){
        throw new Exception(mysqli_error($CONN));
    }
    $res = array(
        'status'=> 0,
        'message' => '',
    );
    return $res;
    
}
function getCoursePending($offset){
    require_once '../connectDB.php';
    if (!isset($_SESSION)) {
        session_start();
    }
    $CONN = connectDB();
    $coursePendingTable = "course_pending";
    $userTable = $DBS['prefix'] . "user";
    $cateTable = $DBS['prefix'] . "course_categories";
    //first count total
    $sql = "SELECT COUNT(*) FROM $coursePendingTable";
    $result = mysqli_query($CONN, $sql);
    $row = mysqli_fetch_array($result);
    $total = $row[0];
    //now count total pending = 0
    $sql = "SELECT COUNT(*) FROM $coursePendingTable WHERE pending = 0";
    $result = mysqli_query($CONN, $sql);
    $row4 = mysqli_fetch_array($result);
    $totalPending = $row4[0];
    //now count total pending = 1
    $sql = "SELECT COUNT(*) FROM $coursePendingTable WHERE pending = 1";
    $result = mysqli_query($CONN, $sql);
    $row4 = mysqli_fetch_array($result);
    $totalAccept = $row4[0];
    //now get data
    $sql = "SELECT id,fullname,shortname,schedule,category,startdate,enddate,idnumber,summary,cost,image,userid,pending,time
            FROM $coursePendingTable ORDER BY pending, time LIMIT $offset, 10";
    $result = mysqli_query($CONN, $sql);
    $data = array();
    while ($row = mysqli_fetch_array($result)){
        //take name
        $userId = $row['userid'];
        $sql = "SELECT lastname, firstname FROM $userTable WHERE id = '$userId'";
        $result2 = mysqli_query($CONN, $sql);
        $row2 = mysqli_fetch_array($result2);
        //take category name
        $sql = "SELECT name FROM $cateTable WHERE id = '$row[category]'";
        $result2 = mysqli_query($CONN, $sql);
        $row3 = mysqli_fetch_array($result2);
        $data[] = array(
            'id' => $row['id'],
            'fullName' => $row['fullname'],
            'shortName' => $row['shortname'],
            'schedule' => $row['schedule'],
            'cateId' => $row['category'],
            'cateName' => $row3['name'],
            'startDay' => $row['startdate'],
            'endDay' => $row['enddate'],
            'idNumber' => $row['idnumber'],
            'description' => $row['summary'],
            'cost' => $row['cost'],
            'image' => $row['image'],
            'uploaderId' => $row['userid'],
            'uploaderName' => $row2['lastname'] . ' ' . $row2['firstname'],
            'pending' => $row['pending'],
            'time' => $row['time']
        );
    }
    $res = array(
        'status'=> 0,
        'message' => '',
        'data' => array(
            'total' => $total,
            'data' => $data,
            'totalPending' => $totalPending,
            'totalAccept' => $totalAccept
        )
    );
    return $res;
}
function getMyCoursePending($offset, $userId){
    require_once '../connectDB.php';
    if (!isset($_SESSION)) {
        session_start();
    }
    $CONN = connectDB();
    $coursePendingTable = "course_pending";
    $userTable = $DBS['prefix'] . "user";
    $cateTable = $DBS['prefix'] . "course_categories";
    //first count total
    $sql = "SELECT COUNT(*) FROM $coursePendingTable WHERE userid = '$userId'";
    $result = mysqli_query($CONN, $sql);
    $row = mysqli_fetch_array($result);
    $total = $row[0];
    //now count total pending = 0
    $sql = "SELECT COUNT(*) FROM $coursePendingTable WHERE pending = 0 AND userid = '$userId'";
    $result = mysqli_query($CONN, $sql);
    $row4 = mysqli_fetch_array($result);
    $totalPending = $row4[0];
    //now count total pending = 1
    $sql = "SELECT COUNT(*) FROM $coursePendingTable WHERE pending = 1 AND userid = '$userId'";
    $result = mysqli_query($CONN, $sql);
    $row4 = mysqli_fetch_array($result);
    $totalAccept = $row4[0];
    //now get data
    $sql = "SELECT id,fullname,shortname,schedule,category,startdate,enddate,idnumber,summary,cost,image,userid,pending,time
            FROM $coursePendingTable WHERE userid = '$userId' ORDER BY pending, time LIMIT $offset, 10";
    $result = mysqli_query($CONN, $sql);
    $data = array();
    while ($row = mysqli_fetch_array($result)){
        //take name
        // $userId = $row['userid'];
        $sql = "SELECT lastname, firstname FROM $userTable WHERE id = '$userId'";
        $result2 = mysqli_query($CONN, $sql);
        $row2 = mysqli_fetch_array($result2);
        //take category name
        $sql = "SELECT name FROM $cateTable WHERE id = '$row[category]'";
        $result2 = mysqli_query($CONN, $sql);
        $row3 = mysqli_fetch_array($result2);
        $data[] = array(
            'id' => $row['id'],
            'fullName' => $row['fullname'],
            'shortName' => $row['shortname'],
            'schedule' => $row['schedule'],
            'cateId' => $row['category'],
            'cateName' => $row3['name'],
            'startDay' => $row['startdate'],
            'endDay' => $row['enddate'],
            'idNumber' => $row['idnumber'],
            'description' => $row['summary'],
            'cost' => $row['cost'],
            'image' => $row['image'],
            'uploaderId' => $row['userid'],
            'uploaderName' => $row2['lastname'] . ' ' . $row2['firstname'],
            'pending' => $row['pending'],
            'time' => $row['time']
        );
    }
    $res = array(
        'status'=> 0,
        'message' => '',
        'data' => array(
            'total' => $total,
            'data' => $data,
            'totalPending' => $totalPending,
            'totalAccept' => $totalAccept
        )
    );
    return $res;
}
function acceptCourse($id){
    require_once '../connectDB.php';
    if (!isset($_SESSION)) {
        session_start();
    }
    $CONN = connectDB();
    $coursePendingTable = "course_pending";
    //now get schedule data
    $sql = "SELECT fullname,schedule,startdate,enddate,userid FROM $coursePendingTable WHERE pending = 1 OR pending = 3 OR pending = 4 AND enddate > NOW()";
    $result = mysqli_query($CONN, $sql);
    $scheData = array();
    while ($row = mysqli_fetch_array($result)){
        $scheData[] = array(
            'fullname' => $row['fullname'],
            'schedule' => $row['schedule'],
            'startdate' => $row['startdate'],
            'enddate' => $row['enddate'],
            'userid' => $row['userid']
        );
    }
    //now get this course data
    $sql = "SELECT fullname,schedule,startdate,enddate,userid FROM $coursePendingTable WHERE id = '$id' AND pending = 0";
    $result = mysqli_query($CONN, $sql);
    $row = mysqli_fetch_array($result);
    $courseData = array(
        'fullname' => $row['fullname'],
        'schedule' => $row['schedule'],
        'startdate' => $row['startdate'],
        'enddate' => $row['enddate'],
        'userid' => $row['userid']
    );
    //now check overlap
    foreach ($scheData as $sche){
        if ($sche['userid'] == $courseData['userid']){
            $res = checkOverlapSche($sche, $courseData);
            if ($res['isOverlap']){
                $res['data']['fullname'] = $sche['fullname'];
                $res2 = array(
                    'status'=> -4,
                    'message' => '',
                    'data' => $res['data']
                );
                return $res2;
                
            }
            else{
                //do nothing
            }
        }
        
    }
    //now update because no overlap
    $sql = "UPDATE $coursePendingTable SET pending = 1 WHERE id = '$id' AND pending = 0";
    $result = mysqli_query($CONN, $sql);

    $res = array(
        'status'=> 0,
        'message' => '',
    );
    return $res;
}
function rejectCourse($id){
    require_once '../connectDB.php';
    if (!isset($_SESSION)) {
        session_start();
    }
    $CONN = connectDB();
    $coursePendingTable = "course_pending";
    $sql = "UPDATE $coursePendingTable SET pending = 2 WHERE id = $id AND pending = 0";
    $result = mysqli_query($CONN, $sql);
    if (!$result){
        throw new Exception(mysqli_error($CONN));
    }
    $res = array(
        'status'=> 0,
        'message' => '',
    );
    return $res;
}
function checkStartDate($offset){
    require_once '../connectDB.php';
    if (!isset($_SESSION)) {
        session_start();
    }
    $CONN = connectDB();
    $coursePendingTable = "course_pending";
    //now get data
    $sql = "SELECT id,startdate
            FROM $coursePendingTable WHERE pending = 0 ORDER BY time LIMIT $offset, 10";
    $result = mysqli_query($CONN, $sql);
    $data = array();
    $isExp = false;
    while ($row = mysqli_fetch_array($result)){
        $data[] = array(
            'id' => $row['id'],
            'startDay' => date('Y-m-d', $row['startdate']),
            'isExp' => false
        );
    }
    for ($i = 0; $i < count($data); $i++){
        $today = date("Y-m-d");
        $startDay = $data[$i]['startDay'];
        if ($startDay <= $today){
            $data[$i]['isExp'] = true;
            $isExp = true;
        }
    }
    //now update
    if ($isExp){
        for ($i = 0; $i < count($data); $i++){
            if ($data[$i]['isExp']){
                $id = $data[$i]['id'];
                $sql = "UPDATE $coursePendingTable SET pending = 2 WHERE id = $id AND pending = 0";
                $result = mysqli_query($CONN, $sql);
                if (!$result){
                    throw new Exception(mysqli_error($CONN));
                }
            }
        }
    }
    $res = array(
        'status'=> 0,
        'message' => '',
        'data' => array(
            'isExp' => $isExp
        )
    );
    return $res;

}
function saveCsvCourse(){
    require_once '../connectDB.php';
    if (!isset($_SESSION)) {
        session_start();
    }
    $CONN = connectDB();
    $coursePendingTable = "course_pending";
    $userTable = $DBS['prefix'] . "user";
    $sql = "SELECT fullname,shortname,category,startdate,enddate,summary,userid,idnumber FROM $coursePendingTable WHERE pending = 1";
    $result = mysqli_query($CONN, $sql);
    //if no data
    if (mysqli_num_rows($result) == 0){
        $res = array(
            'status'=> -2,
        );
        return $res;
    }
    $data = array();
    while ($row = mysqli_fetch_array($result)){
        //get email
        $userid = $row['userid'];
        $sql = "SELECT lastname,firstname,email FROM $userTable WHERE id = $userid";
        $result2 = mysqli_query($CONN, $sql);
        $row2 = mysqli_fetch_array($result2);
        $data[] = array(
            'fullname' => $row['fullname'],
            'shortname' => $row['shortname'],
            'category' => $row['category'],
            'startdate' => date('Y-m-d', $row['startdate']),
            'enddate' => date('Y-m-d', $row['enddate']),
            'summary' => $row['summary'],
            'idnumber' => $row['idnumber'],
            'enrolment_1' => 'self',
            'enrolment_1_role' => 'editingteacher',
            'enrolment_1_password' => randomString(),

            'email' => $row2['email'],
            'userfullname' => $row2['lastname'] . ' ' . $row2['firstname'],
            'userid' => $row['userid']
        );
    }
    //now update pending to 3
    $sql = "UPDATE $coursePendingTable SET pending = 3 WHERE pending = 1";
    $result = mysqli_query($CONN, $sql);
    //now add to csv table
    $csv = array2Csv($data);
    $csvTable = "csv";
    $userid = $_SESSION['id'];
    $sql = "INSERT INTO $csvTable (type,data,pending,userid,time) VALUES ('course','$csv',0,'$userid'," . time() . ")";
    $result = mysqli_query($CONN, $sql);
    $res = array(
        'status'=> 0,
        'message' => '',
    );
    return $res;
}
function getCourseCsv(){
    require_once '../connectDB.php';
    if (!isset($_SESSION)) {
        session_start();
    }
    $CONN = connectDB();
    $csvTable = "csv";
    $userTable = $DBS['prefix'] . "user";
    //first count number of csv
    $sql = "SELECT COUNT(*) FROM $csvTable WHERE type = 'course'";
    $result = mysqli_query($CONN, $sql);
    $row = mysqli_fetch_array($result);
    $total = $row[0];
    //now count number of csv pending = 0
    $sql = "SELECT COUNT(*) FROM $csvTable WHERE type = 'course' AND pending = 0";
    $result = mysqli_query($CONN, $sql);
    $row = mysqli_fetch_array($result);
    $totalUnconfirm = $row[0];
    $sql = "SELECT id,data,userid,pending,time FROM $csvTable WHERE type = 'course' ORDER BY pending,time";
    $result = mysqli_query($CONN, $sql);
    $data = array();
    while ($row = mysqli_fetch_array($result)){
        //get name of user
        $userid = $row['userid'];
        $sql = "SELECT lastname,firstname FROM $userTable WHERE id = $userid";
        $result2 = mysqli_query($CONN, $sql);
        $row2 = mysqli_fetch_array($result2);
        $confirmerName = $row2['lastname'] . ' ' . $row2['firstname'];
        //get shortname list from data
        $arr = csv2Array($row['data']);
        $shortnameList = array();
        for ($i = 0; $i < count($arr); $i++){
            $shortnameList[] = $arr[$i]['shortname'];
        }
        //convert shortname list to string with comma
        $shortnameList = implode(', ', $shortnameList);
        $data[] = array(
            'id' => $row['id'],
            'data' => $row['data'],
            'shortNameList' => $shortnameList,
            'confirmerId' => $row['userid'],
            'confirmerName' => $confirmerName,
            'pending' => $row['pending'],
            'time' => $row['time']
        );
    }
    $res = array(
        'status'=> 0,
        'message' => '',
        'data' => array(
            'total' => $total,
            'totalUnconfirm' => $totalUnconfirm,
            'data' => $data
        )
    );
    return $res;
}
function confirmCourseCsv($id){
    require_once '../connectDB.php';
    if (!isset($_SESSION)) {
        session_start();
    }
    $home = $DBS["home"];
    $CONN = connectDB();
    $csvTable = "csv";
    $courseTable = $DBS['prefix'] . "course";
    $coursePendingTable = "course_pending";
    $sql = "SELECT data FROM $csvTable WHERE id = $id AND type = 'course' AND pending = 0";
    $result = mysqli_query($CONN, $sql);
    $row = mysqli_fetch_array($result);
    $data = csv2Array($row['data']);
    //check is really uploader?
    $shortname = $data[0]['shortname'];
    $sql = "SELECT pending FROM $coursePendingTable WHERE shortname = '$shortname'";
    $result = mysqli_query($CONN, $sql);
    $row = mysqli_fetch_array($result);
    $pending = $row['pending'];
    if ($pending != 4){
        $res = array(
            'status'=> -1,
        );
        return $res;
    }
    //now send mail
    for ($i = 0; $i < count($data); $i++){
        $email = $data[$i]['email'];
        $userfullname = $data[$i]['userfullname'];
        $fullname = $data[$i]['fullname'];
        $shortname = $data[$i]['shortname'];
        $password = $data[$i]['enrolment_1_password'];
        //get id of course
        $sql = "SELECT id FROM $courseTable WHERE shortname = '$shortname'";
        $result = mysqli_query($CONN, $sql);
        $row = mysqli_fetch_array($result);
        $courseid = $row['id'];
        //now send mail
        $subject = "[Moodle] Khóa học '$fullname' đã được tạo";
        $body = "<p>Xin chào $userfullname,</p>
        <p>Khóa học <b>$fullname ($shortname)</b> đã được tạo.</p>
        <p>Để truy cập vào khóa học, bạn vui lòng truy cập vào đường dẫn sau:
        <a href=$home/enrol/index.php?id=$courseid>$fullname</a></p>
        <p>Mật khẩu ghi danh của bạn là: <b>$password</b></p>
        <p>Trân trọng,</p>
        <p>Edulogy</p>";
        sendMail([$email], $subject, $body);
    }
    //now update pending
    $sql = "UPDATE $csvTable SET pending = 1 WHERE id = $id AND type = 'course' AND pending = 0";
    $result = mysqli_query($CONN, $sql);
    $res = array(
        'status'=> 0,
        'message' => '',
    );
    return $res;
}