//url that has the json with the data
var url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json";

//variables that will hold the data and base temp
var dataSet;
var base;

//array that is used as the legend and colors for the temps
var legendArr = [
    ["#00FF00" , "2.8"] ,
    ["#00FF33" , "3.9"] ,
    ["#00FF66" , "5"] ,
    ["#00FF99" , "6.1"] ,
    ["#00FFCC" , "7.2"] ,
    ["#00FFFF" , "8.3"] ,
    ["#00CCFF" , "9.5"] ,
    ["#0099FF" , "10.6"] ,
    ["#0066FF" , "11.7"] ,
    ["#0033FF" , "12.8"] ,
    ["#0000FF" , ""]
  ];

      //
      //Get THE DATA
      req=new XMLHttpRequest();
      req.open("GET", url ,true);
      req.send();
      req.onload=function(){
        json=JSON.parse(req.responseText);
        dataSet = json.monthlyVariance;
        base = json.baseTemperature;
        map();
      };
      //END OF GET THE DATA
      //

function map() {

  //constants for width heigth and padding
  const w = 1400;
  const h = 650;
  const padding = 120;

  //arrays that will hold the data
  var monthArr = [];
  var yearArr = [];
  var varArr = [];
  var dataArr = [];

  //fill the arrays
  for(var i = 0; i < dataSet.length -1; i++) {
    monthArr.push(dataSet[i].month);
    yearArr.push(dataSet[i].year);
    varArr.push(dataSet[i].variance);
    dataArr[i] = [dataSet[i].year , dataSet[i].month , dataSet[i].variance];
  }

  //get the min and max years
  var minYear = new Date((d3.min(yearArr) - 5 ) + ",1,1");
  var maxYear = new Date((d3.max(yearArr) + 10 )+ ",1,1");

  //get the min and max times
  var minMonth = new Date("2018,1,1");
  var maxMonth = new Date("2018,12,31");

  //create the x scale
   const xScale = d3.scaleTime()
                     .domain([minYear , maxYear])
                     .range([padding, w - padding]);

  //create the yscale
  const yScale = d3.scaleLinear()
                    .domain([1 , 13])
                    .range([padding , h - padding]);

  //select the body to add d3 elements
  const svg = d3.select(".map")
                .append("svg")
                .attr("width", w)
                .attr("height", h)
                .attr("class" , "chart");

  //enter the data object and add dots per item
  svg.selectAll("rect")
       .data(dataArr)
       .enter()
       .append("rect")
       .attr("class" , "cell")
       .attr("class" ,(d) => "cell-" + d[0] + "" + d[1])
       .attr("data-month" , (d) => getMonth(d[1]) )
       .attr("data-year" , (d) => d[0] )
       .attr("data-temp" , (d) => (base + d[2]) )
       .attr("x" , (d) => xScale(new Date(d[0] + ",1,1")))
       .attr("y" , (d) => yScale(d[1]) )
       .attr("width" , 5)
       .attr("height" , (h - 2*padding)/11.5)
       .attr("fill" , (d) => getColor(d[2]))
       .on("mouseover" , (d) => {
          d3.select( ".cell-" + d[0] + "" + d[1]).attr("fill" , "yellow");
          d3.select("#tooltip")
              .attr("opacity" , ".8")
              .attr("x" , xScale(new Date(d[0] + ",1,1")) + margin(d[0]) )
              .attr("y" , yScale(d[1]))

              svg.append("text")
                .attr("id" , "tooltext")
                .attr("x" , xScale(new Date(d[0] + ",1,1")) + margin(d[0]) + 25 )
                .attr("y" , yScale(d[1]) + 30)
                .attr("fill" , "#FFF")//
                .text(  getMonth(d[1]) + " " + d[0] + " -||- " + (base + d[2]).toFixed(3) + "°" )
          })
       .on("mouseout" , (d) => {
          d3.select( ".cell-" + d[0] + "" + d[1]).attr("fill" , getColor(d[2]));
          d3.selectAll("#tooltip").attr("opacity" , "0");
          d3.select("#tooltext").remove();
      });

  //add the tooltip to show the details of the data
  svg.append("g")
      .append("rect")
      .attr("opacity" , "0")
      .attr("id" , "tooltip")
      .attr("width" , 200)
      .attr("height" , 50)
      .attr("fill" , "#333")
      .attr("rx" , 5)
      .attr("ry" , 5);

  //adding the legend to the heatmap
  svg.selectAll()
    .data(legendArr)
    .enter()
    .append("rect")
    .attr("id" , "legend")
    .attr("x" ,(d ,i) => ((50*i)) + padding)
    .attr("y" , h - 50)
    .attr("width" , 50)
    .attr("height" , 50)
    .attr("fill" , (d) => d[0]);

  //add the labels to the data
  svg.append("text")
    .text("Cooler")
    .attr("x" , padding + 10)
    .attr("y" , h - padding / 7)
    .attr("fill" , "#FFF")
    .attr("font-size" , "2em")
    .attr("font-weight" , "bold");

  //add the lables to the data
  svg.append("text")
    .text("Warmer")
    .attr("x" , padding * 4.5)
    .attr("y" , h -padding/7)
    .attr("fill" , "#FFF")
    .attr("font-size" , "2em")
    .attr("font-weight" , "bold");

  //add the x axis
  const xAxis = d3.axisBottom(xScale);
        svg.append("g")
          .attr("id" , "x-axis")
          .attr("transform", "translate( 0 , " + (h - padding + 15) + ")")
          .call(xAxis);

  //add the y axis
  const yAxis = d3.axisLeft(yScale)
                    .tickFormat((d) => getMonth(d));
        svg.append("g")
          .attr("id" , "y-axis")
          .attr("transform", "translate(" + (padding) + ", " + (15) + ")")
          .call(yAxis);

  //add a title to the scatter plot
  svg.append("text")
     .attr("id" , "title")
     .attr("x", (w/2))
     .attr("y", (padding/2))
     .attr("text-anchor", "middle")
     .style("font-size", "24px")
     .text("Monthly Global Land-Surface Temperature");

  //add a subtitle to the scatter plot
  svg.append("text")
     .attr("id" , "description")
     .attr("x", (w/2))
     .attr("text-anchor", "middle")
     .attr("y", ((padding/2) + 20))
     .text("1753 - 2015: base temperature 8.66℃");


}//end of map function

//function that will return a margin for the tooltip
function margin(year) {
  var mar;
  if(year < 1970 ) {
    mar = 15;
  }
  else {
    mar = -210;
  }
  return mar;
}

//function that will return the text month
function getMonth(num) {
  var mon = "";

      switch (num) {
        case 1:
            mon = "January";
            break;
        case 2:
            mon = "February";
            break;
        case 3:
            mon = "March";
            break;
        case 4:
            mon = "April";
            break;
       case 5:
            mon = "May";
            break;
       case 6:
            mon = "June";
            break;
       case 7:
            mon = "July";
            break;
       case 8:
            mon = "August";
            break;
       case 9:
            mon = "September";
            break;
       case 10:
            mon = "October";
            break;
       case 11:
            mon = "November";
            break;
        case 12:
            mon = "December";
            break;
        default:
            mon = "";
            break;
    }
  return mon;
}//end of getMonth

//function that will decide which color a rect will be
//legend array is used to set the colors
function getColor(temp) {
  var color = "";
  temp = base + temp;

      switch (true) {
        case (temp < legendArr[0][1]):
            color = legendArr[0][0];
            break;
        case (temp < legendArr[1][1]):
            color = legendArr[1][0];
            break;
        case (temp < legendArr[2][1]):
            color = legendArr[2][0];
            break;
       case (temp < legendArr[3][1]):
            color = legendArr[3][0];
            break;
       case (temp < legendArr[4][1]):
            color = legendArr[4][0];
            break;
       case (temp < legendArr[5][1]):
            color = legendArr[5][0];
            break;
       case (temp < legendArr[6][1]):
            color = legendArr[6][0];
            break;
       case (temp < legendArr[7][1]):
            color = legendArr[7][0];
            break;
       case (temp < legendArr[8][1]):
            color = legendArr[8][0];
            break;
       case (temp < legendArr[9][1]):
            color = legendArr[9][0];
            break;
        default:
            color = legendArr[10][0];
            break;
    }
  return color;
}//end of getColor
