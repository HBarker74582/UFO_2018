
//set svg dimensions
var svgWidth = 900;
var svgHeight = 600;

//set borders in svg
var margin = {
  top: 10,
  right: 50,
  bottom: 150,
  left: 150
};

//Calculate chart width and height
var width = svgWidth - margin.right - margin.left;
var height = svgHeight - margin.top - margin.bottom;

// set the ranges
var x = d3.scaleBand().range([0, width]).padding(.15);
var y = d3.scaleLinear().range([height, 0]);

// define the axis
var xAxis = d3.axisBottom(x);
var yAxis = d3.axisLeft(y);

//append chart to the scatter id in html
var bar_chart = d3.select("#bar").append("div");

// add the SVG element
var svg = bar_chart.append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform",
    "translate(" + margin.left + "," + margin.top + ")");


d3.json("/word_cloudusatotals").then(function (wordCloud) {

  // parse data
  wordCloud.forEach(function (data) {
    // console.log("inside world cloud");
    // console.log(data.count);
    // console.log(data.word);
    //console.log(data.sightings_total)
    //console.log(data.mj_legal)
    data.word = data.word;
    data.count = +data.count;
    // console.log("after appending");
    // console.log(data);

  });


  // scale the range of the data
  x.domain(wordCloud.map(function (d) { return d.word; }));
  y.domain([0, d3.max(wordCloud, function (d) { return d.count; })]);

  // add axis
  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)
    .selectAll("text")
    .style("text-anchor", "end")
    .attr("dx", "-.8em")
    .attr("dy", "-.55em")
    .attr("transform", "rotate(-90)");

  svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 5)
    .attr("dy", ".71em")
    .style("text-anchor", "end");


  // Add bar chart
  svg.selectAll("bar")
    .data(wordCloud)
    .enter().append("rect")
    .attr("class", "bar")
    .attr("x", function (d) { return x(d.word); })
    .attr("width", x.bandwidth())
    .attr("y", function (d) { return y(d.count); })
    .attr("height", function (d) { return height - y(d.count); });

  // text label for the x axis
  svg.append("text")
    .attr("transform",
      "translate(" + (width / 2) + " ," +
      (height + margin.top + 75) + ")")
    .style("text-anchor", "middle")
    .text("Object Shape");

  // text label for the y axis
  svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 80 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("Sightings Count");


});




