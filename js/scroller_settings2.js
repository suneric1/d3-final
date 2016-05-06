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
            allViz.transition().duration(300).style("opacity", 0).style("display", "none");
        break;
            
        case 1:
            console.log("in case", value);
            allViz.transition().duration(300).style("opacity", 0).style("display", "none");
            mapViz.transition().duration(300).style("opacity", 1).style("display", "inline-block");
        break;

        case 2:
            console.log("in case", value);
            allViz.transition().duration(300).style("opacity", 0).style("display", "none");
            mapViz.transition().duration(300).style("opacity", 1).style("display", "inline-block");
        break;

        case 3:
            console.log("in case", value);
            allViz.transition().duration(300).style("opacity", 0).style("display", "none");
            scatterViz.transition().duration(300).style("opacity", 1).style("display", "inline-block");
        break;

        case 4:
            console.log("in case", value);
            allViz.transition().duration(300).style("opacity", 0).style("display", "none");
            lineViz.transition().duration(300).style("opacity", 1).style("display", "inline-block");
        break;

        case 5:
            console.log("in case", value);
            allViz.transition().duration(300).style("opacity", 0).style("display", "none");
            connectedViz.transition().duration(300).style("opacity", 1).style("display", "inline-block");
        break;

        default:
            allViz.transition().duration(300).style("opacity", 0).style("display", "none");
        break;
    }
};