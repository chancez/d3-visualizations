function ScatterChart() {
  // var chart = LineChart();
  // this.settings = chart.call()
  var chart = new LineChart().settings("dots", true).settings("lines", false);
  this.settings = chart.settings;
  return chart;
}

function LineChart() {
  // defaults
  var settings = {
    x_label: "x-axis",
    y_label: "y-axis",
    margin_top: 20,
    margin_right: 20,
    margin_bottom: 30,
    margin_left: 50,
    width: 680,
    height: 480,
    dots: false,
    lines: true
  };

  var avail_width = settings.width - settings.margin_left - settings.margin_right,
      avail_height = settings.height - settings.margin_top - settings.margin_bottom;

  chart.settings = function (attr, value) {
    if (value) {
      settings[attr] = value;
    } else {
      return settings[attr];
    }
    return chart;
  };

  var x = d3.scale.linear()
      .range([0, avail_width]);

  var y = d3.scale.linear()
      .range([avail_height, 0]);

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left");

  var line = d3.svg.line()
      .x(function(d) {return x(d.x); })
      .y(function(d) { return y(d.y); });

  function chart (selection, data) {

    var svg = d3.select(selection).append("svg")
      .attr("width", settings.width)
      .attr("height", settings.height)
      .append("g")
      .attr("transform", "translate(" + settings.margin_left + "," + settings.margin_top + ")");

    // provide easier to reference keys
    data.forEach(function(d) {
      d.x = d[0];
      d.y = d[1];
    });

    x.domain(d3.extent(data, function(d) { return d.x; }));
    y.domain(d3.extent(data, function(d) { return d.y; }));

    // add x axis
    var xaxis = svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + avail_height + ")")
    .call(xAxis)
    .append("text")
    .attr("x", avail_width/2)
    .attr("y", 30)
    .text(settings.x_label);

    // add y axis
    var yaxis = svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text(settings.y_label);

    //finally add the data and draw the path
    var path = svg.append("path");
    if (settings.lines) {
      path.datum(data)
        .attr("class", "line")
        .attr("d", line);
    }

    // draw dots.
    var dots = svg.selectAll(".dot");
    if (settings.dots) {
      dots.data(data)
        .enter().append("circle")
        .attr("class", "dot")
        .attr("r", 3.5)
        .attr("cx", function(d) { return x(d.x); })
        .attr("cy", function(d) { return y(d.y); });
    }

  }

  return chart;
}