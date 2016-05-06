function barChartSection(emissions, energyUses, energy_data){
    
    var fullWidth = 380,
        fullHeight = 300,
        margin = {top:5, bottom:50, left:100, right:50},
        width = fullWidth - margin.left - margin.right,
        height = fullHeight - margin.top - margin.bottom,
        active = d3.select(null);
            
    var xScale = d3.scale.linear().range([0,width]);
    var yScale = d3.scale.ordinal().rangeRoundBands([0,height],0.38);
    
    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient("top")
        .ticks(5)
        .tickPadding([-height-15])
        .tickSize([height]);

    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("left")
        .tickSize([0]);
    
    var svg = d3.select("#barViz")
        .append("svg")
        .attr("width",fullWidth)
        .attr("height",fullHeight)
        .append("g")
        .attr("class","barChart bars_co2")
        .attr("width",width)
        .attr("height",height)
        .attr("transform","translate(" + margin.left + "," + margin.top + ")");
                
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);
    
    svg.select("g.y.axis")
        .append("line")
        .attr("x1", width)
        .attr("y1", 0)
        .attr("x2", width)
        .attr("y2", height);
    
    var fossilPerc = energy_data.filter(function(d){
        return d["Indicator Code"] == "EG.USE.COMM.FO.ZS";
    });
    
    console.log("fp",fossilPerc);
    
//    var energyType = ["cleanPerc", "fossilPerc", "combPerc"];
//    
//    var stack = d3.layout.stack();
//
//    var color = d3.scale.category20();
    
//    color.domain(energyType);
    
    fossilPerc = fossilPerc.filter(function(d){
        return d["2011"] != "" && d["2011"] != "0";
    });
    
    drawBarChart(emissions, "2011", "top");
    
    function top_10(data, year){
        return data.sort(function(a,b){
            return b[year] - a[year];
        }).slice(0,10);
    }
    
    function bottom_10(data, year){
        return data.sort(function(a,b){
            return a[year] - b[year];
        }).slice(0,10);
    }
    
    d3.selectAll("button").on("click",function(d){
        if(d3.select(this).attr("id") == "emissionBar"){
            drawBarChart(emissions, "2011", "top");
        }
        else if(d3.select(this).attr("id") == "energyBar")
            drawBarChart(energyUses, "2011", "top");
        else
            drawBarChart(fossilPerc, "2011", "low");
        
        d3.select("button.bar.selected").classed("selected", false);
        d3.select(this).classed("selected", true);
    });
    
//    function drawChart(dataset, year){
//    
//        var data = top_10(dataset, "2011");
//
//        console.log(data);
//    
//        var dataToStack = [];
//
//        energyType.forEach(function(t){
//            var typeData = [];
//            datasetGlobal.forEach(function(d){
//                data.forEach(function(tt){
//                    if(tt["Country Code"] == d.id){
////                        console.log(d.id);
//                        var perc;
//                        d.data.forEach(function(v){
//                            if(v.year == "2011"){
//                                perc = v[t]*100;
//                            }
//                        });
//                        typeData.push({
//                            id: d.id,
//                            energyType: t,
//                            y: perc,
//                            x: d.country
//                        });
//                    }
//                });
//            });
//            dataToStack.push(typeData);
//        });
//
//        stack(dataToStack);
//
//        console.log("et",dataToStack);
//    
//        var types = svg.selectAll("g.energyTypes")
//            .data(dataToStack)
//            .enter()
//            .append("g")
//            .attr("class", "energyTypes")
//            .style("fill", function(d, i) {
//                console.log(color(d[0].energyType));
//                return color(d[0].energyType); });
//                
//        var domainMax = d3.max(data,function(d){
//            return +d[year];
//        });
//        
//        var colorScale = d3.scale.linear()
//				.domain(d3.extent(data, function(d){return +d[year];}))
//				.range(["#E9C4C8", "#a3314C"]);
//        
//        xScale.domain([0,domainMax*1.05]);
//        yScale.domain(data.map(function(d){return d["Country Name"];}));
//                
//        svg.select(".x.axis")
//            .transition()
//            .duration(500)
//            .call(xAxis);
//
//        svg.select(".y.axis")
//            .transition()
//            .duration(500)
//            .call(yAxis);
//        
//        console.log(types);
//        
//        var rects = types.selectAll("rect.bars_co2")
//            .data(function(d){
//                console.log(d);
//                return d;
//            });
//        
//        rects
//            .enter()
//            .append("rect")
//            .attr("id",function(d){
//                return d.id;
//            })
////            .attr("y", height)
//            .attr("class", "bars_co2");
////            .attr("fill", "steelblue")
////            .attr("width", 0);
//        
//        rects
//            .exit()
//            .attr("fill", "steelblue")
////            .transition()
////            .duration(500)
////            .attr("width", 0)
////            .attr("y", height)
//            .remove();
//        
//        rects
//            .transition()
//            .duration(500)
//            .attr("x", function(d){
//                return xScale(+d.y0);
//            })
//            .attr("y",function(d){
//                return yScale(d.x);
//            })
//            .attr("width", function(d){
//                return xScale(d.y);
//            })
//            .attr("height", yScale.rangeBand());
//        
//        
//
//        var mapWidth = 1000,
//            mapHeight = 550;
//
//        var projection = d3.geo.mercator()
//            .scale(150)
//            .translate([mapWidth/2-20, mapHeight/2+30]);
//
//        var path = d3.geo.path()
//            .projection(projection);
//
//        var svgMap = d3.select("#mapViz svg");
//        var gMap = d3.select("g.countries");
//
//        var zoom = d3.behavior.zoom()
//            .translate([0, 0])
//            .scale(1)
//            .scaleExtent([1, 8])
//            .on("zoom", function(d){
//                gMap.style("stroke-width", 1.5 / d3.event.scale + "px");
//                gMap.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
//            });
//        
//        rects
//            .on("mouseover",function(d){
//                var thisId = d3.select(this).attr("id");
//                highlight(thisId);
//
////                if (active.node() === d3.select("path#"+thisId).node()) return reset();
////                active.classed("active", false);
////                active = d3.select(this).classed("active", true);
//            
//                d3.select("path#"+thisId).moveToFront();
//                
//                if(d3.select("path#"+thisId).data()[0]){
//                    var bounds = path.bounds(d3.select("path#"+thisId).data()[0]),
//                      dx = bounds[1][0] - bounds[0][0],
//                      dy = bounds[1][1] - bounds[0][1],
//                      x = (bounds[0][0] + bounds[1][0]) / 2,
//                      y = (bounds[0][1] + bounds[1][1]) / 2,
//                      scale = .9 / Math.max(dx / mapWidth, dy / mapHeight);
//
//                    if(scale>6) scale=6;
//
//                    var translate = [mapWidth / 2 - scale * x, mapHeight / 2 - scale * y];
//
//                    svgMap.transition()
//                      .duration(750)
//                      .call(zoom.translate(translate).scale(scale).event);
//                }
//                
//
//            })
//            .on("mouseout",function(){
//                disHighlight(d3.select(this).attr("id"));
//                svgMap.transition()
//                  .duration(750)
//                  .call(zoom.translate([0, 0]).scale(1).event);
//            });
//            
//        var labels = svg.selectAll("text.value")
//            .data(data, function(d){
//                return d["Country Code"];
//            });
//
//        labels
//            .enter()
//            .append("text")
//            .attr("y", height)
//            .classed("value","true");
//
//        labels
//            .exit()
//            .remove();
//
//        labels
//            .transition()
//            .duration(500)
//            .text(function(d){return d3.format(".1f")(+d[year]);})
//            .attr("x",function(d){return xScale(+d[year]);})
//            .attr("y",function(d){return yScale(d["Country Name"]);})
//            .attr("dx",5)
//            .attr("dy",11);
//    }
    
    function drawBarChart(dataset, year, filter){
    
        if(filter == "top")
            var data = top_10(dataset, "2011");
        else
            var data = bottom_10(dataset, "2011");

        console.log(data);
                
        var domainMax = d3.max(data,function(d){
            return +d[year];
        });
        
        var colorScale = d3.scale.linear()
				.domain(d3.extent(data, function(d){return +d[year];}))
				.range(["#E9C4C8", "#a3314C"]);
        
        xScale.domain([0,domainMax*1.05]);
        yScale.domain(data.map(function(d){return d["Country Name"];}));
                
        svg.select(".x.axis")
            .transition()
            .duration(500)
            .call(xAxis);

        svg.select(".y.axis")
            .transition()
            .duration(500)
            .call(yAxis);
        
        var rects = svg.selectAll("rect.bars_co2")
            .data(data, function(d){
                return d["Country Code"];
            });
        
        rects
            .enter()
            .append("rect")
            .attr("id",function(d){
                return d["Country Code"];
            })
            .attr("y", height)
            .attr("class", "bars_co2")
            .attr("fill", "steelblue")
            .attr("width", 0);
        
        rects
            .exit()
            .attr("fill", "steelblue")
            .transition()
            .duration(500)
            .attr("width", 0)
            .attr("y", height)
            .remove();
        
        rects
            .transition()
            .duration(500)
            .attr("x",0)
            .attr("y",function(d){
                return yScale(d["Country Name"]);
            })
            .attr("width", function(d){
                return xScale(+d[year]);
            })
            .attr("height", yScale.rangeBand())
            .attr("fill", function(d){return colorScale(+d[year]);});
        
        

        var mapWidth = 800,
            mapHeight = 400;

        var projection = d3.geo.mercator()
            .scale(110)
            .translate([mapWidth/2-20, mapHeight/2+20]);

        var path = d3.geo.path()
            .projection(projection);

        var svgMap = d3.select("#mapViz svg");
        var gMap = d3.select("g.countries");

        var zoom = d3.behavior.zoom()
            .translate([0, 0])
            .scale(1)
            .scaleExtent([1, 8])
            .on("zoom", function(d){
                gMap.style("stroke-width", 1.5 / d3.event.scale + "px");
                gMap.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
            });
        
        rects
            .on("mouseover",function(d){
                var thisId = d3.select(this).attr("id");
                highlight(thisId);

//                if (active.node() === d3.select("path#"+thisId).node()) return reset();
//                active.classed("active", false);
//                active = d3.select(this).classed("active", true);
            
                d3.select("path#"+thisId).moveToFront();
                
                if(d3.select("path#"+thisId).data()[0]){
                    var bounds = path.bounds(d3.select("path#"+thisId).data()[0]),
                      dx = bounds[1][0] - bounds[0][0],
                      dy = bounds[1][1] - bounds[0][1],
                      x = (bounds[0][0] + bounds[1][0]) / 2,
                      y = (bounds[0][1] + bounds[1][1]) / 2,
                      scale = .9 / Math.max(dx / mapWidth, dy / mapHeight);

                    if(scale>6) scale=6;

                    var translate = [mapWidth / 2 - scale * x, mapHeight / 2 - scale * y];

                    svgMap.transition()
                      .duration(750)
                      .call(zoom.translate(translate).scale(scale).event);
                }
                

            })
            .on("mouseout",function(){
                disHighlight(d3.select(this).attr("id"));
                svgMap.transition()
                  .duration(750)
                  .call(zoom.translate([0, 0]).scale(1).event);
            });
            
        var labels = svg.selectAll("text.value")
            .data(data, function(d){
                return d["Country Code"];
            });

        labels
            .enter()
            .append("text")
            .attr("y", height)
            .classed("value","true");

        labels
            .exit()
            .remove();

        labels
            .transition()
            .duration(500)
            .text(function(d){return d3.format(".1f")(+d[year]);})
            .attr("x",function(d){return xScale(+d[year]);})
            .attr("y",function(d){return yScale(d["Country Name"]);})
            .attr("dx",5)
            .attr("dy",11);
    }
}