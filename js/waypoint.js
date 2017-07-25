(function() {

  var mapViz = d3.select("#mapViz");
  var scatterViz = d3.select("#scatterViz");
  var lineViz = d3.select("#lineViz");
  var connectedViz = d3.select("#connectedViz");
  var allViz = d3.selectAll(".vizDiv");

  var waypoint = new Waypoint({
    element: document.getElementById('para-1'),
    handler: function(direction) {
      console.log('Direction: ' + direction);
      if (direction == 'down') {
        showSection(1);
      }
    },
    offset: 200
  });

  var waypoint = new Waypoint({
    element: document.getElementById('para-2'),
    handler: function(direction) {
      console.log('Direction: ' + direction)
      if (direction == 'down') {
        showSection(2);
      } else {
        showSection(1);
      }
    },
    offset: 200
  });

  var waypoint = new Waypoint({
    element: document.getElementById('para-3'),
    handler: function(direction) {
      console.log('Direction: ' + direction)
      if (direction == 'down') {
        showSection(3);
      } else {
        showSection(2);
      }
    },
    offset: 200
  });

  var waypoint = new Waypoint({
    element: document.getElementById('para-4'),
    handler: function(direction) {
      console.log('Direction: ' + direction)
      if (direction == 'down') {
        showSection(4);
      } else {
        showSection(3);
      }
    },
    offset: 200
  });

  var waypoint = new Waypoint({
    element: document.getElementById('para-5'),
    handler: function(direction) {
      console.log('Direction: ' + direction)
      if (direction == 'down') {
        showSection(5);
      } else {
        showSection(4);
      }
    },
    offset: 200
  });

  var waypoint = new Waypoint({
    element: document.getElementById('para-6'),
    handler: function(direction) {
      console.log('Direction: ' + direction)
      if (direction == 'down') {
        showSection(6);
      } else {
        showSection(5);
      }
    },
    offset: 200
  });

  var showSection = function(value) {

    switch (value) {
      case 1:
        console.log("in case", value);
        allViz.transition().duration(700).style("opacity", 0).style("display", "none");

        d3.selectAll('.active').classed('active', false);
        d3.select('#para-1').classed('active', true);
        break;

      case 2:
        console.log("in case", value);
        allViz.transition().duration(700).style("opacity", 0).style("display", "none");
        mapViz.transition().duration(700).style("opacity", 1).style("display", "inline-block");

        d3.selectAll('.active').classed('active', false);
        d3.select('#para-2').classed('active', true);
        break;

      case 3:
        console.log("in case", value);
        allViz.transition().duration(700).style("opacity", 0).style("display", "none");
        mapViz.transition().duration(700).style("opacity", 1).style("display", "inline-block");

        d3.selectAll('.active').classed('active', false);
        d3.select('#para-3').classed('active', true);
        break;

      case 4:
        console.log("in case", value);
        allViz.transition().duration(700).style("opacity", 0).style("display", "none");
        scatterViz.transition().duration(700).style("opacity", 1).style("display", "inline-block");

        d3.selectAll('.active').classed('active', false);
        d3.select('#para-4').classed('active', true);
        break;

      case 5:
        console.log("in case", value);
        allViz.transition().duration(700).style("opacity", 0).style("display", "none");
        lineViz.transition().duration(700).style("opacity", 1).style("display", "inline-block");

        d3.selectAll('.active').classed('active', false);
        d3.select('#para-5').classed('active', true);
        break;

      case 6:
        console.log("in case", value);
        allViz.transition().duration(700).style("opacity", 0).style("display", "none");
        connectedViz.transition().duration(700).style("opacity", 1).style("display", "inline-block");

        d3.selectAll('.active').classed('active', false);
        d3.select('#para-6').classed('active', true);
        break;

      default:
        allViz.transition().duration(700).style("opacity", 0).style("display", "none");

        d3.selectAll('.active').classed('active', false);
        d3.select('#para-1').classed('active', true);
        break;
    }
  }
})();
