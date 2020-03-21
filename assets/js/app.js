// function makeResponsive() {

    // if the SVG area isn't empty when the browser loads,
  // remove it and replace it with a resized version of the chart
//   var svgArea = d3.select("body").select("svg");

//   // clear svg is not empty
//   if (!svgArea.empty()) {
//     svgArea.remove();
//   };
    /////////////////////
    // set parameters //
    ////////////////////

    svgWidth = 750;
    svgHeight = 600;

    // svgWidth = window.innerWidth > 750 ? 750 : window.innerWidth; // if innerwidth is greater than 750, set to 750, if not set to innerwidth
    // svgHeight = window.innerHeight > 600 ? 600 : window.innerHeight;

    var margin = {
        top: 30,
        right: 40,
        bottom: 80,
        left: 50
    };

    var width = svgWidth - margin.left - margin.right;
    var height = svgHeight - margin.top - margin.bottom;

    // create svg wrapper 
    var svg = d3.select("#scatter")
        .append("svg")
        .classed(".chart", true)
        .attr("width", svgWidth)
        .attr("height", svgHeight);

    // append an svg group and position it in the center
    var chartGroup = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`)

    // initial parameters
    var chosenXAxis = "poverty";

    //////////////////////////////////////////////////////////
    // function to update x-sxale upon click on axis label //
    //////////////////////////////////////////////////////////

    function xScale(censusData, chosenXAxis) {
        // create x axis scale
        var xLinearScale = d3.scaleLinear()
            .domain([d3.min(censusData, d => d[chosenXAxis]) * 0.8,
                d3.max(censusData, d => d[chosenXAxis]) * 1.2])
                .range([0, width]);

        return xLinearScale;
    }

    ///////////////////////////////////////////////////////////////////
    // function used for updating xAxis var upon click on axis label //
    ///////////////////////////////////////////////////////////////////

    function renderAxes(newXScale, xAxis) {
        var bottomAxis = d3.axisBottom(newXScale);

        xAxis.transition()
            .duration(1000)
            .call(bottomAxis);
        
        return xAxis;
    };

    ///////////////////////////////////////////////////////////////////////////////
    // function used for updating circles group with a transition to new circles //
    ///////////////////////////////////////////////////////////////////////////////

    function renderCircles(circlesGroup, newXScale, chosenXAxis) {

        circlesGroup.transition()
            .duration(1000)
            .attr("cx", d => newXScale(d[chosenXAxis]));
        
        return circlesGroup;
    };

    ///////////////////////////////////////////////////////////////
    // function used for updating circles group with new tooltip //
    ///////////////////////////////////////////////////////////////

    function updateToolTip(chosenXAxis, circlesGroup) {

        var label;
        
        if (chosenXAxis === "poverty") {
            label = "Population in Poverty (%)"
        }
        else {
            label = "Household Income (Median)"
        }

        var toolTip = d3.tip()
            .attr("class", "d3-tip")
            .offset([80, -60])
            .html(function(d) {
                return (`${d.state}<br>${label}: ${d[chosenXAxis]}<br>% without Healthcare: ${d.healthcare}`)
        });

        // call tooltip to chart
        circlesGroup.call(toolTip);

        // event listener
        circlesGroup.on("mouseenter", function(data) {
            toolTip.show(data, this);
        })
        .on("mouseleave", function(data, index) {
            toolTip.hide(data)
        });

        return circlesGroup;
    };


    /////////////////////////
    // load data from csv //
    ////////////////////////

    d3.csv("assets/data/data.csv").then(function(censusData, err) {
        if (err) throw err;

        console.log(censusData);

        // parse data
        censusData.forEach(function(data) {
            data.healthcare = +data.healthcare;
            data.poverty = +data.poverty;
            data.income = +data.income;
        });

        // create scales
        var minHealthcare = d3.min(censusData, d => d.healthcare)+2;
        var maxHealthcare = d3.max(censusData, d => d.healthcare)+2;
        // var minPoverty = d3.min(censusData, d => d.poverty)+2;
        // var maxPoverty = d3.max(censusData, d => d.poverty)+2;
        // console.log(maxPoverty);
        // console.log(minPoverty);

        // var xScale = d3.scaleLinear()
        //     .domain([minPoverty-3, maxPoverty])
        //     .range([0, width]);

        // xLinearScale function
        var xLinearScale = xScale(censusData, chosenXAxis);

        // y scale function
        var yScale = d3.scaleLinear()
            .domain([minHealthcare-3, maxHealthcare])
            .range([height, 0]);

        // create axes
        var bottomAxis = d3.axisBottom(xLinearScale);
        var leftAxis = d3.axisLeft(yScale);

        // append x axis to svg 
        var xAxis = chartGroup.append("g")
            .classed("x-axis", true)
            .attr("transform", `translate(0, ${height})`)
            .call(bottomAxis);
        
        // append y axis
        chartGroup.append("g")
            .call(leftAxis);

        // // create circles
        // var circlesGroup = chartGroup.selectAll("circle")
        //     .data(censusData)
        //     .enter()
        //     .append("circle")
        //     .classed("stateCircle", true)
        //     .attr("cx", d => xScale(d.poverty))
        //     .attr("cy", d => yScale(d.healthcare))
        //     .attr("r", "20")

        // append initial circles
        var circlesGroup = chartGroup.selectAll("circle")
            .data(censusData)
            .enter()
            .append("circle")
            .classed("stateCircle", true)
            .attr("cx", d => xLinearScale(d[chosenXAxis]))
            .attr("cy", d => yScale(d.healthcare))
            .attr("r", "20")

        // append text on circles
        chartGroup.selectAll("stateText")
            .data(censusData)
            .enter()
            .append("text")
            .attr("class", "stateText")
            .attr("x", d => xLinearScale(d[chosenXAxis])) 
            .attr("y", d => yScale(d.healthcare))
            // .attr("dx", ".71em")
            .attr("dy", ".35em")
            .text(function(d) {return d.abbr})

        // text on circles
        // chartGroup.selectAll("stateText")
        //     .data(censusData)
        //     .enter()
        //     .append("text")
        //     .attr("class", "stateText")
        //     .attr("x", d => xScale(d[chosenXAxis]))
        //     .attr("y", d => yScale(d.healthcare))
        //     // .attr("dx", ".71em")
        //     .attr("dy", ".35em")
        //     .text(function(d) {return d.abbr})
            

        // // tool tip
        // var toolTip = d3.tip()
        //     .attr("class", "d3-tip")
        //     // .offset([80, -60])
        //     .html(function(d) {
        //         return (`${d.state}<br>% in Poverty: ${d.poverty}<br>% without Healthcare: ${d.healthcare}`)
        //     });
        
        // // call tooltip to chart
        // chartGroup.call(toolTip);

        // // event listener
        // circlesGroup.on("mouseenter", function(data) {
        //     toolTip.show(data, this)
        // })
        // .on("mouseleave", function(data) {
        //     toolTip.hide(data)
        // })

        // create group for 2 x-axis labels
        var labelsGroup = chartGroup.append("g")
            .attr("transform", `translate(${width / 2}, ${height + 20})`);
        
        var povertyLabel = labelsGroup.append("text")
            .attr("class", "aText")
            .attr("x", 0)
            .attr("y", 20)
            .attr("value", "poverty")
            .text("Population in Poverty (%)");

        var incomeLabel = labelsGroup.append("text")
            .attr("class", "aText")
            .attr("x", 0)
            .attr("y", 40)
            .attr("value", "income")
            .text("Household Income (Median)");

        // y axis labels
        chartGroup.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left )
            .attr("x", 0 - (height/2))
            .attr("dy", "1em")
            .attr("class", "aText")
            .text("Lacks Healthcare (%)")
        
        // x axis label
        // chartGroup.append("text")
        //     .attr("transform", `translate(${width/2}, ${height + margin.top + 20})`)
        //     .attr("class", "aText")
        //     .text("Population in Poverty (%)")

        // updateToolTip function 
        var circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

        // x axis labels event listener
        labelsGroup.selectAll("text")
            .on("click", function() {
                var value = d3.select(this).attr("value");
                if (value !== chosenXAxis) {

                    // replace chosenXAxis (set above as poverty) with value
                    chosenXAxis = value;

                    // update x scale with new data
                    xLinearScale = xScale(censusData, chosenXAxis);

                    // updates x axis with transition
                    xAxis = renderAxes(xLinearScale, xAxis);

                    // update circles with new x values
                    circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);

                    // update tooltips with new info
                    circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

                    // changes classes to change bold text of x-axis
                    if (chosenXAxis === "income") {
                        incomeLabel
                            .classed("active", true)
                            .classed("inactive", false);
                        povertyLabel   
                            .classed("active", false)
                            .classed("inactive", true);
                    }
                    else {
                        incomeLabel
                            .classed("active", false)
                            .classed("inactive", true);
                        povertyLabel   
                            .classed("active", true)
                            .classed("inactive", false);
                    }


                }
            })

    }).catch(function(error) {
        console.log(error)
    });
// };

// makeResponsive();

// d3.select(window).on("resize", makeResponsive);
