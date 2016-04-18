var countryById = d3.map(); // will have id's as keys for countries; see typeAndSet()

//set up tooltip!
    
var tooltip = d3.select("#tooltip")
 .attr("class", "tooltip")
 .style("opacity", 0);

var parseDate = d3.time.format("%Y").parse;
var outputDate = d3.time.format("%Y");
    
var energyUses = {};

queue()
    .defer(d3.json, "data/countries.json")
    .defer(d3.csv, "data/energy_use_kgpc.csv", typeAndSet)
    .defer(d3.csv, "data/co2_emissions.csv")
    .await(ready);

function ready(error, world, energy, emissions) {

    console.log(error, world, energy, emissions);
    
    mapSection(world, energy);
    
    barChartSection(emissions);
    
    scatterSection(energy, emissions);

} // end function ready

function typeAndSet(d) {
    d["2012"] = +d["2012"];
    countryById.set(d["Country Code"], d); // this is a d3.map, being given a key, value pair.
    return d;
}

d3.selection.prototype.moveToFront = function() {
  return this.each(function(){
    this.parentNode.appendChild(this);
  });
};
    
function highlight(id){
    d3.selectAll("#"+id).classed("selected", true);
}
    
function disHighlight(id){
    d3.selectAll("#"+id).classed("selected", false);
}