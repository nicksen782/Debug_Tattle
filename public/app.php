<?php
	// At this point it is expected that the api cookie is set and the key is valid.
	$doNotRun_API_REQUEST = true; 

	// Call the router_p. This will still retain the $_POST, $_GET values.
	include "../backend/router_p.php";

	// Check the cookie, api key and user rights against being invalid or disabled.
	// NOTE: This function handles redirection and if the validation fails then the script will end there.
	$result = validateClient();

	// GOOD TO GO!
?>
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>DebugTattle v6</title>
</head>
<body>
	Welcome
</body>
</html>