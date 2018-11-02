// a freeCodeCamp data visualization project by Jim Carroll
// please feel free to fork this code to use for your own project

// ************************GLOBAL VARIABLES & FUNCTIONS*************************

// global variables for json call
let dataset
let base
const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json"

// color scheme from http://colorbrewer2.org/
const colors = ["#a50026","#d73027","#f46d43","#fdae61","#fee090","#ffffbf","#e0f3f8","#abd9e9","#74add1","#4575b4","#313695"]

// set temps and colors for legend
// NOTE: min temp = 1.68, max temp = 13.89. See console.log below.
const legendScale = [2.8, 3.9, 5, 6.1, 7.2, 8.3, 9.5, 10.6, 11.7, 12.8, 12.9]

const legendArr = [
  [colors[10], legendScale[0]],
  [colors[9], legendScale[1]],
  [colors[8], legendScale[2]],
  [colors[7], legendScale[3]],
  [colors[6], legendScale[4]],
  [colors[5], legendScale[5]],
  [colors[4], legendScale[6]],
  [colors[3], legendScale[7]],
  [colors[2], legendScale[8]],
  [colors[1], legendScale[9]],
  [colors[0], legendScale[10]]
]

// set color of individual rects based on temp
const getColor = (temp) => {
  let color = ""
  temp = base + temp

  switch (true) {
    case (temp < legendScale[0]):
      color = colors[10]
      break
    case (temp < legendScale[1]):
      color = colors[9]
      break
    case (temp < legendScale[2]):
      color = colors[8]
      break
    case (temp < legendScale[3]):
      color = colors[7]
      break
    case (temp < legendScale[4]):
      color = colors[6]
      break
    case (temp < legendScale[5]):
      color = colors[5]
      break
    case (temp < legendScale[6]):
      color = colors[4]
      break
    case (temp < legendScale[7]):
      color = colors[3]
      break
    case (temp < legendScale[8]):
      color = colors[2]
      break
    case (temp < legendScale[9]):
      color = colors[1]
      break
    case (temp >= legendScale[10]):
      color = colors[0]
      break
  }
  return color
} // end of getColor

// function returns month names
const getMonth = (num) => {
  let month = ""

  switch(num) {
    case 1:
      month = "January"
      break
    case 2:
      month = "February"
      break
    case 3:
      month = "March"
      break
    case 4:
      month = "April"
      break
    case 5:
      month = "May"
      break
    case 6:
      month = "June"
      break
    case 7:
      month = "July"
      break
    case 8:
      month = "August"
      break
    case 9:
      month = "September"
      break
    case 10:
      month = "October"
      break
    case 11:
      month = "November"
      break
    case 12:
      month = "December"
      break
  }
  return month
} // end of getMonth

// map margins
const margin = {
  top: 75,
  right: 15,
  bottom: 125,
  left: 85
}

// width, height, and padding
const width = 1400
const height = 700
const padding = 120

// function returns margin for tooltips
const toolMargin = (year) => {
  let mar
  if (year < 1970) {
    mar = 15
  } else {
    mar = -210
  }
  return mar
}

// ********************JSON CALL**********************

req = new XMLHttpRequest()
req.open("GET", url ,true)
req.send()
req.onload = () => {
  json = JSON.parse(req.responseText)
  dataset = json.monthlyVariance
  base = json.baseTemperature
  map()
}

// **********************MAP FUNCTION************************

const map = () => {

  // data arrays
  let monthArr = []
  let yearArr = []
  let varArr = []
  let dataArr = []

  // fill the data arrays
  for (let i = 0; i < dataset.length - 1; i++) {
    monthArr.push(dataset[i].month)
    yearArr.push(dataset[i].year)
    varArr.push(dataset[i].variance)
    dataArr[i] = [dataset[i].year, dataset[i].month, dataset[i].variance]
  }

  // min and max years
  const minYear = new Date(d3.min(yearArr) + ",1,1")
  const maxYear = new Date(d3.max(yearArr) + ",1,1")

  // min and max temperatures
  const minTemp = d3.min(varArr)
  const maxTemp = d3.max(varArr)

  // console.log(minYear)
  // console.log(maxYear)
  // console.log((minTemp + 8.66).toFixed(2)) // outputs 1.68
  // console.log((maxTemp + 8.66).toFixed(2)) // outputs 13.89
  // console.log(varArr)

  // x-scale
  const xScale = d3.scaleTime()
    .domain([minYear, maxYear])
    .range([padding, width - padding])

  // y-scale
  const yScale = d3.scaleLinear()
    .domain([1, 12.6])
    .range([padding, height - padding])

  // create the map
  const svg = d3.select(".map")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("class", "chart")

  // create data rects
  svg.selectAll("rect")
    .data(dataArr)
    .enter()
    .append("rect")
    .attr("class", "cell")
    .attr("data-month", (d) => getMonth(d[1]))
    .attr("data-year", (d) => d[0])
    .attr("data-temp", (d) => (base + d[2]))
    .attr("x", (d) => xScale(new Date(d[0] + ",1,1")))
    .attr("y", (d) => yScale(d[1]))
    .attr("width", 10)
    .attr("height", (height - 2 * padding) / 11.5)
    .attr("fill", (d) => getColor(d[2]))
    // tooltip on mouseover
    .on("mouseover", (d) => {
      d3.select(".cell-" + d[0] + "" + d[1])
        .attr("fill", "#bec3e2")
        .attr("data-year", (d) => d[0])
      d3.select("#tooltip")
        .attr("opacity", 0.9)
        .attr("x", xScale(new Date(d[0] + ",1,1")) + toolMargin(d[0]))
        .attr("y", yScale(d[1]))
      svg.append("text")
        .attr("id", "toolText")
        .attr("x", xScale(new Date(d[0] + ",1,1")) + toolMargin(d[0]) + 25)
        .attr("y", yScale(d[1]) + 30)
        .attr("fill", "#000000")
        .text(getMonth(d[1]) + " " + d[0] + " || " + (base + d[2]).toFixed(2) + "\u2103")
    })
    // tooltip mouseout
    .on("mouseout", (d) => {
      d3.select(".cell-" + d[0] + "" + d[1])
        .attr("fill", getColor(d[2]))
      d3.selectAll("#tooltip")
        .attr("opacity", 0)
      d3.select("#toolText")
        .remove()
    })

  // add tooltip
  svg.append("g")
    .append("rect")
    .attr("opacity", 0)
    .attr("id", "tooltip")
    .attr("width", 200)
    .attr("height", 50)
    .attr("fill", "#bec3e2")
    .attr("rx", 5)
    .attr("ry", 5)

  // legend
  svg.selectAll()
    .data(legendArr)
    .enter()
    .append("rect")
    .attr("id", "legend")
    .attr("x", (d, i) => (50 * i) + padding)
    .attr("y", height - 50)
    .attr("width", 50)
    .attr("height", 50)
    .attr("fill", (d) => d[0])

  // label for cooler side of data
  svg.append("text")
    .text("cooler")
    .attr("x", padding + 10)
    .attr("y", height - padding / 7)
    .attr("fill", "#ffffff")
    .attr("font-size", "1.5em")
    .attr("font-weight", "bold")

  // label for warmer side of data
  svg.append("text")
    .text("warmer")
    .attr("x", padding * 4.9)
    .attr("y", height - padding / 7)
    .attr("fill", "#ffffff")
    .style("font-size", "1.5em")
    .style("font-weight", "bold")

  // x-axis
  const xAxis = d3.axisBottom(xScale)
    .tickFormat(d3.timeFormat("%Y"))
    svg.append("g")
      .attr("id", "x-axis")
      .attr("transform", "translate(0, " + (height - padding + 15) + ")")
      .call(xAxis)

  // y-axis
  const yAxis = d3.axisLeft(yScale).tickFormat((d) => getMonth(d))
    svg.append("g")
      .attr("id", "y-axis")
      .attr("transform", "translate(" + padding + ", " + 15 + ")")
      .call(yAxis)

  // title
  svg.append("text")
    .attr("id", "title")
    .attr("x", width / 2)
    .attr("y", padding / 2)
    .attr("text-anchor", "middle")
    .style("font-size", "1.6em")
    .style("font-weight", "bold")
    .text("Monthly Global Land-Surface Temperature, 1753-2015")

  // subtitle
  svg.append("text")
    .attr("id", "description")
    .attr("x", width / 2)
    .attr("y", (padding / 2) + 25)
    .attr("text-anchor", "middle")
    .text("base temperature 8.66 \u2103")

} // end of map function
