<?php
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
function addCatePending($name, $desc, $imageLink){
    require_once '../connectDB.php';
    // require_once '../Utils.php';
    if (!isset($_SESSION)) {
        session_start();
    }
    $CONN = connectDB();
    $name = mysqli_real_escape_string($CONN, $name);
    $desc = mysqli_real_escape_string($CONN, $desc);
    $CONN = connectDB();
    $catePendingTable = "cate_pending";
    $userId = $_SESSION['id'];
    $time = time();
    $sql = '';
    if ($imageLink == null){
        $sql = "INSERT INTO $catePendingTable (name, description, userid, time) VALUES ('$name', '$desc', $userId, $time)";
    }
    else{
        $sql = "INSERT INTO $catePendingTable (name, description, image, userid, time) VALUES ('$name', '$desc', '$imageLink', $userId, $time)";
    }
    
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
function getCatePending($offset){
    require_once '../connectDB.php';
    if (!isset($_SESSION)) {
        session_start();
    }
    $CONN = connectDB();
    $catePendingTable = "cate_pending";
    $userTable = $DBS['prefix'] . "user";
    //first count total
    $sql = "SELECT COUNT(*) FROM $catePendingTable";
    $result = mysqli_query($CONN, $sql);
    $row = mysqli_fetch_array($result);
    $total = $row[0];
    //now count total pending = 0
    $sql = "SELECT COUNT(*) FROM $catePendingTable WHERE pending = 0";
    $result = mysqli_query($CONN, $sql);
    $row3 = mysqli_fetch_array($result);
    $totalPending = $row3[0];
    //now get data
    $sql = "SELECT id, name, description, image, userid, pending, time FROM $catePendingTable ORDER BY pending, time LIMIT $offset, 10";
    $result = mysqli_query($CONN, $sql);
    $data = array();
    while ($row = mysqli_fetch_array($result)){  
        $userId = $row['userid'];
        $sql = "SELECT lastname, firstname FROM $userTable WHERE id = '$userId'";
        $result2 = mysqli_query($CONN, $sql);
        $row2 = mysqli_fetch_array($result2);
        $data[] = array(
            'id' => $row['id'],
            'name' => $row['name'],
            'description' => $row['description'],
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
            'totalPending' => $totalPending
        )
    );
    return $res;
}
function getMyCatePending($offset, $userId){
    require_once '../connectDB.php';
    if (!isset($_SESSION)) {
        session_start();
    }
    $CONN = connectDB();
    $catePendingTable = "cate_pending";
    $userTable = $DBS['prefix'] . "user";
    //first count total
    $sql = "SELECT COUNT(*) FROM $catePendingTable WHERE userid = $userId";
    $result = mysqli_query($CONN, $sql);
    $row = mysqli_fetch_array($result);
    $total = $row[0];
    //now count total pending = 0
    $sql = "SELECT COUNT(*) FROM $catePendingTable WHERE pending = 0 AND userid = $userId";
    $result = mysqli_query($CONN, $sql);
    $row3 = mysqli_fetch_array($result);
    $totalPending = $row3[0];
    //now get name of uploader
    $sql = "SELECT lastname, firstname FROM $userTable WHERE id = '$userId'";
    $result = mysqli_query($CONN, $sql);
    $row = mysqli_fetch_array($result);
    $uploaderName = $row['lastname'] . ' ' . $row['firstname'];
    //now get data
    $sql = "SELECT id, name, description, image, userid, pending, time FROM $catePendingTable WHERE userid = '$userId' ORDER BY pending, time LIMIT $offset, 10";
    $result = mysqli_query($CONN, $sql);
    $data = array();
    while ($row = mysqli_fetch_array($result)){  
        $data[] = array(
            'id' => $row['id'],
            'name' => $row['name'],
            'description' => $row['description'],
            'image' => $row['image'],
            'uploaderId' => $row['userid'],
            'uploaderName' => $uploaderName,
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
            'totalPending' => $totalPending
        )
    );
    return $res;
}
function acceptCate($id){
    require_once '../connectDB.php';
    if (!isset($_SESSION)) {
        session_start();
    }
    $CONN = connectDB();
    $catePendingTable = "cate_pending";
    $sql = "UPDATE $catePendingTable SET pending = 1 WHERE id = $id AND pending = 0";
    $result = mysqli_query($CONN, $sql);
    if (!$result){
        throw new Exception(mysqli_error($CONN));
    }
    //now add to cate table of moodle
    $cateTable = $DBS['prefix'] . "course_categories";
    $sql = "SELECT name, description, image, time FROM $catePendingTable WHERE id = $id";
    $result = mysqli_query($CONN, $sql);
    $row = mysqli_fetch_array($result);
    $name = $row['name'];
    $desc = $row['description'];
    $avatar = $row['image'];
    $time = $row['time'];
    $pendingId = $id; //remember this id to update
    $sql = "INSERT INTO $cateTable (name, description, avatar, timemodified) VALUES ('$name', '$desc', '$avatar', '$time')";
    $result = mysqli_query($CONN, $sql);
    //update path
    $id = mysqli_insert_id($CONN);
    $sql = "UPDATE $cateTable SET path = '/$id' WHERE id = $id";
    $result = mysqli_query($CONN, $sql);
    //update cateid in cate_pending
    $sql = "UPDATE $catePendingTable SET cateid = $id WHERE id = $pendingId";
    $result = mysqli_query($CONN, $sql);
    //now add to context table
    $contextTable = $DBS['prefix'] . "context";
    $sql = "INSERT INTO $contextTable (contextlevel, instanceid, depth) VALUES (40, $id, 3)";
    $result = mysqli_query($CONN, $sql);
    //get inserted id
    $contextid = mysqli_insert_id($CONN);
    //update path
    $sql = "UPDATE $contextTable SET path = '/1/$contextid' WHERE id = $contextid";
    $result = mysqli_query($CONN, $sql);
    //delete cache folder
    removeDir($DBS['dataroot'].'/cache/cachestore_file/default_application/core_coursecattree');
    $res = array(
        'status'=> 0,
        'message' => '',
    );
    return $res;
}
function rejectCate($id){
    require_once '../connectDB.php';
    if (!isset($_SESSION)) {
        session_start();
    }
    $CONN = connectDB();
    $catePendingTable = "cate_pending";
    $sql = "UPDATE $catePendingTable SET pending = 2 WHERE id = $id AND pending = 0";
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