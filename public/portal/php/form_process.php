<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if (isset($_POST['action']) and $_POST['action'] == 'appointment') {
        $email = $_POST["email"];
        $subject = "Nueva cita - Cat Lovers Paradise"; // Asunto para citas
        $to = "contacto@catloversparadise.org"; // Email de contacto de Cat Lovers Paradise
        $headers = "From: $email\r\n";
        $headers .= "Reply-To: $email\r\n";
        $headers .= "Content-type: text/html\r\n";
        $message = "Subscribe Message"; // Replace Your Message Subscribe

        $messageBody = "Email: $email<br>Message: $message";

        if (mail($to, $subject, $messageBody, $headers)) {
            echo "success"; // Send response Success
        } else {
            echo "error"; // Send Response Failed Send Mail
        }
    } elseif (isset($_POST['action']) and $_POST['action'] == 'comment') {
        $email = $_POST["email"];
        $first_name = $_POST['first_name'];
        $last_name = $_POST['last_name'];
        $comment = $_POST['message'];
        $post_title = $_POST['post_title'];
        $subject = "Nuevo comentario - Cat Lovers Paradise"; // Asunto para comentarios
        $to = "contacto@catloversparadise.org"; // Email de contacto de Cat Lovers Paradise
        $headers = "From: $email\r\n";
        $headers .= "Reply-To: $email\r\n";
        $headers .= "Content-type: text/html\r\n";
        $message = "comment from : $first_name $last_name \r\n post : $post_title \r\n message : $comment "; // Replace Your Message comment

        $messageBody = "Email: $email<br>Message: $message";

        if (mail($to, $subject, $messageBody, $headers)) {
            echo "success"; // Send response Success
        } else {
            echo "error"; // Send Response Failed Send Mail
        }
    } else {
        $name = $_POST['first_name'] . ' ' . $_POST['last_name'];
        $email = $_POST["email"];
        $message = $_POST["message"];
        $subject = "Nuevo mensaje de contacto - Cat Lovers Paradise"; // Asunto para contacto

        $to = "contacto@catloversparadise.org"; // Email de contacto de Cat Lovers Paradise
        $headers = "From: $email\r\n";
        $headers .= "Reply-To: $email\r\n";
        $headers .= "Content-type: text/html\r\n";

        $messageBody = "Name: $name<br>Email: $email<br>Message: $message";

        if (mail($to, $subject, $messageBody, $headers)) {
            echo "success"; // Send response Success
        } else {
            echo "error"; // Send Response Failed Send Mail
        }
    }
}
