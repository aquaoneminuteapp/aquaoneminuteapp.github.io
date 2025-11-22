<?php
// Connection's Parameters
$db_host="localhost";
$db_name="web290";
$username="aquaguide";
$password="TechnoByte@67";
$db_con=mysql_connect($db_host,$username,$password);
$connection_string=mysql_select_db($db_name);
// Connection
mysql_connect($db_host,$username,$password);
//make sure database is the active one
mysql_select_db($db_name);
?>