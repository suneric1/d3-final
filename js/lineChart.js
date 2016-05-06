function lineSection(energy, emissions){
    
    var fullHeight = 400;
    var fullWidth = 750;

    var margin = {top:20, bottom:50, left:70, right:100};

    var height = fullHeight - margin.top - margin.bottom;
    var width = fullWidth - margin.left - margin.right;

    var xScale = d3.time.scale().range([0,width]);
    var yScale = d3.scale.linear().range([height,0]);
    
    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient("top")
        .ticks(5)
        .tickPadding([-15])
        .tickSize([0]);
    
    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("left")
        .tickFormat(d3.format("s"))
        .ticks(5)
        .tickPadding([3])
        .tickSize([-width]);

    var line = d3.svg.line()
        .x(function(d){
            return xScale(parseDate(d.year));
        })
        .y(function(d){
            return yScale(+d.amount);
        });
    
    var svg = d3.select("#lineViz")
        .append("svg")
        .attr("width",fullWidth)
        .attr("height",fullHeight)
        .append("g")
        .attr("class","lineChart")
        .attr("width",width)
        .attr("height",height)
        .attr("transform","translate(" + margin.left + "," + margin.top + ")");
    
    var tooltipLine = d3.select("#tooltipLine");
    
    drawLineChart(energy);
                
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);
    
    function drawLineChart(energy){

        var years = d3.keys(energy[0]).filter(function(d){return d.startsWith("1") || d.startsWith("2");});
        years.splice(years.length-3,3);
        years.splice(0,11);
        console.log(energy);
        
        energy.sort(function(a,b){
            return d3.ascending(+a[2012],+b[2012]);
        });

        var energyUses = [];
        
        energy.forEach(function(d,i){
            var uses = [];
            years.forEach(function(y){
                if(d[y]){
                    uses.push({
                        country: d["Country Code"],
                        year: y,
                        amount: +d[y]
                    });
                }
            });

            if(uses.length > 0){
                energyUses.push({
                    id: d["Country Code"],
                    uses: uses
                });
            }
        });

        console.log(energyUses);

        xScale.domain(d3.extent(years, function(d){
            return parseDate(d);
        }));
        
        console.log(xScale.domain());
        
        energyMax = d3.max(energyUses, function(d){
            return d3.max(d.uses, function(u){
                return +u.amount;
            });
        });

        yScale.domain([0, energyMax]);

        svg.selectAll("path")
            .data(energyUses)
            .enter()
            .append("g")
            .attr("class", "line")
            .classed("outlier",function(d,i){
                if(d.id == "ISL" || d.id == "QAT" || d.id == "CHN" || d.id == "USA")
                    return true;
            })
            .append("path")
            .attr("id",function(d){
                return d.id;
            })
            .classed("line",true)
            .attr("d",function(d){
                return line(d.uses);
            })
            .on("mouseover",mouseover)
            .on("mouseout",mouseout);;
        
        d3.selectAll("g.line.outlier")
            .selectAll("circle")
            .data(function(d){return d.uses;})
            .enter()
            .append("circle")
            .attr("class", "dotVal")
            .attr("cx",function(d){return xScale(parseDate(d.year));})
            .attr("cy",function(d){return yScale(+d.amount);})
            .attr("r",1)
            .on("mouseover",mouseovercircle)
            .on("mouseout",mouseoutcircle);
        
        d3.selectAll(".lineChart g.line")
            .datum(function(d){
                var lastVal;
                d.uses.forEach(function(u){
                    if(u.year <= years[years.length - 1]){
                        lastVal = u;
                    }
                })
                return lastVal;
            })
            .append("text")
            .attr("x", width)
            .attr("y", function(d){
                return yScale(+d.amount);
            })
            .text(function(d){
                return countryById.get(d.country)["Country Name"];
            })
            .attr("id", function(d){
                return d.country;
            })
            .attr("class", "label")
            .style("text-anchor","start")
            .style("opacity",0)
            .attr("dx",6)
            .attr("dy",4);
        
        d3.selectAll(".lineChart .outlier text.label")
            .style("opacity",1);
            
    }

    function mouseover(d){
        
        highlight(d.id);
        
        d3.select("#"+d.id+".label").style("opacity", 1);

    } // end mouseover
    
    function mouseout(d){
        disHighlight(d.id);
        
        d3.select("#"+d.id+".label").style("opacity", 0);
        
        d3.selectAll(".lineChart .outlier text.label")
            .style("opacity",1);
    }

    function mouseovercircle(d){

        d3.select(this).transition().duration(100).attr("r",3);

        highlight(d.country);

        tooltipLine.transition().duration(100)
            .style("opacity", 0.9);

        tooltipLine
            .style("top", (d3.event.pageY - 10) + "px" )
            .style("left", (d3.event.pageX + 10) + "px");
        
        tooltipLine.select(".name").text(countryById.get(d.country)['Country Name'] + ", " + d.year);
        tooltipLine.select(".val").text(d3.format(",")(d3.round(+d.amount)));

    } // end mouseover
    
    function mouseoutcircle(d){

        d3.select(this).transition().duration(100).attr("r",1);

        disHighlight(d.country);
        
        tooltipLine.transition().duration(300)
        .style("opacity", 0);
    }
}