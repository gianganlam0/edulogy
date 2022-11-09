<?php
require_once 'Utils.php';
require_once 'connectDB.php';

function addCate($name, $IDNumber, $DBS){

    $CONN = connectDB();
    $cateTable = $DBS['prefix'] . "course_categories";
    
    $timestamp = time();
    $sql = "INSERT INTO $cateTable (idnumber, description, name, timemodified) VALUES ('$IDNumber','','$name', '$timestamp')";
    $result = mysqli_query($CONN, $sql);
    //update path
    $id = mysqli_insert_id($CONN);
    $sql = "UPDATE $cateTable SET path = '/$id' WHERE id = $id";
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
    //close connection
    mysqli_close($CONN);
    //delete cache folder
    removeDir($DBS['dataroot'].'/cache/cachestore_file/default_application/core_coursecattree');

}
for ($i = 1; $i <= 1; $i++) {
    addCate(randomString(5,10),randomString(2,4), $DBS);
}