function displayToolTip() { 

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
    
    
    //append chart to the scatter id in html
    var chart = d3.select("#scatter").append("div").classed("chart", true);
    
    //append svg 
    var svg = chart.append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight);
    
    //append group
    var chartGroup = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);
    
    
    var xLabelName = "Active Military Count";
    var yLabelName = "Sightings Total";
    
    // Read json

    

    d3.json("/mapping_data").then(function(mappingData) {
    
        // parse data
        mappingData.forEach(function(data) {
          //console.log(data)
          //console.log(data.state_long)
          //console.log(data.operational_status)
          //console.log(data.sightings_total)
          //console.log(data.mj_legal)
          data.operational_status = +data.operational_status;
          data.sightings_total = +data.sightings_total;
          //console.log("after appending")
          //console.log(data)

        });
    
    
        // create scales
        var xScale = d3.scaleLinear()
        .domain([d3.min(mappingData, d => d.operational_status) - 5, d3.max(mappingData, d => d.operational_status) + 15])
        .range([0, width]);
        //.padding(0.05);
    
        var yScale = d3.scaleLinear()
        .domain([d3.min(mappingData, d => d.sightings_total) - 10, d3.max(mappingData, d => d.sightings_total) + 50])
        .range([height, 0]);
        
    
        // create axes
        var xAxis = d3.axisBottom(xScale);
        var yAxis = d3.axisLeft(yScale);
    
        //append x axis
        chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(xAxis);
    
        //append y axis
        chartGroup.append("g")
        .classed("y-axis", true)
        .call(yAxis);
    
    
        // append circles to data points
        var circlesGroup = chartGroup.selectAll("circle")
        .data(mappingData)
        .enter()
        .append("circle")
        //.classed("stateCircle", true)
        .classed('stateCircle1', function(d) { return d.mj_legal === 'Yes'; })
        .classed('stateCircle2', function(d) { return d.mj_legal === 'No'; })
        .attr("cx", d => xScale(d.operational_status))
        .attr("cy", d => yScale(d.sightings_total))
        .attr("opacity", ".75")
        .attr("r", "12");
    
        //append initial text
        chartGroup.selectAll(".stateText")
        .data(mappingData)
        .enter()
        .append("text")
        .classed("stateText", true)
        .attr("x", d => xScale(d.operational_status))
        .attr("y", d => yScale(d.sightings_total))
        .attr("dy", 3)
        .attr("font-size", "10px")
        .text(function(d){return d.state_short});
    
        //append label
        var xLabel = chartGroup.append("g")
        .attr("transform", `translate(${width / 3}, ${height + 20 + margin.top})`);
        
        //append label text
        xLabel.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "operational_status")
        .text("Active Military Bases Count");
        
        //append label
        var yLabel = chartGroup.append("g")
        .attr("transform", `translate(${0 - margin.left/4}, ${(height/1.5)})`);
    
        //append label text
        yLabel.append("text")
        .attr("x", 0)
        .attr("y", 0 - 20)
        .attr("transform", "rotate(-90)")
        .attr("value", "sightings_total")
        .text("Sightings Total");
    
        // Step 1: Initialize Tooltip
        var toolTip = d3.tip()
            .attr("class", "d3-tip")
            .offset([-8, 0])
            .html(function(d) {
            //console.log(`${d.state}`);
            //console.log(`${xLabelName} ${d.poverty}`);
            //console.log(`${yLabelName} ${d.healthcare}`);
            
            return (`${d.state_long}<br> MJ Legal: ${d.mj_legal} <br>Active Miltary Bases: ${d.operational_status} <br>Sightings Count: ${d.sightings_total}`);
        });
    
        // Step 2: Create the tooltip in chartGroup.
        circlesGroup.call(toolTip);
    
        //add events
        circlesGroup.on("mouseover", function(d) {
            toolTip.show(d, this);
          })
          // Step 4: Create "mouseout" event listener to hide tooltip
            .on("mouseout", function(d) {
              toolTip.hide(d);
            });
         }).catch(function(error) {
               console.log(error);
        });
        
    }
    // When the browser loads, displayToolTip() is called.
    displayToolTip();
    
    

