<?php
	$dt5_app = "Debug And Tattle 5";
	require_once("index_p.php");
	tattle5("DT5 Loaded!", "This tattle is automatically created when the program starts.");
?>

<!DOCTYPE html>
<html lang="en">

	<head>
		<meta charset="UTF-8">
		<!--<meta http-equiv="refresh" content="5">-->
		<title>DT5</title>

		<link rel="stylesheet" type="text/css" href="index.css">

		<script src="index.js"></script>
	</head>

<body>

<div id="entireContainerDiv">
		<div class="" id="statusbuttonswrapper_progressbar"></div>
	<div id="topsidebar">Debug & Tattle v5</div>
	<div id="topsidebar_horiz_divider"></div>
	<div id="topsidebar_horiz_divider2"></div>


	<div id="underPanel_dbinfo1">
		<div class="title">Filters</div>

		<br>
		<div class="cmdLink" onclick="getfilters();">REFRESH FILTER LIST</div>
		<br>

		Choose a filter:
		<div id="filterButtons1_container">
		</div>
	</div>

	<div id="underPanel_dbinfo2">
		Welcome to Debug & Tattle 5!<br>
		This program acts as a temporary data store for PHP variables.<br>
		When used, the specified message will be stored and be later retrieved by this viewer.<br>
		This will allow you to view complete error messages or values without adding additional clutter to the program's normal output.<br>
		Tattles are not meant to be stored long and would normally be deleted after being seen by the operator.<br>
		<br>
		<input type="button" onclick="window.location.reload();" class="filterButtons1" value="Generate Test Tattle"><br>
		<br>
		<!--Info:<br>-->
		<!--Filter count: 7<br>-->
		<!--Total tattle count: 70<br>-->
		<!--Database file size: 200k<br>-->
		<!--Current filter: No filter<br>-->
		<br>
		<?php
			if(file_exists('phpliteadmin.php')){
				echo "Database Manager:<br>";
				echo "<a href='phpliteadmin.php'>PHP Lite Admin</a><br>";
			}
		?>
	</div>


	<div id="bottomsidebar">
		2016 - Nickolas Andersen (nicksen782)
	</div>

		<div id="mainviewingarea_X" onclick="hideMainView();">
			<div>X</div>
			<div>Close this tattle</div>
		</div>
	<div id="sidebar_container">
		<div id="leftsidebar">
			<div class="title">Command Options</div>
			<div class="contents">
				<div class="cmdLink" onclick="getTattleList( getActiveFilter() );">REFRESH BY FILTER</div>
				<div class="cmdLink" onclick="deleteAllTattles_byFilter( getActiveFilter() )">DELETE ALL BY FILTER</div>
				<div class="cmdLink" onclick="deleteAllTattles()">DELETE ALL TATTLES</div>
				<!--<div class="cmdLink" style="visibility:hidden;">SETTINGS</div>-->
			</div>

			<hr class="hrSpacer">

			<div class="title">Navigation Options</div>
			<div class="contents">
				<!--<div class="navLink" onclick="document.getElementById('section_top').scrollIntoView( true );">TOP</div>-->
				<div class="navLink" onclick="document.getElementById('section_lmsg').scrollIntoView( true );">LMSG</div>
				<div class="navLink" onclick="document.getElementById('section_post').scrollIntoView( true );">POST</div>
				<div class="navLink" onclick="document.getElementById('section_get').scrollIntoView( true );">GET</div>
				<div class="navLink" onclick="document.getElementById('section_request').scrollIntoView( true );">REQUEST</div>
				<div class="navLink" onclick="document.getElementById('section_session').scrollIntoView( true );">SESSION</div>
				<div class="navLink" onclick="document.getElementById('section_files').scrollIntoView( true );">FILES</div>
				<div class="navLink" onclick="document.getElementById('section_server').scrollIntoView( true );">SERVER</div>
				<div class="navLink" onclick="document.getElementById('section_backtrace').scrollIntoView( true );">BACKTRACE</div>
			</div>
		</div>

		<div id="rightsidebar">
			<div class="title">List of Tattles</div>
			<div class="contents"></div>
		</div>
	</div>
	<div id="mainviewingarea" class="hide">
		<div id="section_top_container">
			<div class="infoSection" id="section_top">
				<div class="heading">BASICS - Tattle Info:</div>
				<div class="contents">
					<table id="mainviewingarea_top">
						<tr>
							<td>TITLE: </td>
							<td><span id="top_smsg"></span></td>
							<td>ID:</td>
							<td><span id="top_id"></span></td>
							<td>DATE:</td>
							<td><span id="top_date"></span></td>
						</tr>
						<!--<tr>-->
							<!--<td>STATUS</td>-->
							<!--<td><span id="top_status"></span></td>-->
							<!--<td>USER:</td>-->
							<!--<td><span id="top_status"></span></td>-->
							<!--<td>USER:</td>-->
							<!--<td><span id="top_status"></span></td>-->
						<!--</tr>-->
					</table>
				</div>
			</div>
		</div>


		<div id="sections_container">
			<div class="infoSection" id="section_lmsg">
				<div class="heading">LONG MESSAGE:</div>
				<div class="contents">
				</div>
			</div>

			<div class="infoSection" id="section_post">
				<div class="heading">POST:</div>
				<div class="contents">
				</div>
			</div>

			<div class="infoSection" id="section_get">
				<div class="heading">GET:</div>
				<div class="contents">
				</div>
			</div>

			<div class="infoSection" id="section_request">
				<div class="heading">REQUEST:</div>
				<div class="contents">
				</div>
			</div>

			<div class="infoSection" id="section_session">
				<div class="heading">SESSION:</div>
				<div class="contents">
				</div>
			</div>

			<div class="infoSection" id="section_files">
				<div class="heading">FILES:</div>
				<div class="contents">
				</div>
			</div>

			<div class="infoSection" id="section_server">
				<div class="heading">SERVER:</div>
				<div class="contents">
				</div>
			</div>

			<div class="infoSection" id="section_backtrace">
				<div class="heading">BACKTRACE:</div>
				<div class="contents">
				</div>
			</div>

		</div>

	</div>

</div>

</body>

</html>