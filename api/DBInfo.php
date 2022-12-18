<?php
global $DBS;
$DBS = array();
$DBS['dbtype']    = 'mariadb';
$DBS['dblibrary'] = 'native';
$DBS['dbhost']    = 'localhost';
$DBS['dbname']    = 'saru';
$DBS['dbuser']    = 'root';
$DBS['dbpass']    = 'sura';
$DBS['dboptions'] = array (
    'dbpersist' => 0,
    'dbport' => '',
    'dbsocket' => '',
    'dbcollation' => 'utf8mb4_unicode_ci',
);
// $DBS['dbtype']    = 'mariadb';
// $DBS['dblibrary'] = 'native';
// $DBS['dbhost']    = 'fdb28.awardspace.net';
// $DBS['dbname']    = '4229873_saru';
// $DBS['dbuser']    = '4229873_saru';
// $DBS['dbpass']    = 'thienco_1401';
// $DBS['dboptions'] = array (
//     'dbpersist' => 0,
//     'dbport' => '',
//     'dbsocket' => '',
//     'dbcollation' => 'utf8mb4_unicode_ci');

$DBS['prefix']    = 'saru_';
$DBS['dataroot']    = __DIR__ . '/../../../sarudata';
$DBS['home'] = 'http://localhost/saru';
$DBS['edulogyhome'] = 'http://localhost/edulogy'
?>