// direction_chart.js:  Direction Radial Bar Chart (!!  NOT WORKING !!)
// Reference: https://bl.ocks.org/bricedev/8aaef92e64007f882267
//
//    Problems:
//      * Outputs too many segments to the graph
//      * Segments in the wrong place
//      * Using sample csv file with all possible segments filled for testing as it
//        auto-fills any empty segments, messing up the order of the graph
//      * D3 doesn't seem to support counting of occurences in a radial bar chart?
//          - This will need further research and possibly experimentation using
//            different libraries
//
//    Intended functionality:
//      * Display the last recorded direction (in degrees) and at what time it was recorded
//      * Display count of each direction it ever travelled in a radial bar chart that is
//        in segments of 30 degrees (0-30, 30-60, etc).
//      * Display most common and least common directions recorded

// Array for storing data
var buoyLocation;

// Load the CSV file into array
function preload() {
    // Currently loading an altered test file that contains all possible directions for
    // testing purposes
    buoyLocation = loadStrings('data/acoustic2.csv');
}

function setup() {
    var buoyData = buoyLocation[buoyLocation.length-1].split(/,/); // Split each field of last entry by comma and insert into a new array
    var curTime = buoyData[0];
    var curDegrees = (buoyData[4] * (180 / Math.PI)); // Convert radians to degrees
    var curDate = new Date(curTime * 1000); // Convert Unix timestamp into datetime string
    // Display the last recorded direction on the page
    document.getElementById("waveheighttxt").innerHTML = "Last recorded direction: <b>" + Math.round(curDegrees) + "&deg;</b> on " + curDate;

// Graph Begins

// Initialise Graph
var margin = {top:30, right:20, bottom:30, left:60},
    width = 512,
    height = 450,
    barHeight = height / 2 - 20;

// Colour range for the segments
var color = d3.scale.ordinal()
    .range(["#8dd3c7","#ffffb3","#bebada","#fb8072","#80b1d3","#fdb462","#b3de69","#fccde5","#d9d9d9","#bc80bd","#ccebc5","#ffed6f"]);

// Add the graph to the page
var svg = d3.select(".direction_graph")
    .append("svg")
      .attr("width", width)
      .attr("height", height)
    .append("g")
      .attr("transform",
            "translate(" + width/2 + ", " + height/2 + ")");

var date = 0;         // To store the new converted date
var hrsmins = "";     // To store the time as a string
var maxDir = -999;    // Will be used to see which line had highest wave height
var minDir = 999;     // Will be used to see which line had lowest wave height

var dirCount = new Array(11); // 12 space array to hold the count of the occurrences
var dirSection = 0;           // The section to be added to or displayed

// Initialise array and set all to 0
for (i = 0; i < 12; i++) {
  dirCount[i] = 0;
}

// Loop through all lines to count the occurence of each degree segment
for (i = 1; i < buoyLocation.length; i++) {
  var buoyData = buoyLocation[i].split(/,/); // Split each field of current entry by comma and insert into a new array
  // Convert radians to degrees, round it, then divide by 30 to find the segment it will go into
  dirSection = Math.round((buoyData[4] * (180 / Math.PI)) / 30);
  // Increase the count of the segment
  dirCount[dirSection] = dirCount[dirSection] + 1;
}

// Meant to provide the count of the current segment and to prevent the graph from
// counting the number of lines when it should be counting the number of segments.
// Possibly bad logic.
var segment = 0;

// Store the CSV file data to be added to the graph
d3.csv("data/acoustic2.csv", function(error, data) {
  // Loop through each line and save in object variable
  data.forEach(function(d) {
    // Reset the hrsmins string on each loop
    hrsmins = "";
    d.timestamp = +d.timestamp;
    // Convert timestamp from Unix format to string
    date = new Date(d.timestamp * 1000);
  })

    // Return the minimum and maximum count of the 12 segments
    var extent = d3.extent(data, function(d) {
      if (segment < 11) {
        segment = segment + 1;
      }
      return dirCount[segment];
    });

    // Set the scale of the bars (and rest of the graph) to fit the segment sizes
    // ERROR - Changing bar height range (e.g. barHeight -> barHeight - 40)
    //         changes the location of the segments
    var barScale = d3.scale.linear()
        .domain(extent)
        .range([0, barHeight]);

    var index = 0;
    var keys = data.map(function(d, i) { index = index+1; return index; });
    // The number of segments and bars on the graph
    // ERROR - Changing the number of bars to 27 reveals there are 27 bars + 2
    //         strangely overlapping ones
    var numBars = 12;

    // Set the size of the X axis
    var x = d3.scale.linear()
        .domain(extent)
        .range([0, -barHeight]);

    // Set Y axis settings and location
    var xAxis = d3.svg.axis()
        .scale(x).orient("left")
        .ticks(3);

    // Draw the background circle
    var circles = svg.selectAll("circle")
          .data(x.ticks(3))
        .enter().append("circle")
          .attr("r", function(d) { return barScale(d); })
          .style("fill", "none")
          .style("stroke", "black")
          .style("stroke-dasharray", "2,2")
          .style("stroke-width", ".5px");

    // Dynamically sets the size of the bars to fit the circle depending on the
    // number of bars
    var arc = d3.svg.arc()
        .startAngle(function(d, i) { return (i * 2 * Math.PI) / numBars; })
        .endAngle(function(d, i) { return ((i + 1) * 2 * Math.PI) / numBars; })
        .innerRadius(0);

    // Draw the bars
    var segments = svg.selectAll("path")
          .data(data)
        .enter().append("path")
          .each(function(d) { d.outerRadius = 0; })
          .style("fill", function(d) { return color(d.direction); })
          .attr("d", arc);

    // Current segment being displayed
    var segment2 = 0;

    // Animation when they appear
    segments.transition().ease("elastic").duration(1000).delay(function(d, i) { return (25-i)*20; })
            .attrTween("d", function(d,index) {
              // Set the d.direction to the count of the current segment
              d.direction = dirCount[segment2];
              var i = d3.interpolate(d.outerRadius, barScale(d.direction));
              if (segment2 < 11) {
                // Increase the current segment
                segment2 = segment2 + 1;
              }
              return function(t) { d.outerRadius = i(t); return arc(d,index); };
            });

    // Draw the outermost circle
    svg.append("circle")
        .attr("r", barHeight)
        .classed("outer", true)
        .style("fill", "none")
        .style("stroke", "black")
        .style("stroke-width", "1.5px");

    // Draw the lines between the bars
    var lines = svg.selectAll("line")
          .data(keys)
        .enter().append("line")
          .attr("y2", -barHeight - 20)
          .attr("stroke", "black")
          .style("stroke-width", ".5px")
          .attr("transform", function(d,i) { return "rotate(" + (i * 360 / numBars) + ")"; });

    // Draw the X axis
    svg.append("g")
        .attr("class", "x axis")
        .call(xAxis);

    // Labels
    var labelRadius = barHeight * 1.025;
    var labels = svg.append("g")
          .classed("labels", true)

    labels.append("def")
          .append("path")
          .attr("id", "label-path")
          .attr("d", "m0 " + -labelRadius + " a" + labelRadius + " " + labelRadius + " 0 1,1 -0.01 0");

    // Draw the labels
    labels.selectAll("text")
          .data(keys)
        .enter().append("text")
          .style("text-anchor", "middle")
          .style("font-weight", "bold")
          .style("fill", function(d,i) { return "#3e3e3e"; })
          .append("textPath")
          .attr("xlink:href", "#label-path")
          .attr("startOffset", function(d,i) { return (i * 100 / numBars + 50 / numBars) + '%';})
          .text(function(d) {
            // 30 degree sections (0-30, 30-60, etc)
            return d*30-30+"-"+ d*30;
          });

        });

}
