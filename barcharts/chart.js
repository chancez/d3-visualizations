function BarChart() {

  // defaults
  var settings = {
    width: 680,
    height: 480,
    bar_padding: 5,
    bar_color: "#1E90FF",
    opacity: ".95",
    x_label: "x-axis",
    y_label: "y-axis",
    x_axis_pad: 20,
    y_axis_pad: 38,
    x_label_pad: 15,
    y_label_pad: 20
  };

  chart.settings = function (attr, value) {
    if (value) {
      settings[attr] = value;
    } else {
      return settings[attr];
    }
    return chart;
  };


  function chart(selection) {
    selection.each(function (data) {
      // select our svg and load the data.
      var svg = d3.select(this)
        .selectAll("svg")
        .data([data]);

      var enter = svg.enter().append("svg");

      // set up the chart size
      svg.attr("width", settings.width)
        .attr("height", settings.height);

      // account for bar bar_padding
      var space_avail = settings.width;
      var bar_width = space_avail/data.length - settings.bar_padding;

      var x_pad = settings.x_axis_pad + settings.x_label_pad,
          y_pad = settings.y_axis_pad + settings.y_label_pad;

      // scaling
      var xscale = d3.scale.linear()
        .domain([0, data.length])
        .range([y_pad, space_avail-y_pad]);

      var yscale = d3.scale.linear()
        .domain([0, d3.max(data)])
        .range([x_pad, settings.height-x_pad]);

      var bars = svg.append("g")
        .attr("class", "bars")
        .selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("fill", settings.bar_color)
        .attr("opacity", settings.opacity)
        .attr("width", bar_width)
        .attr("height", function(d) {
          return yscale(d);
        })
        .attr("x", function (d, i) {
          return xscale(i);
        })
        .attr("y", function(d) {
          return settings.height - x_pad - yscale(d);
        });

      var _xaxis = d3.svg.axis()
        .scale(xscale)
        .orient("bottom");

      var _yaxis = d3.svg.axis()
        .scale(yscale.copy().domain([d3.max(data), 0]))
        .orient("left");

      var xaxis = svg.append("g").attr("class", "axis").call(_xaxis);
      var yaxis = svg.append("g").attr("class", "axis").call(_yaxis);

      xaxis.attr("transform", "translate(0," + (settings.height - x_pad) + ")");

      yaxis.attr("transform", "translate(" + y_pad + ")",0 );

      xaxis.append("text")
        .text(settings.x_label)
        .attr("x", space_avail/2)
        .attr("y", x_pad);

      yaxis.append("text")
        .text(settings.y_label)
        .attr("x", -1*settings.height/2)
        .attr("y", -1*x_pad-10)
        .attr("transform", "rotate(270)");

      bars.on("mouseover", function(d, i) {
        settings.mouseover.call(this, d, i);
      });
      bars.on("mouseout", function(d, i) {
        settings.mouseout.call(this, d, i);
      });
      bars.on("click", function(d, i) {
        settings.click.call(this, d, i);
      });

    });
  }

  return chart;
}