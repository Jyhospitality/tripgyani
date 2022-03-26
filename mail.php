<?php

$to = 'info@tripgyani.com'; //<-----Put Your email address here.
$name = $lname = $email = $phone = $message = "";

if (!empty($_POST['name']) && !empty($_POST['email'])) {


    $name = $_POST['name'];
    $lname = $_POST['lname'];
    $emailid = $_POST['email'];
    $phone = $_POST['phone'];
    $message = $_POST['message'];


    $subject = "Website Visitor: $name";
    $message = "You have received a new message. " .
            " Here are the details:\n Name: $name \n Surname: $lname \n Email: $emailid \n phone: $phone \n message: $message";

    $headers = 'MIME-Version: 1.0' . "\r\n";
    //$headers .= 'From: Tripgyani Website <website@hospitalityminds>' . "\r\n";
    $headers .= "From: ".$name." <".$emailid."> \r\n";
    $headers .= 'Content-type: text/html; charset=iso-8859-1' . "\r\n";


    mail($to, $subject, $message, $headers);

    header('refresh:3; Location: http://www.tripgyani.com');

    echo "Thank you. We will contact you shortly.";
} else {
    echo "Please enter your Name and Email ID properly";
}
?> 
