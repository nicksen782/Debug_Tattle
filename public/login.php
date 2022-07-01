<!DOCTYPE html>
<html>

<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width,minimum-scale=1">
	<title>Login</title>

	<!-- Icons and fonts -->
	<link rel="preload" as="style" href="https://cdn.materialdesignicons.com/6.5.95/css/materialdesignicons.min.css" />
	<link rel="stylesheet" href="https://cdn.materialdesignicons.com/6.5.95/css/materialdesignicons.min.css" />

	<!-- include the stylesheet file -->
	<link href="css/login.css" rel="stylesheet" type="text/css">

	<script src="js/login.js"></script>
	<!-- <script src="libs/js-sha256/src/sha256.js"></script> -->
</head>

<body>
	<div class="login">
		<h1 class="title">Debug Tattle v6 Login</h1>
		<div class="instruction">Please enter your API key</div>

		<!-- This form is not actually submitted but it is read from. -->
		<form action="login_p.php" method="post" id="loginForm">
			<input type="hidden" name="o" value="login" placeholder="" id="o" required>
			
			<label for="username">
				<i class="mdi mdi-account"></i>
			</label>
			<input type="text" name="username" placeholder="Username" id="username" required>

			<label for="password">
				<i class="mdi mdi-lock"></i>
			</label>
			<input type="password" name="key" placeholder="Password" id="key" required>
			
			<!-- <input type="submit" id="submit" value="Login"> -->
			<input type="button" id="submit" value="Login">
			
			<div id="loginStatus" class="hide">
				<br>
				<div class="textCenter">
					You are already logged in. <a href="app.php">Open the app</a>.
					<input type="button" id="logout" value="Logout">
				</div>
				<!-- <br> -->
				<!-- Login Details: -->
				<!-- <br> -->
				<!-- <textarea spellcheck="false" readonly></textarea> -->
			</div>

		</form>
	</div>
</body>

</html>