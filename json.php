<?php
include("config.php"); 
mysql_set_charset('utf8');
header("Content-Type: application/json; charset=utf-8");
header("Access-Control-Allow-Origin: *");
$id=$_GET["phonename"];
//$id="Charles's Phone";
$name = '';
if ($id == "KonkoliPhone") $name = 'BLOCK';
if ($id == "AquaTestiPhone") $name = 'OXIDATION & DISINFECTION';
if ($id == "TomsiPhone") $name = 'OXIDATION & DISINFECTION';
if ($id == "BobsiPhone") $name = 'OXIDATION & DISINFECTION';
if ($id == "MvOsiPhone") $name = 'OXIDATION & DISINFECTION';
if ($id == "RMTsiPhone") $name = 'OXIDATION & DISINFECTION';
if ($id == "ToddButzsiPhone") $name = 'OXIDATION & DISINFECTION';
if ($id == "RonCulpsiPhone") $name = 'OXIDATION & DISINFECTION';
if ($id == "Jimsnewiphone") $name = 'OXIDATION & DISINFECTION';
if ($id == "tcoopersiPhone") $name = 'OXIDATION & DISINFECTION';
if ($id == "GreggsiPhone") $name = 'OXIDATION & DISINFECTION';
if ($id == "iPhoneRyanS") $name = 'OXIDATION & DISINFECTION';
if ($id == "GWPitcaimiPhone") $name = 'OXIDATION & DISINFECTION';
if ($id == "MDsiPhone") $name = 'OXIDATION & DISINFECTION';
if ($id == "iPhoneKentGuilbeau") $name = 'OXIDATION & DISINFECTION';
if ($id == "JamiesPhone") $name = 'OXIDATION & DISINFECTION';
if ($id == "thewaveydave") $name = 'OXIDATION & DISINFECTION';
if ($id == "SeanCoholan") $name = 'OXIDATION & DISINFECTION';
if ($id == "JDWsiPhone") $name = 'OXIDATION & DISINFECTION';
if ($id == "SamsiPhone") $name = 'OXIDATION & DISINFECTION';
if ($id == "GaryPattonsiPhone") $name = 'OXIDATION & DISINFECTION';
if ($id == "PaulSiPhone") $name = 'OXIDATION & DISINFECTION';
if ($id == "michaelhardy") $name = 'OXIDATION & DISINFECTION';
if ($id == "caso9731@gmail.com") $name = 'OXIDATION & DISINFECTION';
if ($id == "AndyiPhone6s") $name = 'OXIDATION & DISINFECTION';
if ($id == "") $name = $id;
if ($name != ''){
// Ask the database for the information from the links table
$sql = "SELECT * FROM aquareference where aqua_menu <> '" . $name . "' ORDER BY aqua_m1 ASC";
}else if ($name == 'BLOCK'){
$sql = "SELECT * FROM aquareference where aqua_menu = 'BLOCK'";
}else{
// Ask the database for the information from the links table
$sql = "SELECT * FROM aquareference where aqua_m1 <> 999 ORDER BY aqua_m1 ASC";
}
$result = mysql_query($sql);
$emparray = array();
    while($row =mysql_fetch_assoc($result))
    {
        $emparray[] = $row;
    }
echo json_encode($emparray);
?>    