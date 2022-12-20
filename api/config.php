<?php
//for config.php of moodle folder
require __DIR__.'/DBInfo.php';
require __DIR__.'/connectDB.php';
global $CFG;
$CFG = new stdClass();
$CFG->dbtype    = $DBS['dbtype'];
$CFG->dblibrary = $DBS['dblibrary'];
$CFG->dbhost    = $DBS['dbhost'];
$CFG->dbname    = $DBS['dbname'];
$CFG->dbuser    = $DBS['dbuser'];
$CFG->dbpass    = $DBS['dbpass'];
$CFG->prefix    = $DBS['prefix'];
$CFG->dboptions = $DBS['dboptions'];
$CFG->wwwroot   = $DBS['home'];
$CFG->dataroot  = $DBS['dataroot'];
$CFG->siteguest = -1;

$sql = "SELECT userid FROM user WHERE role = '2'"; //get userid of admins, 2 is admin role
$admins = array();

try {
  $CONN = connectDB();
  $result = mysqli_query($CONN, $sql);
  if (!$result){
    throw new Exception("Lỗi truy vấn !");
  }
  while($row = mysqli_fetch_assoc($result)){
      if ($row['userid'] != 0) { //acc admin nhưng chưa đăng nhập nên userid = null
          $admins[] = $row['userid'];
      }
  }
  $CFG->siteadmins = implode(',', $admins);
  $CFG->directorypermissions = 0777;
  }
  catch (Throwable $th) {
    throw $th;
  }

?>