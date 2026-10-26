<?php
include 'config.php';

function fail($message)
{
    http_response_code(400);
    die($message);
}

if (!isset($_POST['name']) || !isset($_POST['email']) || !isset($_POST['topic']) || !isset($_POST['message'])) {
    fail("Invalid request.");
}

$name = trim($_POST['name']);
$email = trim($_POST['email']);
$topic = trim($_POST['topic']);
$message = trim($_POST['message']);

$topics = array("General question", "Custom or event order", "Problem with an order");

if ($name == "" || strlen($name) > 100) {
    fail("Please enter your name.");
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($email) > 150) {
    fail("Please enter a valid email address.");
}

if (!in_array($topic, $topics)) {
    fail("Please choose a topic.");
}

if (strlen($message) < 10 || strlen($message) > 2000) {
    fail("Your message must be between 10 and 2000 characters.");
}

$name = mysqli_real_escape_string($conn, $name);
$email = mysqli_real_escape_string($conn, $email);
$topic = mysqli_real_escape_string($conn, $topic);
$message = mysqli_real_escape_string($conn, $message);

$sql = "INSERT INTO contact_messages (name, email, topic, message) VALUES ('$name', '$email', '$topic', '$message')";

if (!mysqli_query($conn, $sql)) {
    fail("Sorry, something went wrong. Please try again.");
}

echo "Thanks for getting in touch. We reply within one working day.";

mysqli_close($conn);
?>
