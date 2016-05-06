function mapSection(world, energy){

    var width = 800,
        height = 400,
        center = [width / 2, height / 2];

    var colorScale = d3.scale.linear().range(["#faf5f5", "#a3314C"]).interpolate(d3.interpolateLab);

    var projection = d3.geo.mercator()
        .scale(110)
        .translate([width/2-20, height/2+20]);

    var path = d3.geo.path()
        .projection(projection);

    var zoom = d3.behavior.zoom()
        .scaleExtent([1, 8])
        .on("zoom", move);

    var svg = d3.select("#mapViz").append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .call(zoom);

    svg.on("wheel.zoom", null);
    svg.on("mousewheel.zoom", null);

    svg.append("rect")
        .attr("class", "overlay")
        .attr("width", width)
        .attr("height", height);

    var g = svg.append("g");
    
    colorScale.domain([0,20000]);
    
    g.append("g")
        .attr("class", "countries")
        .selectAll("path")
        .data(topojson.feature(world, world.objects.units).features)
        .enter()
        .append("path")
        .attr("d", function(d){
            if(d.id != "ATA")
                return path(d);
        })
        .attr("id", function(d){
            if(d.id != "ATA")
                return d.id;
        })
        .on("mouseover", mouseover)
        .on("mouseout", function() {
          d3.select(this).classed("selected", false);
            disHighlight(d3.select(this).attr("id"));
          tooltip.transition().duration(300)
            .style("opacity", 0);
        });

    updateFill();

    make_buttons(); // create the zoom buttons

    var legend = d3.legend.color()
      .shapeWidth(15)
        .shapePadding(0)
        .labelFormat(d3.format("s"))
      .orient("vertical")
      .scale(colorScale);

    svg.append("g")
      .attr("class", "legend")
      .attr("transform", "translate(20," + (height-150) +")")
      .call(legend);
    
    d3.selectAll(".cell").classed(".cell",false).attr("transform",function(d,i){
        return "translate(0," + i*15 + ")";
    })
    .select("text.label")
    .attr("transform", "translate(20,12)");
    
    //tooltipChart 
    var ttfh = 120;
    var ttfw = 200;

    var margin = {top:30, bottom:30, left:20, right:35};

    var tth = ttfh - margin.top - margin.bottom;
    var ttw = ttfw - margin.left - margin.right;

    var xScale = d3.time.scale().range([0,ttw]);
    var yScale = d3.scale.linear().range([tth,0]);
    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("left")
        .tickFormat(d3.format("s"))
        .ticks(3)
        .tickPadding([3])
        .tickSize([0]);

    var line = d3.svg.line()
        .x(function(d){
            return xScale(parseDate(d.year));
        })
        .y(function(d){
            return yScale(+d.amount);
        });

    var area = d3.svg.area()
        .x(function(d){
            return xScale(parseDate(d.year));
        })
        .y0(tth)
        .y1(function(d){
            return yScale(+d.amount);
        });
    
    drawTooltip(energy);

    function updateFill() {
      svg.selectAll(".countries path")
        .attr("fill", function(d) {
          if(countryById.get(d.id) && countryById.get(d.id)["2012"])
            return colorScale(countryById.get(d.id)["2012"]);
          else
            return "#ddd";
      });
    }

    function make_buttons() {
        // Zoom buttons actually manually constructed, not images
      svg.selectAll(".scalebutton")
          .data(['zoom_in', 'zoom_out'])
        .enter()
          .append("g")
            .attr("id", function(d){return d;})  // id is the zoom_in and zoom_out
            .attr("class", "scalebutton")
            .attr({x: 20, width: 20, height: 20})
          .append("rect")
              .attr("y", function(d,i) { return 20 + 25*i })
              .attr({x: 20, width: 20, height: 20})
      // Plus button
      svg.select("#zoom_in")
        .append("line")
          .attr({x1: 25, y1: 30, x2: 35, y2: 30 })
          .attr("stroke", "#fff")
          .attr("stroke-width", "2px");
      svg.select("#zoom_in")
        .append("line")
          .attr({x1: 30, y1: 25, x2: 30, y2: 35 })
          .attr("stroke", "#fff")
          .attr("stroke-width", "2px");
      // Minus button
      svg.select("#zoom_out")
        .append("line")
          .attr({x1: 25, y1: 55, x2: 35, y2: 55 })
          .attr("stroke", "#fff")
          .attr("stroke-width", "2px");


      svg.selectAll(".scalebutton")
        .on("click", function() {
          d3.event.preventDefault();

          var scale = zoom.scale(),
              extent = zoom.scaleExtent(),
              translate = zoom.translate(),
              x = translate[0], y = translate[1],
              factor = (this.id === 'zoom_in') ? 2 : 1/2,
              target_scale = scale * factor;

          var clamped_target_scale = Math.max(extent[0], Math.min(extent[1], target_scale));
            if (clamped_target_scale != target_scale){
                target_scale = clamped_target_scale;
                factor = target_scale / scale;
            }

            // Center each vector, stretch, then put back
            x = (x - center[0]) * factor + center[0];
            y = (y - center[1]) * factor + center[1];

            // Transition to the new view over 350ms
            d3.transition().duration(350).tween("zoom", function () {
                var interpolate_scale = d3.interpolate(scale, target_scale),
                    interpolate_trans = d3.interpolate(translate, [x,y]);
                return function (t) {
                    zoom.scale(interpolate_scale(t))
                        .translate(interpolate_trans(t));
                    svg.call(zoom.event);
                };
            });
        });
    }

    function zoomIn() {
        zoom.scale(zoom.scale()*2);
        move();
    }

    function move() {
      var t = d3.event.translate,
          s = d3.event.scale;
      t[0] = Math.min(width * (s - 1), Math.max(width * (1 - s), t[0]));
      t[1] = Math.min(height * (s - 1), Math.max(height * (1 - s), t[1]));
      zoom.translate(t);
      g.style("stroke-width", 1 / s).attr("transform", "translate(" + t + ")scale(" + s + ")");
    }
    
    function drawTooltip(energy){

        var tooltipChart = tooltip
            .append("svg")
            .attr("class","tooltipChart")
            .attr("width",ttfw)
            .attr("height",ttfh)
            .append("g")
            .attr("transform","translate(" + margin.left + "," + margin.top + ")");

        var years = d3.keys(energy[0]).filter(function(d){return d.startsWith("1") || d.startsWith("2");});
        years.splice(years.length-3,3);
        console.log(years);

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

            energyUses[d["Country Code"]] = uses;
        });

        console.log(energyUses);

        xScale.domain(d3.extent(years, function(d){
            return parseDate(d);
        }));

        yScale.domain([0, d3.max(energyUses.BEL, function(d){
            return +d.amount;
        })]);

        tooltipChart
            .datum(energyUses.BEL)
            .append("path")
            .attr("class","area")
            .attr("d",area);

        tooltipChart
            .append("path")
            .attr("class","line")
            .attr("d",line);

        tooltipChart.append("text")
          .attr("x", 0)
          .attr("y", tth + margin.bottom/2)
            .attr("class", "static_year")
          .style("text-anchor", "start")
          .text(function(d) { return outputDate(parseDate(d[0].year)); });

        tooltipChart.append("text")
          .attr("x", ttw)
          .attr("y", tth + margin.bottom/2)
            .attr("class", "static_year")
          .style("text-anchor", "end")
          .text(function(d) { return outputDate(parseDate(d[d.length - 1].year));});

        tooltipChart.append("g")
            .call(yAxis)
            .attr("class","y axis")
            .selectAll("text")
            .style("text-anchor","end");
    }

    function mouseover(d){

//      d3.select(this).classed("selected", true);
        d3.select(this).moveToFront();
        var thisId = d3.select(this).attr("id");

        highlight(thisId);

        tooltip.transition().duration(100)
        .style("opacity", 0.9);

        tooltip
        .style("top", (d3.event.pageY - 10) + "px" )
        .style("left", (d3.event.pageX + 10) + "px");

        if (countryById.get(d.id) && countryById.get(d.id)["2012"]) {
         tooltip.select(".name").text(countryById.get(d.id)['Country Name']);
         tooltip.select(".val").text(d3.format(",")(d3.round(countryById.get(d.id)["2012"])));
        } else {
        tooltip.select(".name").text("No data for " + d.properties.name);
        tooltip.select(".val").text("NA");
        }

        yScale.domain([0, d3.max(energyUses[d.id], function(u){
            return +u.amount;
        })]);

        d3.select(".area")
            .datum(energyUses[d.id])
            .attr("d",area);

        d3.select(".tooltipChart .line")
            .datum(energyUses[d.id])
            .attr("d",line);

        d3.select(".tooltipChart .y.axis")
            .call(yAxis);

    } // end mouseover
}