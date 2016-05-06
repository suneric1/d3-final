function connectedScatter(energy, emissions){
    var fullWidth = 750,
        fullHeight = 400,
        margin = {top:20, bottom:50, left:70, right:50},
        width = fullWidth - margin.left - margin.right,
        height = fullHeight - margin.top - margin.bottom;
            
    var xScale = d3.scale.linear().range([0,width]);
    var yScale = d3.scale.linear().range([height,0]);
    
    var tooltipScatter = d3.select("#tooltipScatter");
    
    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient("top")
        .ticks(5)
        .tickPadding([-height-15])
        .tickSize([height]);

    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("right")
        .ticks(6)
        .tickPadding([-width-15])
        .tickSize([width]);
    
    var svg = d3.select("#connectedViz")
        .append("svg")
        .attr("width",fullWidth)
        .attr("height",fullHeight)
        .append("g")
        .attr("class","connectedScatter")
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
    
//    svg.select("g.y.axis")
//        .append("line")
//        .attr("x1", width)
//        .attr("y1", 0)
//        .attr("x2", width)
//        .attr("y2", height);
        
    xScale.domain([0, energyMax]);

    yScale.domain([0, emissionMax]);

    console.log(xScale.domain(), yScale.domain());

    svg.select(".connectedScatter .x.axis")
        .transition()
        .duration(500)
        .call(xAxis);

    svg.select(".connectedScatter .y.axis")
        .transition()
        .duration(500)
        .call(yAxis)
        .selectAll("text")
        .style("text-anchor","end");
    
    drawScatterPlot("QAT");
    
    drawScatterPlot("CHN");
    
    drawScatterPlot("USA");
    
    drawScatterPlot("ISL");
    
    d3.select(".connectedScatter g#ISL").classed("current",true);
    
    function drawScatterPlot(countryId){
        
        var years = d3.keys(energy[0]).filter(function(d){return d.startsWith("1") || d.startsWith("2");});
        
        var dataset = datasetGlobal.filter(function(d){return d.id == countryId;})[0].data;
        
//        energy.forEach(function(d){
//            emissions.forEach(function(e){
//                if(d["Country Code"] == e["Country Code"] && e["Country Code"] == countryId ){
//                    years.forEach(function(y){
//                        if(d[y] && e[y]){
//                            dataset.push({
//                                country: d["Country Name"], 
//                                id: d["Country Code"], 
//                                energyUse: +d[y], 
//                                emissions: +e[y], 
//                                year: y
//                            });
//                        }
//                    })
//                }
//            });
//        });
//        
//        console.log(dataset);
        
        var g = svg.append("g")
                    .attr("id", countryId);
        
        g.selectAll("line.newConnect")
            .data(dataset)
            .enter()
            .append("line")
            .attr("id", function(d){return d.id;})
            .attr("class", "connect")
            .attr("x1", function(d,i){return xScale(d.energyUse);})
            .attr("y1", function(d,i){return yScale(d.emissions);})
            .attr("x2", function(d,i){if(dataset[i+1]) return xScale(dataset[i+1].energyUse);})
            .attr("y2", function(d,i){if(dataset[i+1]) return yScale(dataset[i+1].emissions);})
            .attr("stroke-width", function(d,i){return i*0.4;})
            .attr("stroke-linecap", "round");
        
        g.selectAll("newCircle")
            .data(dataset)
            .enter()
            .append("circle")
            .attr("id", function(d){return d.id;})
            .attr("cx", function(d){return xScale(d.energyUse);})
            .attr("cy", function(d){return yScale(d.emissions);})
            .attr("r", function(d,i){return i*0.2;})
            .on("mouseover", mouseover)
            .on("mouseout", mouseout);
        
        d3.selectAll("line#" + countryId + ".connect")[0][dataset.length-1].remove();
        
        g.datum(dataset[dataset.length - 1])
            .append("text")
            .attr("class", "label")
            .attr("x", function(d){return xScale(d.energyUse);})
            .attr("y", function(d){return yScale(d.emissions);})
            .text(function(d){
                return d.country;
            })
            .attr("class", "label")
            .style("text-anchor","start")
            .attr("dx",15)
            .attr("dy",-6);
            
            
        function mouseover(d){
//            d3.select(this).moveToFront();
            
            d3.select(this).classed("selected", true);

            tooltipScatter.transition().duration(100)
            .style("opacity", 0.9);

            tooltipScatter
            .style("top", (d3.event.pageY - 10) + "px" )
            .style("left", (d3.event.pageX + 10) + "px");
            
            tooltipScatter.select(".name").text(d.country + ", " + d.year);
            tooltipScatter.select(".val.ene").text(d3.format(",")(d3.round(d.energyUse)));
            tooltipScatter.select(".val.co2").text(d3.format(",")(d3.round(d.emissions)));
        }
            
        function mouseout(d){
            tooltipScatter.transition().duration(100)
                .style("opacity", 0);
            
            d3.select(this).classed("selected", false);
        }
    }
}