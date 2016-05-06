var countryById = d3.map(); // will have id's as keys for countries; see typeAndSet()

//set up tooltip!
    
var tooltip = d3.select("#tooltip")
 .attr("class", "tooltip")
 .style("opacity", 0);

var parseDate = d3.time.format("%Y").parse;
var outputDate = d3.time.format("%Y");
    
var energyUses = {};

var energyMax, emissionMax;

var datasetGlobal = [], yearsGlobal = [];

queue()
    .defer(d3.json, "data/countries.json")
    .defer(d3.csv, "data/energy_use_kgpc.csv", typeAndSet)
    .defer(d3.csv, "data/co2_emissions.csv")
    .defer(d3.csv, "data/energy_data.csv")
    .await(ready);

function ready(error, world, energy, emissions, energy_data) {
    
    yearsGlobal = d3.keys(energy[0]).filter(function(d){return d.startsWith("1") || d.startsWith("2");});

    var energy_data_temp = d3.nest().key(function(d){
        return d["Country Code"];
    }).sortKeys(d3.descending).entries(energy_data);
//    
//    energy.forEach(function(d){
//        emissions.forEach(function(e){
//            if(d["Country Code"] == e["Country Code"]){
//                var countryData = [];
//                yearsGlobal.forEach(function(year){
//                    if(d[year] && e[year])
//                        countryData.push({
//                            country: d["Country Name"], 
//                            id: d["Country Code"], 
//                            energyUse: +d[year], 
//                            emissions: +e[year], 
//                            year: year
//                        });
//                });
//                datasetGlobal.push({
//                    country: d["Country Name"], 
//                    id: d["Country Code"], 
//                    data: countryData
//                });
//            }
//        });
//    });
    
    energy_data_temp.forEach(function(d){
        var countryData = [];
        yearsGlobal.forEach(function(year){
            var energyUseInYear, emissionsInYear, cleanPerc, fossilPerc;
            d.values.forEach(function(v){
                if(v["Indicator Code"] == "EG.USE.PCAP.KG.OE"){
                    energyUseInYear = +v[year];
                }
                else if(v["Indicator Code"] == "EG.USE.COMM.CL.ZS"){
                    cleanPerc = +v[year];
                }
                else if(v["Indicator Code"] == "EG.USE.COMM.FO.ZS"){
                    fossilPerc = +v[year];
                }
                else if(v["Indicator Code"] == "EG.USE.CRNW.ZS"){
                    combPerc = +v[year];
                }
            });
            
            emissions.forEach(function(e){
                if(e["Country Code"] == d.key && e[year])
                    emissionsInYear = +e[year];
            });
                
            if(energyUseInYear && emissionsInYear)
                countryData.push({
                    country: d.values[0]["Country Name"], 
                    id: d.key, 
                    energyUse: energyUseInYear,
                    cleanPerc: cleanPerc,
                    fossilPerc: fossilPerc,
                    combPerc: combPerc,
                    emissions: emissionsInYear, 
                    year: year
                });
        });
        
        datasetGlobal.push({
            country: d.values[0]["Country Name"], 
            id: d.key, 
            data: countryData
        });
    });

    console.log(datasetGlobal);

    console.log(error, world, energy, emissions);
    
    emissionMax = d3.max(datasetGlobal, function(cd){
        return d3.max(cd.data, function(d){
            return d.emissions;
        });
    });

    console.log(emissionMax);
    
    mapSection(world, energy);
    
    barChartSection(emissions, energy, energy_data);
    
    scatterSection(energy, emissions);
    
    lineSection(energy, emissions);
    
    connectedScatter(energy, emissions);
    
    d3.selectAll(".hltext")
        .on("mouseover",function(d){
        highlight(d3.select(this).attr("id"));
    })
        .on("mouseout",function(d){
        disHighlight(d3.select(this).attr("id"));
        d3.select(".scatterPlot circle#ISL").classed("selected",true);
    })
    
    var scroll = scroller()
        .container(d3.select('#graphic'));
    scroll(d3.selectAll('.step'));
    scroll.update(update);  

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
    d3.selectAll("path#"+id).moveToFront();
    d3.selectAll("#"+id).classed("selected", true);
    console.log(id);
}
    
function disHighlight(id){
    d3.selectAll("#"+id).classed("selected", false);
}