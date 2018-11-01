var margin = {top: 75, right: 15, bottom: 125, left: 85},
    width = 1200 - margin.left - margin.right,
    height = 555 - margin.top - margin.bottom;

var x = d3.scale.linear().range([0, width]),
    y = d3.scale.linear().range([0, height]);

// Variables for colors and legend:
var mint = "#05B89A",
    teal = "#0B90B6",
    corn = "#FFCE65",
    yellow = "#FFC039",
    gold = "#FFC707",
    orange = "#FF9339",
    sun = "#FF6307",
    heart = "#FF4739",
    red = "#FF1907",
    hot = "960018",
    colors = [ "#05B89A", "#0B90B6", "#FFCE65", "#FFC039", "#FFC707", "#FF9339", "#FF6307", "#FF4739", "#FF1907", "960018" ],
    legendScale = ["0 - 3", "3 - 5.5", "5.5 - 6", "6 - 6.5", "6.5 - 7", "7 - 8.5", "8.5 - 9", "9 - 9.5", "9.5 - 10", "10+"];

// Function to scale temperature to color:
var colorScale = function(temp) {
  if (temp >= 0 && temp < 3) { return mint; }
  else if (temp >= 3 && temp < 5.5) { return teal; }
  else if (temp >= 5.5 && temp < 6) { return corn; }
  else if (temp >= 6 && temp < 6.5) { return yellow; }
  else if (temp >= 6.5 && temp < 7) { return gold; }
  else if (temp >= 7 && temp < 8.5) { return orange; }
  else if (temp >= 8.5 && temp < 9) { return sun; }
  else if (temp >= 9 && temp < 9.5) { return heart; }
  else if (temp >= 9.5 && temp < 10) { return red; }
  else if (temp >= 10 && temp < 15) { return hot; }
}

// Append main chart element
var svg = d3.select("#chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Append div for tooltip on hover:
var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

// Get data:
d3.json('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json', function(error, response) {

  if (error) {
    console.log('There was an error in the JSON call');
  }

  var baseTemp = response.baseTemperature;
  var data = response.monthlyVariance;

  // Convert d.month values to strings for tooltip:
  var convertMonth = function(n) {
    if (n === 1) { return "January" }
    else if (n === 2) { return "February" }
    else if (n === 3) { return "March" }
    else if (n === 4) { return "April" }
    else if (n === 5) { return "May" }
    else if (n === 6) { return "June" }
    else if (n === 7) { return "July" }
    else if (n === 8) { return "August" }
    else if (n === 9) { return "September" }
    else if (n === 10) { return "October" }
    else if (n === 11) { return "November" }
    else if (n === 12) { return "December" }
  }

  // Calculate the domains based on the data:
  x.domain(d3.extent(data, function(d) { return d.year; }));
  y.domain(d3.extent(data, function(d) { return d.month; }));

  // Render the data in an svg:
  svg.selectAll("svg")
      .data(data)
    .enter().append("rect")
      .attr("class", "tile")
      .attr("x", function(d) { return x(d.year); })
      .attr("y", function(d) { return y(d.month); })
      .attr("width", 5)
      .attr("height", height / 10)
      .attr("transform", "translate(0, -20)")
      .style("fill", function(d) { return colorScale(baseTemp + d.variance); })
        .on("mouseover", function(d) {
            div.transition()
                .duration(200)
                .style("opacity", .9);
            div	.html(convertMonth(d.month) + " " + d.year + "<br />Temperature: " + (baseTemp + d.variance).toFixed(2) + "ºC<br />Variance: " + d.variance)
                .style("left", (d3.event.pageX + 7) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
            })
        .on("mouseout", function(d) {
            div.transition()
                .duration(500)
                .style("opacity", 0);
        });

  // Add the title:
  svg.append("text")
        .attr("x", (width / 2))
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")
        .attr("class", "title")
        .style("font-size", "26px")
        .style("font-family", "Avenir")
        .style("fill", "#FCFCFC")
        .text("Visualizing Global Surface Temperature Change Since the 1700s");

  // Add the x-axis:
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + 371 + ")")
      .call(d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .tickFormat(d3.format("y"))
        .tickSize(6, 0)
      )
      .style("fill", "#FCFCFC")
      .style("font-size", "14px")
      .style("font-family", "Avenir");

  // Add custom time scale to display months as text:
  var yCustomScale = d3.time.scale()
    .domain([new Date(2012, 0, 1), new Date(2012, 11, 31)])
    .range([0, height + 35]);

  // Set months as yAxis variable
  var yAxis = d3.svg.axis()
    .scale(yCustomScale)
    .orient("left")
    .ticks(d3.time.months)
    .tickSize(0, 0)
    .tickFormat(d3.time.format("%B"));

  // Append y-axis
  svg.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate(0, -15)")
      .call(yAxis)
    .selectAll(".tick text")
      .style("text-anchor", "end")
      .style("fill", "#FCFCFC")
      .style("font-size", "14px")
      .style("font-family", "Avenir")
      .attr("x", -8)
      .attr("y", 12);

    // Set legend data to colors array
    var legend = svg.selectAll(".legend")
              .data(colors);

    // Add a legend element
    legend.enter().append("g")
      .attr("class", "legend");

    // Add color blocks to legend
    legend.append("rect")
      .attr("x", function(d, i) { return  75 * i; })
      .attr("y", height + 55)
      .attr("width", 75)
      .attr("height", 28)
      .style("fill", function(d, i) { return colors[i]; });

    // Append text labels to each color element in legend
    legend.append("text")
      .attr("class", "legendLabels")
      .text(function(d, i) { return legendScale[i]; })
      .attr("x", function(d, i) { return 75 * i + 10; })
      .attr("y", height + 75)
      .style("font-family", "Avenir")
      .style("fill", "rgb(25, 25, 25)");

    // Add a title to the legend
    svg.append("text")
      .attr("x", 10)
      .attr("y", height + 102)
      .attr("class", "Legendtitle")
      .style("font-size", "15px")
      .style("font-family", "Avenir")
      .style("fill", "#949992")
      .text("Colors represent temperature in Celsius; base temperature = 8.66ºC");

});
