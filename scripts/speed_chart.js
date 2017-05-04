// speed_chart.js:  Speed Line Graph
// Reference: http://bl.ocks.org/d3noob/b3ff6ae1c120eea654b5
//
//    * Display the last recorded Speed and at what time it was recorded
//    * Display a Line Graph of the history of recorded speeds and their time
//        + Improvements: As the sample CSV file is so small, it is difficult to develop
//              and test for data that could be over many months. The graph has been
//              designed around data over a couple of hours, but for larger timespans
//              it may not display correctly. Must be edited to dynamically scale
//              depending on the dataset.
//    * Display the Maximum and Minimum speeds recorded

// Array for storing data
var buoyLocation;

// Load the CSV file into array
function preload() {
    buoyLocation = loadStrings('data/acoustic.csv');
}

function setup() {
    var data = buoyLocation[buoyLocation.length-1].split(/,/); // Split each field of last entry by comma and insert into a new array
    var curTime = data[0];
    var curspeed = data[3];
    var curDate = new Date(curTime * 1000); // Convert Unix timestamp into datetime string
    // Display the last recorded speed on the page
    document.getElementById("speedtxt").innerHTML = "Last recorded speed was: <b>" + data[3] + " m/s</b> on " + curDate;

// Graph Begins

// Initialise Graph
var margin = {top:30, right:20, bottom:30, left:60},
    width = 425,
    height = 450;

// Set the size of the X and Y axes
var x = d3.scale.linear().range([0, width]);
var y = d3.scale.linear().range([height, 0]);

// Set X axis settings and location
var xAxis = d3.svg.axis().scale(x)
    .orient("bottom").ticks((buoyLocation.length-1)).tickFormat(function(d) {
      // Convert the time labels to time format (60 mins in hour)
      //    * Improvements: This only works for small data sets. Because of sample file, couldn't
      //          set it to months or days as I hoped as it would be too small to see. D3 automatic
      //          axis labels would set time as 1360+ instead of 1400, so had to make a quick fix.
      dstring = d + "";
      // Fix time string format
      if (dstring.substring(2,4) >= 60) {
        return (((parseInt(dstring.substring(0,2)) + 1)  * 100) + (parseInt(dstring.substring(2,4)) - 60));
      } else {
        return d;
      }
    });

// Set Y axis settings and location
var yAxis = d3.svg.axis().scale(y)
    .orient("left").ticks(5);

// Set X axis as timestamp and Y axis as speed
var valueline = d3.svg.line()
    .x(function(d) { return x(d.timestamp); })
    .y(function(d) { return y(d.speed); });

// Add the graph to the page
var svg = d3.select(".line_graph")
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform",
            "translate(" + margin.left + ", " + margin.top + ")");

var date = 0;         // To store the new converted date
var hrsmins = "";     // To store the time as a string
var maxSpeed = -999; // Will be used to see which line had highest speed
var minSpeed = 999;  // Will be used to see which line had lowest speed

// Store the CSV file data to be added to the graph
d3.csv("data/acoustic.csv", function(error, data) {
    // Loop through each line and save in object variable
    data.forEach(function(d) {
        // Reset the hrsmins string on each loop
        hrsmins = "";
        d.timestamp = +d.timestamp;
        // Convert timestamp from Unix format to string
        date = new Date(d.timestamp * 1000);
        d.speed = +d.speed;

        // If current line's speed is bigger than the current maximum
        if (d.speed >= maxSpeed) {
          // Set as the new maximum
          maxSpeed = d.speed;
          // Output it to the page
          document.getElementById("maxspeedtxt").innerHTML = maxSpeed + " m/s"
        }
        // If the current line's speed is smaller than the curren minimum
        if (d.speed <= minSpeed) {
          // Set as the new minimum
          minSpeed = d.speed;
          // Output it to the page
          document.getElementById("minspeedtxt").innerHTML = minSpeed + " m/s"
        }

        // Fix the time string if it is too short
        if (date.getHours() < 10) {
          hrsmins += "0"+date.getHours();
        } else {
          hrsmins += date.getHours();
        }

        if (date.getMinutes() < 10){
          hrsmins += "0"+date.getMinutes();
        } else {
          hrsmins += date.getMinutes();
        }

        // Set the current timestamp to the time string for output
        d.timestamp = hrsmins;
    })

    // Set the minimum and maximum values of the X axis to the minimum and maximum of all timestamps
    x.domain(d3.extent(data, function(d) { return d.timestamp; }));
    // Set the minimum and maximum values of the Y axis to the minimum and maximum of all speeds
    y.domain(d3.extent(data, function(d) { return d.speed; }));

    // Join the plotted points with lines
    svg.append("path")
      .attr("class", "line")
      .attr("d", valueline(data));

    // Tooltip t hat is hidden until mouseover
    var tooltip = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

    // Draw X axis
    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0,"+ height + ")")
      .call(xAxis);

    // Draw Y axis
    svg.append("g")
      .attr("class", "y axis")
      .call(yAxis);

      // Draw the points of the data on the graph as black circles
      svg.selectAll("dot")
        .data(data)
      .enter().append("circle")
          .attr("r", function(d) { return 3.5; })
          .attr("cx", function(d) { return x(d.timestamp); })
          .attr("cy", function(d) { return y(d.speed); })
          .style("fill", "black")
          .on("mouseover", function(d) { // Display tooltip information on mouseover
            tooltip.transition()
              .duration(200)
              .style("opacity", .9);
            tooltip.html("Speed: " + d.speed)
              .style("left", (d3.event.pageX + 5) + "px")
              .style("top", (d3.event.pageY - 28) + "px");
          })
          .on ("mouseout", function(d) { // Hide tooltip information on mouseout
            tooltip.transition()
              .duration(500)
              .style("opacity", 0);
          });

        // Add "Time" label to X axis
        svg.append("text")
          .attr("transform", "translate(" + (width / 2) + " ," + (height + margin.bottom) + ")")
          .style("text-anchor", "middle")
          .text("Time")

        // Add "Height (metres)" label to Y axis and rotate 90 degrees to the left
        svg.append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 0 - margin.left)
          .attr("x", 0 - (height / 2))
          .attr("dy", "1em")
          .style("text-anchor", "middle")
          .text("Speed (m/s)");

});

}
