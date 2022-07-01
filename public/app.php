<?php
	// At this point it is expected that the api cookie is set and the key is valid.
	$doNotRun_API_REQUEST = true; 

	// Call the router_p. This will still retain the $_POST, $_GET values.
	include "../backend/router_p.php";

	// Check the cookie, api key and user rights against being invalid or disabled.
	// NOTE: This function handles redirection and if the validation fails then the script will end there.
	$result = validateClient();

	// echo "<script>console.log('" . $result . "');</script>";

	// GOOD TO GO!
?>
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>DebugTattle v6</title>
	
	<!-- Icons and fonts -->
	<link rel="preload" as="style" href="https://cdn.materialdesignicons.com/6.5.95/css/materialdesignicons.min.css" />
	<link rel="stylesheet" href="https://cdn.materialdesignicons.com/6.5.95/css/materialdesignicons.min.css" />

	<!-- include the stylesheet file -->
	<link href="css/app.css" rel="stylesheet" type="text/css">
	<link href="css/examples.css" rel="stylesheet" type="text/css">

	<script src="js/app.js"></script>
</head>
<body>
	Welcome
	<div id="title">title</div>
	<div id="nav">nav</div>
	<div id="examples">
		<?php include "partials/examples.php"; ?>
	</div>
	<div id="records">
		<div id="records_div">

		</div>
	</div>
</body>
</html>