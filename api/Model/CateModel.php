<?php
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