<?php
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
	<div id="topsidebar">
		Debug & Tattle v5

		<span class="" id="statusbuttonswrapper_progressbar"></span>

	</div>

	<div id="bottomsidebar">
		2016 - Nickolas Andersen (nicksen782)
	</div>

	<div id="sidebar_container">
		<div id="leftsidebar">
			<div class="title">Command Options</div>
			<div class="contents">
				<div class="cmdLink" onclick="getTattleList();">REFRESH</div>
				<div class="cmdLink" onclick="deleteAllTattles()">DELETE ALL TATTLES</div>
				<!--<div class="cmdLink" style="visibility:hidden;">DELETE OLD TATTLES</div>-->
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
		<div id="mainviewingarea_X" onclick="hideMainView();">X</div>
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