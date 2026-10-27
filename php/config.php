<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "maicookies";
$ownerEmail = "maizbibi83@gmail.com";

$conn = mysqli_connect($servername, $username, $password, $dbname);

if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}
?>
