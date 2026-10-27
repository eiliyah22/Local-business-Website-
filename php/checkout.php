<?php
session_start();
include 'config.php';

function fail($message)
{
    http_response_code(400);
    die($message);
}

if (!isset($_POST['name']) || !isset($_POST['email']) || !isset($_POST['phone']) || !isset($_POST['names']) || !isset($_POST['qtys'])) {
    fail("Invalid request.");
}

$name = trim($_POST['name']);
$email = trim($_POST['email']);
$phone = trim($_POST['phone']);
$names = $_POST['names'];
$qtys = $_POST['qtys'];

if ($name == "" || strlen($name) > 100) {
    fail("Please enter your name.");
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($email) > 150) {
    fail("Please enter a valid email address.");
}

$digits = str_replace(array(" ", "+"), "", $phone);
if (!is_numeric($digits) || strlen($phone) < 7 || strlen($phone) > 20) {
    fail("Please enter a valid phone number.");
}

if (!is_array($names) || !is_array($qtys) || count($names) == 0 || count($names) != count($qtys)) {
    fail("Your bag is empty.");
}

$name = mysqli_real_escape_string($conn, $name);
$email = mysqli_real_escape_string($conn, $email);
$phone = mysqli_real_escape_string($conn, $phone);

$total = 0;
$cookieIds = array();
$prices = array();

for ($i = 0; $i < count($names); $i++) {
    $cookieName = mysqli_real_escape_string($conn, trim($names[$i]));
    $qty = (int) $qtys[$i];

    if ($qty < 1 || $qty > 200) {
        fail("Invalid quantity.");
    }

    $sql = "SELECT cookie_id, price, stock FROM cookies WHERE name='$cookieName'";
    $result = mysqli_query($conn, $sql);

    if (mysqli_num_rows($result) == 0) {
        fail($cookieName . " is not on our menu.");
    }

    $row = mysqli_fetch_array($result);

    if ($row['stock'] != "Available") {
        fail($cookieName . " is not available right now.");
    }

    $cookieIds[$i] = $row['cookie_id'];
    $prices[$i] = $row['price'];
    $total = $total + ($row['price'] * $qty);
}

$sql = "SELECT user_id FROM users WHERE email='$email'";
$result = mysqli_query($conn, $sql);

if (mysqli_num_rows($result) > 0) {
    $row = mysqli_fetch_array($result);
    $userId = $row['user_id'];
    $sql = "UPDATE users SET full_name='$name', phone='$phone' WHERE user_id=$userId";
} else {
    $sql = "INSERT INTO users (full_name, email, phone) VALUES ('$name', '$email', '$phone')";
}

if (!mysqli_query($conn, $sql)) {
    fail("Sorry, something went wrong. Please try again.");
}

if (!isset($userId)) {
    $userId = mysqli_insert_id($conn);
}

$sql = "INSERT INTO orders (user_id, total_amount, status) VALUES ($userId, $total, 'Pending')";

if (!mysqli_query($conn, $sql)) {
    fail("Sorry, something went wrong. Please try again.");
}

$orderId = mysqli_insert_id($conn);

for ($i = 0; $i < count($cookieIds); $i++) {
    $qty = (int) $qtys[$i];
    $sql = "INSERT INTO order_items (order_id, cookie_id, quantity, price) VALUES ($orderId, $cookieIds[$i], $qty, $prices[$i])";

    if (!mysqli_query($conn, $sql)) {
        fail("Sorry, something went wrong. Please try again.");
    }
}

$_SESSION['uname'] = trim($_POST['name']);
$_SESSION['email'] = trim($_POST['email']);
$_SESSION['phone'] = trim($_POST['phone']);
$_SESSION['last_order'] = $orderId;

$subject = "New order #" . $orderId;
$message = "New order #" . $orderId . "\n\n";
$message = $message . "Customer: " . $_SESSION['uname'] . "\n";
$message = $message . "Email: " . $_SESSION['email'] . "\n";
$message = $message . "Phone: " . $_SESSION['phone'] . "\n\n";

for ($i = 0; $i < count($names); $i++) {
    $message = $message . $names[$i] . " x " . $qtys[$i] . " (Rs " . $prices[$i] . " each)\n";
}

$message = $message . "\nTotal: Rs " . $total . "\n";

@mail($ownerEmail, $subject, $message);

echo"Thank you " . $_POST['name'] . "! Your order #" . $orderId . " has been placed.";

mysqli_close($conn);
?>
