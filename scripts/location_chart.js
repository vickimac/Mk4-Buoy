// location_chart.js:
  // * Display the current Lat/Lon of the buoy and at what time it was recorded
  // * Display a MapBox map of the current location the nupu
  // * Display a Scattar Graph of the history of buoy locations
  // * Display a HTML table of the last 10 locations and their dates

// DATA FILE: data/location.csv

// API Key for MapBox
var accessToken = 'pk.eyJ1Ijoidmlja2luZXNzMTIzIiwiYSI6ImNqMGZiZW15NzAwMzYzM3FrbjFwbjBoZnIifQ.n1QoMOC5Zgd5oAmhAqwhDg';

// Array for storing data
var buoyLocation;

// Default MapBox lon, lat, and zoom
var defaultLon = 58.52,
    defaultLat = -6.27,
    defaultZoom = 15;

// Load the CSV file into array
function preload() {
    buoyLocation = loadStrings('data/location.csv');
}

function setup() {
    // Apply API key to MapBox in order to use
    L.mapbox.accessToken = accessToken;
    // Initialise map appearance and default lat/lon + zoom level
    var mapLeaflet = L.mapbox.map('map-leaflet', 'mapbox.light')
      .setView([defaultLon, defaultLat], defaultZoom);

    // Disable scroll wheel zooming for UX. User can easily accidentally zoom out when trying to scroll down to see rest of page
    // Clickable buttons for zooming still available
    mapLeaflet.scrollWheelZoom.disable();

    // Current Location - update text and map with the last entry in the csv file
      var data = buoyLocation[buoyLocation.length-1].split(/,/); // Split each field of last entry by comma and insert into a new array
      var curLat = data[2];
      var curLon = data[3];
      // Display the current location on the page
      document.getElementById("locationtxt").innerHTML = "The buoy's current location is: <b>" + data[2] + "</b>&deg; N, <b>" + (data[3] * -1) + "</b>&deg; W";
      L.marker([data[2], data[3]]).addTo(mapLeaflet);

    // table headers
      var table = document.getElementById("locationHistory");
      var data = buoyLocation[0].split(/,/);
      var tr = document.createElement("tr");

      // date_time
        var th = document.createElement("th");
        var txt = document.createTextNode(data[0]);
        th.appendChild(txt);
        tr.appendChild(th);
      // lat
        var th = document.createElement("th");
        var txt = document.createTextNode(data[2]);
        th.appendChild(txt);
        tr.appendChild(th);

      // lon
        var th = document.createElement("th");
        var txt = document.createTextNode(data[3]);
        th.appendChild(txt);
        tr.appendChild(th);

      table.appendChild(tr);

    // last 10 locations - add to table
    for (var i = buoyLocation.length - 1; i > (buoyLocation.length - 11); i--) {
      // split everything by a comma
      var data = buoyLocation[i].split(/,/);

      var tr = document.createElement("tr");

      // date_time
        var td = document.createElement("td");
        var txt = document.createTextNode(data[0]);
        var att = document.createAttribute("style");
        att.value = "font-weight: 500; background: #f4f4f4;";
        td.setAttributeNode(att);
        td.appendChild(txt);
        tr.appendChild(td);
      // lat
        var td = document.createElement("td");
        var txt = document.createTextNode(data[2]);
        td.appendChild(txt);
        tr.appendChild(td);

      // lon
      var td = document.createElement("td");
      var txt = document.createTextNode(data[3]);
      td.appendChild(txt);
      tr.appendChild(td);


      table.appendChild(tr);
    }

// Location Scatter Graph
// Reference: http://bl.ocks.org/d3noob/38744a17f9c0141bcd04

  // Initialise graph
  var margin = {top: 30, right: 20, bottom: 30, left: 60},
      width = 512 - margin.left - margin.right,
      height = 512 - margin.top - margin.bottom;

  // Set the size of the X and Y axes
  var x = d3.scale.linear().range([0, width]);
  var y = d3.scale.linear().range([height, 0]);

  // Set X axis settings and location
  var xAxis = d3.svg.axis().scale(x)
      .orient("bottom").ticks(5);

  // Set Y axis settings and location
  var yAxis = d3.svg.axis().scale(y)
      .orient("left").ticks(5);

  // Set X axis as Longitude and Y axis as Latitude
  var valueline = d3.svg.line()
      .x(function(d) { return x(d.lon); })
      .y(function(d) { return y(d.lat); });

  // Add the graph to the page
  var svg = d3.select(".scatter_graph")
      .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");

    // Store the CSV file data to be added to the graph
    d3.csv("data/location.csv", function(error, data) {
        // Loop through each line and save in object variable
        data.forEach(function(d) {
          d.lon = +d.lon;
          d.lat = +d.lat;
          d.date = +d.date_time;
        })

        // Set minimum and maximum values of the X and Y axes
        x.domain(d3.extent(data, function(d) { return d.lon; }));
        y.domain(d3.extent(data, function(d) { return d.lat; }));

        // Join the plotted points with lines
        svg.append("path")
            .attr("class", "line")
            .attr("d", valueline(data));

        // Tooltip that is hidden until mouseover
        var tooltip = d3.select("body").append("div")
          .attr("class", "tooltip")
          .style("opacity", 0);

        // Draw X axis
        svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis);

        // Draw Y axis
        svg.append("g")
          .attr("class", "y axis")
          .call(yAxis);

          // Draw the points of the data on the graph as black circles
          // Current location is larger and red
          svg.selectAll("dot")
            .data(data)
          .enter().append("circle")
            .attr("r", function(d) {
                              if (d.lat == curLat && d.lon == curLon) {
                                return 7; // Make the current location larger
                              } else {
                                return 3.5;
                              }})
            .attr("cx", function(d) { return x(d.lon); })
            .attr("cy", function(d) { return y(d.lat); })
            .style("fill", function(d) {
                              if (d.lat == curLat && d.lon == curLon) {
                                return "red"; // Make the current location red
                              }})
            .on("mouseover", function(d) { // Display tooltip information on mouseover
              tooltip.transition()
                .duration(200)
                .style("opacity", .9);
              tooltip.html("Long: " + d.lon + " <br> Lat: " + d.lat)
                .style("left", (d3.event.pageX + 5) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
            })
            .on("mouseout", function(d) { // Hide tooltip information on mouseout
              tooltip.transition()
                .duration(500)
                .style("opacity", 0);
            });

        // Add "Longitude" label to X axis
        svg.append("text")
            .attr("transform", "translate(" + (width / 2) + " ," + (height + margin.bottom) + ")")
            .style("text-anchor", "middle")
            .text("Longitude")

        // Add "Latitude" label to Y axis and rotate 90 degrees to the left
        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left)
            .attr("x", 0 - (height / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("Latitude");
    });
}
