<?php
session_start();

if (isset($_SESSION['uname']) && isset($_SESSION['email']) && isset($_SESSION['phone'])) {
    echo $_SESSION['uname'] . "|" . $_SESSION['email'] . "|" . $_SESSION['phone'];
}
?>
