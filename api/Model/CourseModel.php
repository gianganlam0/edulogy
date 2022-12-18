<?php
//set timezone gmt+7
date_default_timezone_set('Asia/Ho_Chi_Minh');
function handleGetCourseList($offset, $itemPerPage, $keyword, $cateid, $teacherid, $mycourse, $searchby, $sortby, $orderby){
    require_once __DIR__.'/../connectDB.php';

    if (!isset($_SESSION)) {
        session_start();
    }
    $CONN = connectDB();
    $courseTable = "course";
    $threeDaysLater = time() + 3*24*60*60;
    $cond = " pending = 4 ";
    $keyword = mysqli_real_escape_string($CONN, $keyword);
    $cateid = (int)$cateid;
    $teacherid = (int)$teacherid;
    $mycourse = (int)$mycourse;
    $catecond = '';
    $teachercond = '';
    $keywordcond = '';
    $mycoursecond = '';
    switch($cateid){
        case 0:
            $catecond = "1";
            break;
        default:
            $catecond = " category = $cateid ";
            break;
    }
    switch($teacherid){
        case 0:
            $teachercond = "1";
            break;
        default:
            $teachercond = " teacherid = $teacherid ";
            break;
    }
    switch($searchby){
        case 'name':
            $searchby = 'fullname';
            break;
        case 'cate':
            $searchby = 'catename';
            break;
        case 'teacher':
            $searchby = 'teachername';
            break;
        default:
            $searchby = 'fullname';
            break;
    }
    switch($sortby){
        case 'rate':
            $sortby = 'rate';
            break;
        case 'cost':
            $sortby = 'cost';
            break;
        case 'student':
            $sortby = 'totaluser';
            break;
        default:
            $sortby = 'rate';
            break;
    }
    switch($keyword){
        case '':
            $keywordcond = "1";
            break;
        default:
            $keywordcond = " $searchby LIKE '%$keyword%' ";
            break;
    }
    if ($mycourse == 0){
        $mycoursecond = " startdate > $threeDaysLater AND totaluser < 100 ";
        $finalcond = "$cond AND $catecond AND $teachercond AND $keywordcond AND $mycoursecond";
        //first count total
        $sql = "SELECT COUNT(*) FROM $courseTable
        WHERE $finalcond";
        $result = mysqli_query($CONN, $sql);
        $row = mysqli_fetch_array($result);
        $total = $row[0];
        //now get data
        $sql = "SELECT * FROM $courseTable 
        WHERE $finalcond
        ORDER BY $sortby $orderby LIMIT $offset, $itemPerPage";
        $result = mysqli_query($CONN, $sql);
        $data = array();
        while ($row = mysqli_fetch_array($result)){
            $data[] = array(
                'id' => $row['id'],
                'idnumber' => $row['idnumber'],
                'courseId' => $row['courseid'],
                'fullname' => $row['fullname'],
                'shortname' => $row['shortname'],
                'cateId' => $row['category'],
                'cateName' => $row['catename'],
                'schedule' => $row['schedule'],
                'startdate' => $row['startdate'],
                'enddate' => $row['enddate'],
                'image' => $row['image'],
                'desc' => $row['summary'],
                'studentCount' => $row['totaluser'],
                'cost' => $row['cost'],
                'teacherId' => $row['teacherid'],
                'teacherName' => $row['teachername'],
                'rate' => $row['rate']
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
        $mycoursecond = " 1 ";
        $finalcond = "$cond AND $catecond AND $teachercond AND $keywordcond AND $mycoursecond";
        //first count total
        $myuserid = $_SESSION['id'];

        $sql = "SELECT COUNT(*) FROM
        course a
        INNER JOIN
        (SELECT courseid AS bid FROM course_user WHERE userid = $myuserid) b
        ON a.courseid=b.bid
        WHERE $finalcond";
        $result = mysqli_query($CONN, $sql);
        $row = mysqli_fetch_array($result);
        $total = $row[0];
        //now get data
        $sql = "SELECT * FROM
        course a
        INNER JOIN
        (SELECT courseid AS bid FROM course_user WHERE userid = $myuserid) b
        ON a.courseid=b.bid
        WHERE $finalcond
        ORDER BY $sortby $orderby LIMIT $offset, $itemPerPage";
        $result = mysqli_query($CONN, $sql);
        $data = array();
        while ($row = mysqli_fetch_array($result)){
            $data[] = array(
                'id' => $row['id'],
                'courseId' => $row['courseid'],
                'idnumber' => $row['idnumber'],
                'fullname' => $row['fullname'],
                'shortname' => $row['shortname'],
                'cateId' => $row['category'],
                'cateName' => $row['catename'],
                'schedule' => $row['schedule'],
                'startdate' => $row['startdate'],
                'enddate' => $row['enddate'],
                'image' => $row['image'],
                'desc' => $row['summary'],
                'studentCount' => $row['totaluser'],
                'cost' => $row['cost'],
                'teacherId' => $row['teacherid'],
                'teacherName' => $row['teachername'],
                'rate' => $row['rate']
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
    require_once __DIR__.'/../connectDB.php';
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
    $res = array(
        'status'=> 0,
        'message' => '',
    );
    return $res;
    
}
function getCoursePending($offset){
    require_once __DIR__.'/../connectDB.php';
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
            FROM $coursePendingTable ORDER BY
            CASE
                WHEN pending != 2 THEN pending
                ELSE 5
            END ASC,
            CASE WHEN pending = 0 THEN time END ASC,
            CASE WHEN pending != 0 THEN time END DESC
            LIMIT $offset, 10";
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
    require_once __DIR__.'/../connectDB.php';
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
            FROM $coursePendingTable WHERE userid = '$userId'
            ORDER BY
            CASE
                WHEN pending != 2 THEN pending
                ELSE 5
            END ASC,
            CASE WHEN pending = 0 THEN time END ASC,
            CASE WHEN pending != 0 THEN time END DESC
            LIMIT $offset, 10";
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
    require_once __DIR__.'/../connectDB.php';
    if (!isset($_SESSION)) {
        session_start();
    }
    $CONN = connectDB();
    $coursePendingTable = "course_pending";
    if (!isset($_SESSION['id'])){
        $res = array(
            'status'=> -1,
        );
        return $res;
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
    $teacherId = $courseData['userid'];
 
    $currTimestamp = time();
    //now get schedule data
    $sql = "SELECT fullname,schedule,startdate,enddate,userid FROM $coursePendingTable WHERE pending = 1 OR pending = 3 OR pending = 4 AND enddate > $currTimestamp";
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
    //now get schedule data in course I'm in but enddate > now
    $sql = "SELECT fullname,schedule,startdate,enddate,userid FROM
    course a
    INNER JOIN
    (SELECT courseid AS bid FROM course_user WHERE userid = $teacherId) b
    ON a.courseid=b.bid
    WHERE enddate > $currTimestamp";
    $result = mysqli_query($CONN, $sql);
    while ($row = mysqli_fetch_array($result)){
        $scheData[] = array(
            'fullname' => $row['fullname'],
            'schedule' => $row['schedule'],
            'startdate' => $row['startdate'],
            'enddate' => $row['enddate'],
            'userid' => $row['userid']
        );
    }
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
    require_once __DIR__.'/../connectDB.php';
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
    require_once __DIR__.'/../connectDB.php';
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
    require_once __DIR__.'/../connectDB.php';
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
    require_once __DIR__.'/../connectDB.php';
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
    require_once __DIR__.'/../connectDB.php';
    if (!isset($_SESSION)) {
        session_start();
    }
    $home = $DBS["home"];
    $CONN = connectDB();
    $csvTable = "csv";
    $courseTable = $DBS['prefix'] . "course";
    $coursePendingTable = "course_pending";
    $courseUserTable = "course_user";
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
    //now send mail and insert to course_user
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
        $userid = $data[$i]['userid'];
        //now insert to course_user
        $sql = "INSERT INTO $courseUserTable (courseid,userid,classrole) VALUES ($courseid,$userid,1)";
        mysqli_query($CONN, $sql);
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
function getCourse($courseid){
    require_once __DIR__.'/../connectDB.php';
    if (!isset($_SESSION)) {
        session_start();
    }
    $CONN = connectDB();
    $courseTable = "course";
    $courseUserTable = "course_user";
    $myid='';
    //check if is my course
    $isMyCourse = false;
    if (!isset($_SESSION['id'])){
        $isMyCourse = false;
    }
    else{
        $myid = $_SESSION['id'];      
        $sql = "SELECT * FROM $courseUserTable WHERE courseid = $courseid AND userid = $myid";
        $result = mysqli_query($CONN, $sql);
        if (mysqli_num_rows($result) != 0){
            $isMyCourse = true;
        }
    }
    if(!$isMyCourse){
        $threeDaysLater = time() + 3*24*60*60;
        $maxUser = 100;
        $sql = "SELECT * FROM $courseTable WHERE courseid = $courseid";
        $result = mysqli_query($CONN, $sql);
        $row = mysqli_fetch_array($result);
        //check if no result
        if (mysqli_num_rows($result) == 0){
            $res = array(
                'status'=> -1
            );
            return $res;
        }
        else{
            //check if expired
            // if ($row['startdate'] <= $threeDaysLater){
            if ($row['startdate'] <= $threeDaysLater){
                $res = array(
                    'status'=> -3
                );
                return $res;
            }
            //check if full
            if ($row['totaluser'] >= $maxUser){
                $res = array(
                    'status'=> -2
                );
                return $res;
            }
            //no error
            $row['canRate'] = false;
            $res = array(
                'status'=> 0,
                'data' => $row
            );
            return $res;
        }
    }
    else{
        //skip condition
        $sql = "SELECT * FROM $courseTable WHERE courseid = $courseid";
        $result = mysqli_query($CONN, $sql);
        $row = mysqli_fetch_array($result);
        $row['isMyCourse'] = true;
        $res2 = checkRateCourse($myid,$courseid);
        if ($res2['status'] == 0){
            $row['canRate'] = true;
        }
        else{
            $row['canRate'] = false;
        }
        $res = array(
            'status'=> 0,
            'data' => $row
        );
        return $res;
    }
        
}
///need check overlap sche
function buyCourses($idList){
    require_once __DIR__.'/../connectDB.php';
    if (!isset($_SESSION)) {
        session_start();
    }
    $CONN = connectDB();
    $courseTable = "course";
    $courseUserTable = "course_user";
    $coursePendingTable = "course_pending";
    $userTable = "user";
    $transTable = "transaction";
    $teacherIncomeTable = "teacher_income";
    //first get my balance
    if(!isset($_SESSION['id'])){
        $res = array(
            'status'=> -4,//not logged in
        );
        return $res;
    }
    $myid = $_SESSION['id'];
    $sql = "SELECT balance FROM $userTable WHERE userid = $myid";
    $result = mysqli_query($CONN, $sql);
    $row = mysqli_fetch_array($result);
    $myBalance = $row['balance'];
    //now get total price
    $totalPrice = 0;
    for ($i = 0; $i < count($idList); $i++){
        $courseid = $idList[$i];
        $sql = "SELECT cost FROM $courseTable WHERE courseid = $courseid";
        $result = mysqli_query($CONN, $sql);
        $row = mysqli_fetch_array($result);
        $totalPrice += $row['cost'];
    }
    //now check if enough balance
    if ($myBalance < $totalPrice){
        $res = array(
            'status'=> -1,//not enough balance
        );
        return $res;
    }
    //now check if already bought
    for ($i = 0; $i < count($idList); $i++){
        $courseid = $idList[$i];
        $sql = "SELECT * FROM $courseUserTable WHERE courseid = $courseid AND userid = $myid";
        $result = mysqli_query($CONN, $sql);
        if (mysqli_num_rows($result) != 0){
            $res = array(
                'status'=> -3,//already bought
            );
            return $res;
        }
    }
    //now check overlap schedule, status = -4 -5
    //get list course in cart
    $currTimestamp = time();
    //now get schedule data
    $scheData = array();
    //lay danh sach cac khoa hoc ma nguoi do lam giao vien
    $sql = "SELECT fullname,schedule,startdate,enddate,userid
    FROM $coursePendingTable 
    WHERE userid = $myid AND (pending = 1 OR pending = 3 OR pending = 4) AND enddate > $currTimestamp";
    $result = mysqli_query($CONN, $sql);
    while ($row = mysqli_fetch_array($result)){
        $scheData[] = $row;
    }
    //lay danh sach cac khoa hoc ma nguoi do dang hoc
    $sql = "SELECT fullname,schedule,startdate,enddate,userid FROM
    course a
    INNER JOIN
    (SELECT courseid AS bid FROM course_user WHERE userid = $myid) b
    ON a.courseid=b.bid
    WHERE enddate > $currTimestamp";
    $result = mysqli_query($CONN, $sql);
    while ($row = mysqli_fetch_array($result)){
        $scheData[] = $row;
    }
    //gio lay danh sach cac khoa hoc trong gio hang
    $cartCourseData = array();
    for ($i = 0; $i < count($idList); $i++){
        $courseid = $idList[$i];
        $sql = "SELECT fullname,schedule,startdate,enddate,userid
        FROM $courseTable 
        WHERE courseid = $courseid";
        $result = mysqli_query($CONN, $sql);
        $row = mysqli_fetch_array($result);
        $row['userid'] = $myid;
        $cartCourseData[] = $row;
    }
    
    //now check overlap each course in cart
    for ($i = 0; $i<count($cartCourseData);$i++){
        for($j=$i+1;$j<count($cartCourseData);$j++){
            $res = checkOverlapSche($cartCourseData[$i], $cartCourseData[$j]);
            if ($res['isOverlap']){
                $res['data']['fullname'] = $cartCourseData[$j]['fullname'];
                $res2 = array(
                    'status'=> -4,
                    'message' => '',
                    'data' => $res['data']
                );
                return $res2;
            }
        }
    }
    //now check overlap each course in cart with each course in schedule
    for ($i = 0; $i<count($cartCourseData);$i++){
        for($j=0;$j<count($scheData);$j++){
            $res = checkOverlapSche($cartCourseData[$i], $scheData[$j]);
            if ($res['isOverlap']){
                $res['data']['fullname'] = $scheData[$j]['fullname'];
                $res2 = array(
                    'status'=> -5,
                    'message' => '',
                    'data' => $res['data']
                );
                return $res2;
            }
        }
    }


    //now insert to course_user
    for ($i = 0; $i < count($idList); $i++){
        $courseid = $idList[$i];
        $sql = "INSERT INTO $courseUserTable (courseid,userid,classrole) VALUES ($courseid,$myid,0)";
        mysqli_query($CONN, $sql);
    }
    //now update balance
    if ($totalPrice == 0){
        $res = array(
            'status'=> 0,
        );
        return $res;
    }
    $newBalance = $myBalance - $totalPrice;
    $sql = "UPDATE $userTable SET balance = $newBalance WHERE userid = $myid";
    mysqli_query($CONN, $sql);

    //now insert to transaction
    //get list of name of course
    $courseNameList = array();
    for ($i = 0; $i < count($idList); $i++){
        $courseid = $idList[$i];
        $sql = "SELECT fullname FROM $courseTable WHERE courseid = $courseid";
        $result = mysqli_query($CONN, $sql);
        $row = mysqli_fetch_array($result);
        $courseNameList[] = $row['fullname'];
    }
    $courseNameListStr = implode(", ", $courseNameList);
    $content = "Mua các khóa học: $courseNameListStr";
    $sql = "INSERT INTO $transTable (userid,amount,content,time,type,status) VALUES ($myid,$totalPrice,'$content',$currTimestamp,'buy',1)";
    mysqli_query($CONN, $sql);
    
    //now add to teacher_income
    for ($i = 0; $i < count($idList); $i++){
        $courseid = $idList[$i];
        $sql = "SELECT cost,userid AS teacherid FROM $courseTable WHERE courseid = $courseid";
        $result = mysqli_query($CONN, $sql);
        $row = mysqli_fetch_array($result);
        $cost = $row['cost'];
        $teacherid = $row['teacherid'];
        $sql = "INSERT INTO $teacherIncomeTable (teacherid,studentid,courseid,amount,time) VALUES ($teacherid,$myid,$courseid,$cost,$currTimestamp)";
        mysqli_query($CONN, $sql);
    }

    $res = array(
        'status'=> 0,
    );
    return $res;
}
function getMemberList($courseid){
    require_once __DIR__.'/../connectDB.php';
    if (!isset($_SESSION)) {
        session_start();
    }
    $CONN = connectDB();
    $courseUserTable = "course_user";
    $userTable = $DBS['prefix']."user";
    $courseTable = 'course';
    //first check is course exist
    $sql = "SELECT * FROM $courseUserTable WHERE courseid = $courseid";
    $result = mysqli_query($CONN, $sql);
    if (mysqli_num_rows($result) == 0){
        $res = array(
            'status'=> -2,
        );
        return $res;
    }
    //now check are you in this course
    if (!isset($_SESSION['id'])){
        $res = array(
            'status'=> -3,
        );
        return $res;
    }
    $myid = $_SESSION['id'];
    $sql = "SELECT * FROM $courseUserTable WHERE courseid = $courseid AND userid = $myid";
    $result = mysqli_query($CONN, $sql);
    if (mysqli_num_rows($result) == 0){
        $res = array(
            'status'=> -4,
        );
        return $res;
    }
    //now get name of course
    $sql = "SELECT fullname FROM $courseTable WHERE courseid = $courseid";
    $result = mysqli_query($CONN, $sql);
    $row = mysqli_fetch_array($result);
    $courseName = $row['fullname'];
    //now check if i am teacher
    $sql = "SELECT * FROM $courseUserTable WHERE courseid = $courseid AND userid = $myid AND classrole = 1";
    $result = mysqli_query($CONN, $sql);
    if (mysqli_num_rows($result) == 0){
        $isTeacher = false;
    }
    else{
        $isTeacher = true;
    }
    //now get member list
    $sql = "SELECT userid,classrole FROM $courseUserTable WHERE courseid = $courseid ORDER BY classrole DESC";
    $result = mysqli_query($CONN, $sql);
    $memberList = array();
    $csv = array();
    while($row = mysqli_fetch_array($result)){
        $userid = $row['userid'];
        $sql = "SELECT * FROM $userTable WHERE id = $userid";
        $result2 = mysqli_query($CONN, $sql);
        $row2 = mysqli_fetch_array($result2);
        $row['fullname'] = $row2['lastname'] . " " . $row2['firstname'];
        $row['email'] = $row2['email'];
        $row['phone'] = $row2['phone2'];
        $temp = array();
        $temp['username'] = $row2['username'];
        $csv[] = $temp;
        $memberList[] = $row;
    }
    $csv = array2Csv($csv);
    $res = array(
        'status'=> 0,
        'data' => array(
            'courseName' => $courseName,
            'isTeacher' => $isTeacher,
            'data' => $memberList,
            'csv' => $csv,
        ),
    );
    return $res;
}
function getSchedule($monday, $sunday){
    require_once __DIR__.'/../connectDB.php';
    if (!isset($_SESSION)) {
        session_start();
    }
    $CONN = connectDB();
    $courseTable = "course";
    $myuserid = $_SESSION['id'];
    $sql = "SELECT courseid AS id,fullname,schedule,startdate,enddate FROM
        $courseTable a
        INNER JOIN
        (SELECT courseid AS bid FROM course_user WHERE userid = $myuserid) b
        ON a.courseid=b.bid";
    $result = mysqli_query($CONN, $sql);
    $courseList = array();
    while($item = mysqli_fetch_array($result)){
        //schedule=[{"day":"3","start":"00:00","end":"00:30"},
        // {"day":"4","start":"05:00","end":"06:30"},
        // {"day":"5","start":"00:00","end":"00:30"}]
        $scheduleArr = json_decode($item['schedule'], true);
        //add new key id,fullname to each object in scheduleArr
        foreach($scheduleArr as &$value){
            $value['id'] = $item['id'];
            $value['fullname'] = $item['fullname'];
        }
        //first convert startdate and enddate has timestamp form to yyyy-mm-dd
        $item['startdate'] = date('Y-m-d', $item['startdate']);
        $item['enddate'] = date('Y-m-d', $item['enddate']);
        if ($item['enddate'] < $monday || $item['startdate'] > $sunday){
            continue;
        }
        if($item['startdate'] <= $monday && $item['enddate'] >= $sunday){
            $item['schedule'] = $scheduleArr;
            $courseList[] = $item;
            continue;
        }
        //hard part
        if($item['enddate']>=$monday && $item['enddate']<=$sunday){
            //startdate=monday,enddate=enddate
            //now get name of day of enddate, enddate is yyyy-mm-dd
            $day = date('w', strtotime($item['enddate'])) + 1;//because I use 1 for sunday
            $notCheckDayArr = array();
            for($i=$day+1;$i<=7;$i++){
                $notCheckDayArr[] = $i;
            }
            //now delete all day in scheduleArr that is in notCheckDayArr
            $newScheduleArr = array();
            for ($i=0;$i<count($scheduleArr);$i++){
                if (!in_array((int)$scheduleArr[$i]['day'], $notCheckDayArr)){
                    $newScheduleArr[] = $scheduleArr[$i];
                }
            }
            $item['schedule'] = $newScheduleArr;
            $courseList[] = $item;
            continue;
        }
        if($item['startdate']>=$monday && $item['startdate']<=$sunday){
            //startdate=startdate,enddate=sunday
            //now get name of day of startdate, startdate is yyyy-mm-dd
            $day = date('w', strtotime($item['startdate'])) + 1;//because I use 1 for sunday
            $notCheckDayArr = array();
            for($i=$day-1;$i>=1;$i--){
                $notCheckDayArr[] = $i;
            }
            //now delete all day in scheduleArr that is in notCheckDayArr
            $newScheduleArr = array();
            for ($i=0;$i<count($scheduleArr);$i++){
                if (!in_array((int)$scheduleArr[$i]['day'], $notCheckDayArr)){
                    $newScheduleArr[] = $scheduleArr[$i];
                }
            }
            $item['schedule'] = $newScheduleArr;
            $courseList[] = $item;
            continue;
        }
    }
    //$courselist is array of course, each course has course['schedule] is array of scheduleitem, now push all scheduleitem to $scheduleList
    $scheduleList = array();
    foreach($courseList as $course){
        foreach($course['schedule'] as $scheduleItem){
            $scheduleList[] = $scheduleItem;
        }
    }
    $res = array(
        'status'=> 0,
        'data' => $scheduleList,
    );
    return $res;
}
function getCourseComment($courseid,$offset){
    require_once __DIR__.'/../connectDB.php';
    $CONN = connectDB();
    $rateView = "rate_view";
    if (!isset($_SESSION)) {
        session_start();
    }
    if(isset($_SESSION['id'])){
        $myuserid = $_SESSION['id'];
    }else{
        $myuserid = 0;
    }
    //first count number of comment in this course
    $sql = "SELECT COUNT(*) AS count FROM $rateView WHERE courseid = $courseid";
    $result = mysqli_query($CONN, $sql);
    $row = mysqli_fetch_array($result);
    $thisTotal = $row['count'];

    $sql = "SELECT cateid,teacherid FROM $rateView WHERE courseid = $courseid";
    $result = mysqli_query($CONN, $sql);
    $row = mysqli_fetch_array($result);
    $cateid = $row['cateid'];
    $teacherid = $row['teacherid'];
    //now count number of comment in this cate and teacher
    if ($thisTotal == 0){
        $globalTotal = 0;
    }
    else{
        $sql = "SELECT COUNT(*) AS count FROM $rateView WHERE cateid = $cateid AND teacherid = $teacherid";
        $result = mysqli_query($CONN, $sql);
        $row = mysqli_fetch_array($result);
        $globalTotal = $row['count'];
    }
    if ($myuserid == 0){
        $sql = "SELECT id,userid,courseid,comment,point,time,fullname,image FROM $rateView WHERE cateid = $cateid AND teacherid = $teacherid ORDER BY
        CASE
            WHEN courseid = $courseid THEN 1
            ELSE 2
        END, time DESC
        LIMIT 0, $offset";
    }
    else{//set my comment to top
        $sql = "SELECT id,userid,courseid,comment,point,time,fullname,image FROM $rateView WHERE cateid = $cateid AND teacherid = $teacherid ORDER BY
        CASE
            WHEN userid = $myuserid and courseid = $courseid THEN 1
            WHEN userid = $myuserid and courseid != $courseid THEN 2
            WHEN userid != $myuserid and courseid = $courseid THEN 3
            ELSE 4
        END, time DESC
        LIMIT 0, $offset";
    }
    
    $result = mysqli_query($CONN, $sql);
    $commentList = array();
    while($row = mysqli_fetch_array($result)){
        if($row['courseid'] != $courseid)
            $row['isThisCourse'] = false;
        else $row['isThisCourse'] = true;
        $commentList[] = $row;
    }
    $res = array(
        'status'=> 0,
        'data' => array(
            'thisTotal' => $thisTotal,
            'globalTotal' => $globalTotal,
            'data' => $commentList,
        ),
    );
    return $res;
    
}
function deleteComment($id){
    require_once __DIR__.'/../connectDB.php';
    $CONN = connectDB();
    $rateView = "rate_view";
    //check if this comment is exist
    $sql = "SELECT * FROM $rateView WHERE id = $id";
    $result = mysqli_query($CONN, $sql);
    if(mysqli_num_rows($result) == 0){
        $res = array(
            'status'=> -2,
        );
        return $res;
    }
    $sql = "UPDATE $rateView SET comment = '' WHERE id = $id";
    $result = mysqli_query($CONN, $sql);
    if($result){
        $res = array(
            'status'=> 0,
        );
        return $res;
    }
    else{
        $res = array(
            'status'=> -1,
        );
        return $res;
    }
}
function checkRateCourse($userid,$courseid){
    require_once __DIR__.'/../connectDB.php';
    if(!isset($_SESSION)){
        session_start();
    }
    $CONN = connectDB();
    $rateView = "rate_view";
    $course_user = "course_user";
    $courseTable = "course";
    //check can you rate this course
    $sql = "SELECT * FROM $course_user WHERE userid = $userid AND courseid = $courseid AND classrole = 0";
    $result = mysqli_query($CONN, $sql);
    if(mysqli_num_rows($result) == 0){
        $res = array(
            'status'=> -3,
        );
        return $res;
    }
    //check if you have rated this course
    $sql = "SELECT * FROM $rateView WHERE userid = $userid AND courseid = $courseid";
    $result = mysqli_query($CONN, $sql);
    if(mysqli_num_rows($result) != 0){
        $res = array(
            'status'=> -2,
        );
        return $res;
    }
    //check if course not end, now = timestamp
    $now = time();
    $sql = "SELECT * FROM $courseTable WHERE courseid = $courseid AND enddate > $now";
    $result = mysqli_query($CONN, $sql);
    if(mysqli_num_rows($result) != 0){
        $res = array(
            'status'=> -1,
        );
        return $res;
    }
    //check if course has end more than 1 month
    $oneMonthAgo = $now - 30*24*60*60;
    $sql = "SELECT * FROM $courseTable WHERE courseid = $courseid AND enddate < $oneMonthAgo";
    $result = mysqli_query($CONN, $sql);
    if(mysqli_num_rows($result) != 0){
        $res = array(
            'status'=> -4,
        );
        return $res;
    }
    $res = array(
        'status'=> 0,
    );
}
function rateCourse($userid,$courseid, $userrate,$usercomment){
    require_once __DIR__.'/../connectDB.php';
    $CONN = connectDB();
    $rateTable = "rate_result";
    if(!isset($_SESSION)){
        session_start();
    }
    $res = checkRateCourse($userid,$courseid);
    if($res['status'] != 0){
        return $res;
    }
    $time = time();
    $sql = "INSERT INTO $rateTable (userid,courseid,point,comment,time) VALUES ($userid,$courseid,$userrate,'$usercomment',$time)";
    $result = mysqli_query($CONN, $sql);
    if($result){
        $res = array(
            'status'=> 0,
        );
        return $res;
    }
    else{
        $res = array(
            'status'=> -10,
        );
        return $res;
    }
}
function getIncome($firstDay,$lastDay,$teacherId,$offset){
    require_once __DIR__.'/../connectDB.php';
    $CONN = connectDB();
    $incomeTable = "teacher_income";
    $userView = "user_view";
    $saruUserTable = "saru_user";
    $courseTable = "course";
    $firstDay = strtotime($firstDay);
    $lastDay = strtotime($lastDay);
    //count total income
    $sql = "SELECT COUNT(*) AS total FROM $incomeTable WHERE teacherid = $teacherId AND time >= $firstDay AND time <= $lastDay";
    $result = mysqli_query($CONN, $sql);
    $row = mysqli_fetch_array($result);
    $total = $row['total'];
    $sql = "SELECT studentid,courseid,amount,time
    FROM $incomeTable WHERE teacherid = $teacherId AND time >= $firstDay AND time <= $lastDay
    ORDER BY time DESC LIMIT $offset,10";
    $result = mysqli_query($CONN, $sql);
    $incomeList = array();
    while($row = mysqli_fetch_array($result)){
        $studentid = $row['studentid'];
        $courseid = $row['courseid'];
        $sql  = "SELECT CONCAT(lastname,' ',firstname) AS fullname FROM $saruUserTable WHERE id = $studentid";
        $result2 = mysqli_query($CONN, $sql);
        $row2 = mysqli_fetch_array($result2);
        $row['studentname'] = $row2['fullname'];
        $sql  = "SELECT fullname FROM $courseTable WHERE courseid = $courseid";
        $result2 = mysqli_query($CONN, $sql);
        $row2 = mysqli_fetch_array($result2);
        $row['coursename'] = $row2['fullname'];
        $incomeList[] = $row;
    }
    $res = array(
        'status'=> 0,
        'data' => array(
            'total' => $total,
            'data' => $incomeList
        )
    );
    return $res;
    // if ($teacherId == 'all'){//all
    //     $sql = "SELECT teacherid,SUM(amount) AS income
    //     FROM teacher_income
    //     WHERE time >= $firstDay AND time <= $lastDay GROUP BY teacherid
    //     ORDER BY income DESC
    //     LIMIT $offset,10";
    //     $result = mysqli_query($CONN, $sql);
    //     $incomeList = array();
    //     while($row = mysqli_fetch_array($result)){
    //         $teacherid = $row['teacherid'];
    //         $sql  = "SELECT CONCAT(lastname,' ',firstname) AS fullname FROM $userTable WHERE userid = $teacherid";
    //         $result2 = mysqli_query($CONN, $sql);
    //         $row2 = mysqli_fetch_array($result2);
    //         $row['teachername'] = $row2['fullname'];
    //         $incomeList[] = $row;
    //     }
    //     $res = array(
    //         'status'=> 0,
    //         'data' => $incomeList,
    //     );
    // }

}
function getIncomeAll($firstDay,$lastDay,$offset){
    require_once __DIR__.'/../connectDB.php';
    $CONN = connectDB();
    $firstDay = strtotime($firstDay);
    $lastDay = strtotime($lastDay);
    $sql = "SELECT COUNT(*) AS total FROM
    (SELECT teacherid,fullname,COALESCE(SUM(amount),0) AS totalamount
    FROM
    (SELECT id AS teacherid,fullname FROM user_view WHERE role=1 OR role=2) a
    LEFT JOIN
    (SELECT teacherid AS tid,amount FROM teacher_income
    WHERE time >= $firstDay AND time <= $lastDay) b
    ON a.teacherid=b.tid GROUP BY teacherid) c
    LEFT JOIN
    (SELECT userid,COUNT(id) AS num_of_course
    FROM course GROUP BY userid) d
    ON c.teacherid=d.userid";
    $result = mysqli_query($CONN, $sql);
    $row = mysqli_fetch_array($result);
    $total = $row['total'];
    $sql = "SELECT teacherid,fullname,totalamount,COALESCE(num_of_course,0) as num_of_course FROM
    (SELECT teacherid,fullname,COALESCE(SUM(amount),0) AS totalamount
    FROM
    (SELECT id AS teacherid,fullname FROM user_view WHERE role=1 OR role=2) a
    LEFT JOIN
    (SELECT teacherid AS tid,amount FROM teacher_income
    WHERE time >= $firstDay AND time <= $lastDay) b
    ON a.teacherid=b.tid GROUP BY teacherid) c
    LEFT JOIN
    (SELECT userid,COUNT(id) AS num_of_course
    FROM course GROUP BY userid) d
    ON c.teacherid=d.userid
    ORDER BY totalamount DESC,fullname LIMIT $offset,30";
    $result = mysqli_query($CONN, $sql);
    $incomeList = [];
    while($row = mysqli_fetch_array($result)){
        $temp = array(
           'teacherid' => $row['teacherid'],
           'fullname' => $row['fullname'],          
           'num_of_course' => $row['num_of_course'],
           'totalamount' => $row['totalamount']
        );
        $incomeList[] = $temp;
    }
    $csv = array2Csv($incomeList);
    $res = array(
        'status'=> 0,
        'data' => array(
            'total' => $total,
            'data' => $incomeList,
            'csv' => $csv
        )
    );
    return $res;
}