// function makeResponsive() {


    // set parameters
    svgWidth = 750;
    svgHeight = 600;
    // svgWidth = window.innerWidth;
    // svgHeight = window.innerHeight;

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
        var minHealthcare = d3.min(censusData, d => d.healthcare)+2;
        var maxHealthcare = d3.max(censusData, d => d.healthcare)+2;
        console.log(maxHealthcare);
        console.log(minHealthcare);
        var minPoverty = d3.min(censusData, d => d.poverty)+2;
        var maxPoverty = d3.max(censusData, d => d.poverty)+2;
        console.log(maxPoverty);
        console.log(minPoverty);

        var xScale = d3.scaleLinear()
            .domain([minPoverty-3, maxPoverty])
            .range([0, width]);

        var yScale = d3.scaleLinear()
            .domain([minHealthcare-3, maxHealthcare])
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
            .classed("stateCircle", true)
            .attr("cx", d => xScale(d.poverty))
            .attr("cy", d => yScale(d.healthcare))
            .attr("r", "20")
            // .attr("fill", "pink")
            // .attr("opacity", "0.5");

        // text on circles
        chartGroup.selectAll("stateText")
            .data(censusData)
            .enter()
            .append("text")
            .attr("class", "stateText")
            .attr("x", d => xScale(d.poverty))
            .attr("y", d => yScale(d.healthcare))
            // .attr("dx", ".71em")
            .attr("dy", ".35em")
            .text(function(d) {return d.abbr})
            

        // // tool tip
        var toolTip = d3.tip()
            .attr("class", "d3-tip")
            // .offset([80, -60])
            .html(function(d) {
                return (`${d.state}<br>% in Poverty: ${d.poverty}<br>% without Healthcare: ${d.healthcare}`)
            });
        
        // call tooltip to chart
        chartGroup.call(toolTip);

        // event listener
        circlesGroup.on("mouseover", function(data) {
            toolTip.show(data, this)
        })
        .on("mouseout", function(data) {
            toolTip.hide(data)
        })

        // axes labels
        chartGroup.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left )
            .attr("x", 0 - (height/2))
            .attr("dy", "1em")
            .attr("class", "aText")
            .text("Lacks Healthcare (%)")
        
        chartGroup.append("text")
            .attr("transform", `translate(${width/2}, ${height + margin.top + 20})`)
            .attr("class", "aText")
            .text("Population in Poverty (%)")

    }).catch(function(error) {
        console.log(error)
    });
// };

// makeResponsive();

// // d3.select(window).on("resize", makeResponsive);
