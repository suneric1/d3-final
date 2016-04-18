function barChartSection(emissions){
    
    var fullWidth = 600,
        fullHeight = 300,
        margin = {top:5, bottom:50, left:150, right:50},
        width = fullWidth - margin.left - margin.right,
        height = fullHeight - margin.top - margin.bottom;
            
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
        
    
    var data = top_10(emissions, "2011");
    
    console.log(data);
    
    drawBarChart(data, "2011");
    
    function top_10(emissions, year){
        return newEmissions = emissions.sort(function(a,b){
            return b[year] - a[year];
        }).slice(0,10);
    }
    
    function drawBarChart(data, year){
                
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
            .attr("class", "bars_co2")
            .attr("fill", "steelblue")
            .attr("width", 0);
        
        rects
            .exit()
            .transition()
            .duration(500)
            .attr("width", 0)
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
        
        rects
            .on("mouseover",function(){
            highlight(d3.select(this).attr("id"));
        })
            .on("mouseout",function(){
            disHighlight(d3.select(this).attr("id"));
        })
            
        var labels = svg.selectAll("text.value")
            .data(data, function(d){
                return d["Country Code"];
            });

        labels
            .enter()
            .append("text")
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