<?php
// Database connection
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "youngmindtech";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Process form submission
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get form data
    $name = $conn->real_escape_string($_POST['name']);
    $email = $conn->real_escape_string($_POST['email']);
    $subject = $conn->real_escape_string($_POST['subject']);
    $message = $conn->real_escape_string($_POST['message']);
    
    // Validate email
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(['success' => false, 'message' => 'Invalid email format']);
        exit;
    }
    
    // Insert into database
    $sql = "INSERT INTO contacts (name, email, subject, message, created_at) 
            VALUES ('$name', '$email', '$subject', '$message', NOW())";
    
    if ($conn->query($sql) === TRUE) {
        // Send email notification
        $to = "youngmindtech@gmail.com";
        $emailSubject = "New Contact Form Submission: $subject";
        $emailBody = "Name: $name\nEmail: $email\nMessage: $message";
        $headers = "From: $email";
        
        mail($to, $emailSubject, $emailBody, $headers);
        
        echo json_encode(['success' => true, 'message' => 'Message sent successfully!']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Error: ' . $conn->error]);
    }
}

$conn->close();
?>