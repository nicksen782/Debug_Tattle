<?php

// At login there may not be a cookie present. 
// $doNotRun_API_REQUEST = true; 

// Call the router_p. This will still retain the $_POST, $_GET values.
include "../backend/router_p.php";

// POST data may be in either $_POST or php://input. 
// inputJsonToPost();

// Set/unset the cookie, api key and user rights unless the apikey is invalid or disabled.
// $canLogin = login( $_POST['username'], $_POST['key'] );
// echo json_encode($canLogin);

?>