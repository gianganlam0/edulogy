<?php

//for config.php of moodle folder
require 'DBInfo.php';
require 'connectDB.php';
global $CFG;
$CFG = new stdClass();

$CFG->dbtype    = 'mariadb';
$CFG->dblibrary = 'native';
$CFG->dbhost    = $DBS['dbhost'];
$CFG->dbname    = $DBS['dbname'];
$CFG->dbuser    = $DBS['dbuser'];
$CFG->dbpass    = $DBS['dbpass'];
$CFG->prefix    = $DBS['prefix'];
$CFG->dboptions = array (
  'dbpersist' => 0,
  'dbport' => '',
  'dbsocket' => '',
  'dbcollation' => 'utf8mb4_unicode_ci',
);

$CFG->wwwroot   = 'http://localhost/saru';
$CFG->dataroot  = $DBS['dataroot'];
$CFG->admin     = 'admin';

$CFG->siteguest = '1';

$sql = "SELECT userid FROM user WHERE role = '2'"; //get userid of admins, 2 is admin role
$CONN = connectDB();
$result = mysqli_query($CONN, $sql);
$admins = array();
while($row = mysqli_fetch_assoc($result)){
    if ($row['userid'] != 0) { //acc admin nhưng chưa đăng nhập nên userid = null
        $admins[] = $row['userid'];
    }
}
$CFG->siteadmins = implode(',', $admins);

$CFG->directorypermissions = 0777;
///////////////////
?>