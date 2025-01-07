<?php
$servername = "localhost";
$dbusername = "root";
$dbpassword = "";
$dbname = "csa43";
$conn = new mysqli($servername, $dbusername, $dbpassword, $dbname);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = $_POST["username"];
    $password = $_POST["password"];
    $sql = "INSERT INTO login (username, password) VALUES ('$username', '$password')";
    if ($conn->query($sql) === TRUE) {
        echo '<script>alert("welcome")</script>';
        header('Location:home.html');
        exit;
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }
}
$conn->close();
?>
