<?php
global $DBS;
$DBS = array();
$DBS['dbtype']    = 'mariadb';
$DBS['dblibrary'] = 'native';

// $DBS['dbhost']    = '191.101.230.1';
$DBS['dbhost']    = 'localhost';
$DBS['dbname']    = 'u789565752_saru';
$DBS['dbuser']    = 'u789565752_saru';
$DBS['dbpass']    = 'ThienCo_1401';
$DBS['dboptions'] = array (
    'dbpersist' => 0,
    'dbport' => '',
    'dbsocket' => '',
    'dbcollation' => 'utf8mb4_unicode_ci'
);
$DBS['prefix']    = 'saru_';
$DBS['dataroot']    = __DIR__ . '/../../../sarudata';
$DBS['home'] = 'https://saru.edulogy.tech';
$DBS['edulogyhome'] = 'https://edulogy.tech/edulogy'
?>