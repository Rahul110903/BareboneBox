<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require "../vendor/autoload.php";

$mail = new PHPMailer(true);

try {
    $mail->isSMTP();
    $mail->Host       = 'smtp.gmail.com';
    $mail->SMTPAuth   = true;
    $mail->Username   = 'barebonebox@gmail.com';
    $mail->Password   = 'izodhpytggnnbtgw';
    $mail->SMTPSecure = 'tls';
    $mail->Port       = 587;

    $mail->setFrom($_POST['email'], $_POST['name']);
    $mail->addAddress('barebonebox@gmail.com');

    $mail->isHTML(true);
    $mail->Subject = $_POST['subject'];
    $mail->Body    = "<b>Name:</b> {$_POST['name']}<br>
                      <b>Email:</b> {$_POST['email']}<br>
                      <b>Message:</b> {$_POST['message']}";

    $mail->send();
    echo "OK"; // ✅ Return exactly "OK" for the JS to detect success
} catch (Exception $e) {
    echo "Mailer Error: {$mail->ErrorInfo}";
}
