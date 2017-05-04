<!DOCTYPE html>
<html lang="en">
<head>

<?php include_once('includes/head.php');?><!-- include the head tag -->
<script src="lib/p5.js" type="text/javascript"></script>
<script src="lib/p5.dom.js" type="text/javascript"></script>
<script src="scripts/direction_chart.js" type="text/javascript"></script>
 <script src="lib/d3js/d3-v3.js" charset="utf-8"></script>
<script src='https://api.mapbox.com/mapbox.js/v3.0.1/mapbox.js'></script>
<link href='https://api.mapbox.com/mapbox.js/v3.0.1/mapbox.css' rel='stylesheet' />
<style>
  .axis path,
  .axis line {
    fill: none;
    stroke = #000;
    shape-rendering = crispEdges;
  }

  .x.axis path {
    display:none;
  }
</style>
<center><title>Direction - Mk4 Buoy</title></center>
</head>
<!-- NOTE bodypad & padding-top: 70px -->
<body class="bodypad">

	<div class="container-fluid" id="wrapper"><!-- begin 1.div container fluid -->
		<?php include_once('includes/navbars.php');?><!-- include navbars -->

		<div class="container-fluid" id="wrapper"><!-- begin 2.div container fluid -->

			<div class="container-fluid main" align="center"><!-- begin 3.div container fluid main -->
			<h1 class="page-title">Direction</h1>
        <p id="waveheighttxt">Direction  N/A</p>
				<svg class="direction_graph" style="height: 512px; width: 512px;"></svg>
				<br><br>

					<b>Maximum:</b> <span id="maxheighttxt">N/A</span><br>
          <b>Minimum:</b> <span id="minheighttxt">N/A</span><br><br>
			</div><!-- end 3.div container fluid main -->
			<?php include_once('includes/sidebar.php');?><!-- include siderbar -->
		</div><!-- end 2.div container fluid -->

	</div><!-- end 1.div container fluid -->
</body>
</html>