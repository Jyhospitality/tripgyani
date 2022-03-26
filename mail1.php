<?php

$to = 'info@tripgyani.com'; //<-----Put Your email address here.
$email = "";

if (!empty($_POST['email'])) {


    $emailid = $_POST['email'];


    $subject = "Website Visitor: Tripgyani";
    $message = "You have received a new message. " .
            " Here are the details: Email: $emailid";

    $headers = 'MIME-Version: 1.0' . "\r\n";
    $headers .= "From:<".$emailid."> \r\n";
    $headers .= 'Content-type: text/html; charset=iso-8859-1' . "\r\n";


    mail($to, $subject, $message, $headers);

    header('refresh:3; Location: http://www.tripgyani.com');

    echo "Thank you.You will get best offers from tripgyani....";
} else {
    echo "Please enter your Email ID properly";
}
?> 
