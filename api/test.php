<?php
require_once 'Utils.php';
require_once 'connectDB.php';

// function addCate($name, $DBS){

//     $CONN = connectDB();
//     $cateTable = $DBS['prefix'] . "course_categories";
//     //auto increment id now is:
//     $sql = "SELECT MAX(id) FROM $cateTable";
//     $result = mysqli_query($CONN, $sql);
//     $row = mysqli_fetch_row($result);
//     $id = $row[0] + 1;
//     $sql = "INSERT INTO $cateTable (name, sortorder, path) VALUES ('$name', $id * 10000, '/$id')";
//     $result = mysqli_query($CONN, $sql);
    
//     //now add to context table
//     $contextTable = $DBS['prefix'] . "context";
//     $sql = "INSERT INTO $contextTable (contextlevel, instanceid, path, depth) VALUES (40, $id, '', 3)";
//     $result = mysqli_query($CONN, $sql);
//     //get inserted id
//     $contextid = mysqli_insert_id($CONN);
//     //update path
//     $sql = "UPDATE $contextTable SET path = '/1/$contextid' WHERE id = $contextid";
//     $result = mysqli_query($CONN, $sql);
//     //close connection
//     mysqli_close($CONN);
//     //delete cache folder
//     removeDir($DBS['dataroot'].'/cache/cachestore_file/default_application/core_coursecattree');

// }
// for ($i = 1; $i <= 10; $i++) {
//     addCate("Thể loại $i", $DBS);
// }