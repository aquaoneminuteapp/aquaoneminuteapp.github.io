<?php
//Turn on buffering, no output sent but stored internallu
//if session not available the start session
if(!isset($_SESSION))
{
session_start();
}
if(!isset($_SESSION['password'])){
header('location:index.php');
}else{
    echo '<a href="Logout.php">logout</a>';
}
?>
<?php 
$id=$_GET["id"];
$loc = explode(",", $id);
$long = $loc[0]; 
$late = $loc[1]; 
?>
<!DOCTYPE html>
<html>
<head>
  <title>Aqua Pocket Reference</title>

   <script src="js/jquery-1.4.2.min.js"></script>

</head>
<body>
<h3 style="text-align: center;">Aqua Pocket Reference</h3>

<div style="text-align: center;"><?php // Set session variables
$_SESSION["key"] = md5(microtime().rand());
?>&nbsp;
<img style="width: 300px; height: 145px;" alt="MyCIS" src="images/home.png"><br>
</div>
<center>
<a href="report.php">View Report</a>
<form enctype="multipart/form-data" name="Places" action="contact.php" method="post">
  <table border="0" width="400">
    <tbody>
      <tr>
        <td width="20%"><font face="arial" size="3"><br>
        </font></td>
        <td width="80%"><font face="arial" size="3"><input name="menu" size="60" placeholder="Menu Item"></font></td>
      </tr>
      <tr>
        <td width="20%"><font face="arial" size="3"><br>
        </font></td>
        <td width="80%"><font face="arial" size="3"><input name="name" size="60" placeholder="Menu Item"></font></td>
      </tr>
      <tr>
        <td width="20%"><font face="arial" size="3"><br>
        </font></td>
        <td width="80%"><input name="image" size="60" placeholder="Enter Images"></td>
      </tr>
    </tbody>
  </table>
  <center>
  <input type="submit" name="submit" value="submit"></center>
</form>
<?php include("config.php"); 
//see if people table exists, if not create
$check = mysql_query ("SELECT * FROM `aquareference` LIMIT 0,1"); 
if ($check){
// query was legal and table exist
}else{
// something wrong, so:
// create the table
$peoples = "CREATE TABLE aquareference(
  aqua_id int(11) NOT NULL auto_increment, 
  aqua_key varchar(250) NOT NULL, 
  aqua_menu varchar(150) NOT NULL, 
  aqua_name varchar(150) NOT NULL,
  aqua_img varchar(75) NOT NULL,
  aqua_email varchar(75) NOT NULL,
  aqua_m1 varchar(75) NOT NULL,
  aqua_m2 varchar(75) NOT NULL,
  aqua_m3 varchar(75) NOT NULL,
  aqua_m4 varchar(75) NOT NULL,
  aqua_m5 varchar(75) NOT NULL,
  aqua_m6 varchar(75) NOT NULL,
  PRIMARY KEY  (aqua_id))";
  $results = mysql_query($peoples)
  or die (mysql_error());
}
//turn off buffering
?>
</center>
</body></html>