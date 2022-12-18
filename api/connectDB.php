<?php
require __DIR__.'/DBInfo.php';
function connectDB(){
  error_reporting(E_ALL ^ E_WARNING); 
  require __DIR__.'/DBInfo.php';
  try {
    $CONN = mysqli_connect($DBS['dbhost'], $DBS['dbuser'], $DBS['dbpass'], $DBS['dbname']);
    if (!$CONN) {
      throw new Exception("Lỗi kết nối cơ sở dữ liệu!");
    }
    return $CONN;
  }
  catch (Throwable $th) {
    throw $th;
  }
}
