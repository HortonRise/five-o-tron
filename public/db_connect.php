<?php

$username="root";
$password="root";
$database="highfive";



$db = new PDO('mysql:host=localhost;dbname=' . $database .';charset=utf8', $username, $password);

?>
