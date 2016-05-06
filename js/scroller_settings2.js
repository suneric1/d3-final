var settings = {};

var mapViz = d3.select("#mapViz");
//var barViz = d3.select("#barViz");
var scatterViz = d3.select("#scatterViz");
var lineViz = d3.select("#lineViz");
var connectedViz = d3.select("#connectedViz");
var allViz = d3.selectAll(".vizDiv");

var update = function(value) {
    
    switch(value) {
        case 0:
            console.log("in case", value);
            allViz.style("display", "none");
        break;
            
        case 1:
            console.log("in case", value);
            allViz.style("display", "none");
            mapViz.style("display", "inline-block");
        break;

        case 2:
            console.log("in case", value);
            allViz.style("display", "none");
//            barViz.style("display", "inline-block");
            mapViz.style("display", "inline-block");
        break;

        case 3:
            console.log("in case", value);
            allViz.style("display", "none");
            scatterViz.style("display", "inline-block");
        break;

        case 4:
            console.log("in case", value);
            allViz.style("display", "none");
            lineViz.style("display", "inline-block");
        break;

        case 5:
            console.log("in case", value);
            allViz.style("display", "none");
            connectedViz.style("display", "inline-block");
        break;

        default:
            allViz.style("display", "none");
        break;
    }
};