<?php
// Set the JSON header
//header("Content-type: text/json");
header('Content-type: application/x-javascript'); 

// The x value is the current JavaScript time, which is the Unix time multiplied by 1000.
//$x = time() * 1000;
// The y value is a random number
$x = rand(100, 200);
$y = rand(0, 100);

// Create a PHP array and echo it as JSON
$ret = array($x, $y);
echo json_encode($ret);
?>