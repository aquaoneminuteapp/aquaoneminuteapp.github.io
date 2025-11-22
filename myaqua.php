<?php
include("config.php"); 
//require 'class.googlevoice.php';
//get id from index
$id=$_GET["id"];
if (!isset($id))
header("location:index2.php");
// Ask the database for the information from the links table
$sql = "SELECT * FROM aquareference WHERE aqua_key='$id'";
$result = mysql_query($sql);
$num = mysql_fetch_array($result);
if ($num['aqua_name']=='Product Related Resources')
{
$directory = $num['aqua_m2'];
echo '<br><iframe src="https://aquaguide.app/app/ProductRelatedResources/' . $directory . '" width="100%" height="5000" scrolling="yes" style="overflow:hidden; margin-top:-20px; margin-left:-4px; border:none;"></iframe>'; 
}elseif ($num['aqua_name']=='CALENDAR OF EVENTS'){
include("cal.php");
}elseif ($num['aqua_name']=='CORPORATE NOTIFICATIONS'){
include("not.php");
}elseif ($num['aqua_name']=='Videos'){
$directory = $num['aqua_m2'];
echo '<li><iframe src="https://aquaguide.app/app/ProductRelatedResources/' . $directory . '/Videos" width="100%" height="5000" scrolling="yes" style="overflow:hidden; margin-top:-20px; margin-left:-4px; border:none;"></iframe></li>';
}elseif ($num['aqua_img']=='docs'){
$directory = $num['aqua_m2'];
echo '<iframe src="https://aquaguide.app/app/ProductRelatedResources/' . $directory . '" width="100%" height="5000" scrolling="yes" style="overflow:hidden; margin-top:20px; margin-left:-4px; border:none;"></iframe>';
}elseif ($num['aqua_img']=='www'){
$directory = $num['aqua_m2'];
echo '<iframe src="' . $directory . '" width="100%" height="5000" scrolling="yes" style="overflow:hidden; margin-top:10px; margin-left:10px; border:none;"></iframe>';
}else{
if ($num['aqua_name']=='')
{
header("location:index2.php");
}
if ($num['aqua_img']=='')
{
header("location:empty.php");
}
$image = explode(",",  $num['aqua_img']);
foreach($image as $img) {
    $img = trim($img);
    $allimages .= '<img src ="images/' . $img . '.png" width="100%"/><br>';
}
}
?>	
<!DOCTYPE html>
<html>
<head>
  <title>My Pocket Reference</title>
   <script src="js/jquery-1.4.2.min.js"></script>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>
<style>
	.demo {
		width:100%;
	}
</style>
<table class="demo">
	<caption></caption>
	<thead style="user-select: auto;">
<tr style="user-select: auto;">
		<td><b></b></td>
	</tr>
	</thead>
	<tbody style="user-select: auto;">
<tr style="user-select: auto;">
		<td><?php echo $allimages;?></td>
	</tr>
	</tbody>
</table>
</body></html>