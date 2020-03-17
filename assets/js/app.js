// load data from csv
d3.csv("assets/data/data.csv").then(function(censusData) {
    console.log(censusData);

    censusData.forEach(function(d) {
        d["healthcare"] = +d["healthcare"];
        console.log(d);
    })

    // var healthcare = censusData.map(x => parseFloat(x.healthcare));
    // var poverty = censusData.map(x => parseFloat(x.poverty));
    // console.log("healthcare", healthcare);
    // console.log("poverty", poverty);

    

});