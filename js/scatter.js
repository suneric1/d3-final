function scatterSection(energy, emissions){
    var fullWidth = 600,
        fullHeight = 300,
        margin = {top:20, bottom:50, left:150, right:50},
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
    
    var svg = d3.select("#scatterViz")
        .append("svg")
        .attr("width",fullWidth)
        .attr("height",fullHeight)
        .append("g")
        .attr("class","scatterPlot")
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
    
    drawScatterPlot(energy, emissions, "2011");
    
    function drawScatterPlot(energy, emissions,year){
        
        xScale.domain(d3.extent(energy, function(d){
            return +d[year];
        }));
        
        yScale.domain(d3.extent(emissions, function(d){
            return +d[year];
        }));
                
        svg.select(".scatterPlot .x.axis")
            .transition()
            .duration(500)
            .call(xAxis);

        svg.select(".scatterPlot .y.axis")
            .transition()
            .duration(500)
            .call(yAxis)
            .selectAll("text")
            .style("text-anchor","end");
        
        var dataset = [];
        
        energy.forEach(function(d){
            emissions.forEach(function(e){
                if(d["Country Code"] == e["Country Code"] && d[year] && e[year]){
                    dataset.push({country: d["Country Name"], id: d["Country Code"], energyUse: +d[year], emissions: +e[year], year: year});
                }
            });
        });
        
        console.log(dataset);
        
        svg.selectAll("circle")
            .data(dataset, function(d){
                return d.id;
            })
            .enter()
            .append("circle")
            .attr("id", function(d){return d.id;})
            .attr("cx", function(d){return xScale(d.energyUse);})
            .attr("cy", function(d){return yScale(d.emissions);})
            .attr("r", 4)
            .on("mouseover", mouseover)
            .on("mouseout", mouseout);
            
        function mouseover(d){
            d3.select(this).moveToFront();
            
            var thisId = d3.select(this).attr("id");
            highlight(thisId);
            
            d3.select(this).transition().duration(100).attr("r", 6);

            tooltipScatter.transition().duration(100)
            .style("opacity", 0.9);

            tooltipScatter
            .style("top", (d3.event.pageY - 10) + "px" )
            .style("left", (d3.event.pageX + 10) + "px");
            
            tooltipScatter.select(".name").text(d.country);
            tooltipScatter.select(".val.ene").text(d3.format(",")(d3.round(d.energyUse)));
            tooltipScatter.select(".val.co2").text(d3.format(",")(d3.round(d.emissions)));
        }
            
        function mouseout(d){
            var thisId = d3.select(this).attr("id");
            disHighlight(thisId);
            
            tooltipScatter.transition().duration(100)
                .style("opacity", 0);
            
            d3.select(this).transition().duration(100).attr("r", 4);
        }
    }
}