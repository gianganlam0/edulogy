<?php
require 'DBInfo.php';
function connectDB(){
  require 'DBInfo.php';
  $CONN = mysqli_connect($DBS['dbhost'], $DBS['dbuser'], $DBS['dbpass'], $DBS['dbname']);

  if (!$CONN) {
    die("Kết nối thất bại: " . mysqli_connect_error());
  }
  return $CONN;
}
