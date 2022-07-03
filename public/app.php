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
	<link href="css/records.css" rel="stylesheet" type="text/css">
	<link href="css/examples.css" rel="stylesheet" type="text/css">
	<link href="css/nav.css" rel="stylesheet" type="text/css">

	<script src="js/app.js"></script>
</head>
<body>
	
	<div id="content">
		<header id="header">DebugTattle v6</header>
		<br>

		<div id="nav">
			<div id="nav_tabs">
				<div class="nav_tab active" viewid="view_records">RECORDS</div>
				<div class="nav_tab" viewid="view_examples">EXAMPLES</div>
				<div class="nav_tab" viewid="view_admin">ADMIN</div>
			</div>

			<div id="nav_contents">
				<div id="view_records" class="nav_view show">
					<br>
					<button id="records_getAll">GetAll</button>
					<button id="records_removeAll">RemoveAll</button>
					<br>
					<br>
					<div id="records_div"></div>
				</div>

				<div id="view_examples" class="nav_view">
					<br>
					<?php include "partials/examples.php"; ?>
				</div>

				<div id="view_admin" class="nav_view">
					<br>
					<table>
						<caption>TESTS</caption>
						<tr> 
							<td><button id="records_test1">Server Tattle Test</button></td>
							<td>Ask server to make a test Tattle.</td> 
						</tr>
						<tr> 
							<td><button id="records_test2">Web-Client Tattle Test</button></td> 
							<td>Make test Tattle via JavaScript</td> 
						</tr>
					</table>
					
					
				</div>
			</div>
		</div>
	</div>

	<footer id="footer">
		DebugTattle v6 &copy; 2016-2022 Nickolas Andersen (nicksen782) (<a href="https://github.com/nicksen782/Debug_Tattle" target="_blank">Github</a>)
	</footer>
	<!-- <br> -->

</body>
</html>