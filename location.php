<!DOCTYPE html>
<html lang="en">
<head>

<?php include_once('includes/head.php');?><!-- include the head tag -->
<script src="lib/p5.js" type="text/javascript"></script>
<script src="lib/p5.dom.js" type="text/javascript"></script>
<script src="scripts/location_chart.js" type="text/javascript"></script>
 <script src="lib/d3js/d3-v3.js" charset="utf-8"></script>
<script src='https://api.mapbox.com/mapbox.js/v3.0.1/mapbox.js'></script>
<link href='https://api.mapbox.com/mapbox.js/v3.0.1/mapbox.css' rel='stylesheet' />
<center><title>Location - Mk4 Buoy</title></center>
</head>
<!-- NOTE bodypad & padding-top: 70px -->
<body class="bodypad">

	<div class="container-fluid" id="wrapper"><!-- begin 1.div container fluid -->
		<?php include_once('includes/navbars.php');?><!-- include navbars -->

		<div class="container-fluid" id="wrapper"><!-- begin 2.div container fluid -->

			<div class="container-fluid main" align="center"><!-- begin 3.div container fluid main -->
			<h1 class="page-title">Location</h1>
				<p id="locationtxt">Location N/A</p>

				<div id="mapHolder"><!-- begin 4.div - p5.js holder -->

					<!-- Identify where the chart should be drawn. -->
						<div id="map-leaflet" class="map" style="height: 512px; width: 512px;"></div>
				</div><!-- end 4.div - p5.js holder -->

				<br>
        <h2 class="page-title">History</h1>
				<svg class="scatter_graph" style="height: 512px; width: 512px;"></svg> <!-- D3 Scatter Graph (scripts/location_chart.js) -->
				<br>
					<h3>Last 10 locations:</3>
  				<table id="locationHistory" border="1">
  				</table>
			</div><!-- end 3.div container fluid main -->

			<?php include_once('includes/sidebar.php');?><!-- include siderbar -->
		</div><!-- end 2.div container fluid -->

	</div><!-- end 1.div container fluid -->

</body>
</html>
