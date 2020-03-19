// set parameters
svgWidth = 960;
svgHeight = 500;

var margin = {
    top: 20,
    right: 40,
    bottom: 60,
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

// load data from csv
d3.csv("assets/data/data.csv").then(function(censusData) {
    console.log(censusData);

    // parse data
    censusData.forEach(function(data) {
        var healthcare = (data.healthcare = +data.healthcare);
        console.log(healthcare)
        var poverty = (data.poverty = +data.poverty);
        console.log(poverty)
    });

    // create scales
    var maxHealthcare = d3.max(censusData, d => d.healthcare)+5;
    console.log(maxHealthcare);

    var xScale = d3.scaleLinear()
        .domain([0, maxHealthcare])
        .range([0, width]);

    var maxPoverty = d3.max(censusData, d => d.poverty)+5;
    console.log(maxPoverty);

    var yScale = d3.scaleLinear()
        .domain([0, maxPoverty])
        .range([height, 0]);

    // create axes
    var bottomAxis = d3.axisBottom(xScale);
    var leftAxis = d3.axisLeft(yScale);

    // append axes to svg 
    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);
    
    chartGroup.append("g")
        .call(leftAxis);

    // create circles
    var circlesGroup = chartGroup.selectAll("circle")
        .data(censusData)
        .enter()
        .append("circle")
        .attr("cx", d => xScale(d.healthcare))
        .attr("cy", d => yScale(d.poverty))
        .attr("r", "15")
        .attr("fill", "pink")
        .attr("opacity", "0.5");

    // // tool tip
    var toolTip = d3.tip()
        .attr("class", "d3-tip")
        .offset([80, -60])
        .html(function(d) {
            return (`${d.state}<br>Without Healthcare: ${d.healthcare}<br>% in Poverty: ${d.poverty}`)
        });
    
    // // call tooltip to chart
    chartGroup.call(toolTip);

    // event listener
    circlesGroup.on("mouseover", function(data) {
        toolTip.show(data, this);
    })
    .on("mouseout", function(data, index) {
        toolTip.hide(data)
    })
    // axes labels



}).catch(function(error) {
    console.log(error)
});