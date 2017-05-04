<div class="container-fluid" id="wrapper">
	<div class="container-fluid sidebar">
		<ul class="no-bullet">
			<li><a href="index.php" class="<?php
if (basename($_SERVER['PHP_SELF']) == 'index.php') {
	echo 'current';
} else {
	echo 'sidebar-link';
}
			?>"><b>Information</b></a></li>
		</ul>
		<ul class="no-bullet">
			<li><b>Graphs</b></li>
			<li><a href="wave-height.php" class="<?php
if (basename($_SERVER['PHP_SELF']) == 'wave-height.php') {
	echo 'current';
} else {
	echo 'sidebar-link';
}
			?>">Wave Height</a></li>
			<li><a href="location.php" class="<?php
if (basename($_SERVER['PHP_SELF']) == 'location.php') {
	echo 'current';
} else {
	echo 'sidebar-link';
}
			?>">Location</a></li>
			<li><a href="speed.php" class="<?php
if (basename($_SERVER['PHP_SELF']) == 'speed.php') {
	echo 'current';
} else {
	echo 'sidebar-link';
}
			?>">Speed</a></li>
			<li><a href="temperature.php" class="<?php
if (basename($_SERVER['PHP_SELF']) == 'temperature.php') {
	echo 'current';
} else {
	echo 'sidebar-link';
}
			?>">Temperature</a></li>
			<li><a href="velocity.php" class="<?php
if (basename($_SERVER['PHP_SELF']) == 'velocity.php') {
	echo 'current';
} else {
	echo 'sidebar-link';
}
			?>">Vectical Velocity</a></li>
		</ul>
	</div>
</div>
