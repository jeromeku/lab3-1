// encapsulate in a function/object to keep global namespace clean
(function() {
  var changeScale, colorScale, data, isLinearScale, maxValues, scaleX, scaleY, svg, swapX, textField, updateData, visBB, xAxis, xIsSwapped, yAxis;

  svg = d3.select("#visScales").append("svg");
  svg.attr({
    width: 600,
    height: 400
  });

  /* visualization Bounding Box*/
  visBB = {
    x1: 10 + 80,
    x2: 590,
    y1: 190,
    y2: 10
  };

  maxValues = {
    x: 100,
    y: 10000
  };

  /* create a textfield to display data value*/
  textField = d3.select("body").append("div").text("value");

  // and some buttons
  d3.select("body").append("button").text("shuffle").on({
    "click": function() {
      return updateData();
    }
  });

  d3.select("body").append("button").text("change scale").on({
    "click": function() {
      return changeScale();
    }
  });

  d3.select("body").append("button").text("swap").on({
    "click": function() {
      return swapX();
    }
  });

  data = [];
  isLinearScale = true;
  xIsSwapped = false;

  /* create linear scaling for x and y values*/
  scaleY = d3.scale.linear().domain([0, maxValues.y]).range([visBB.y1, visBB.y2]);
  scaleX = d3.scale.linear().domain([0, maxValues.x]).range([visBB.x1, visBB.x2]);

  /* create axis functions and bin the scales to them*/
  xAxis = d3.svg.axis().scale(scaleX).tickSize(10);
  yAxis = d3.svg.axis().scale(scaleY).tickSize(-(visBB.x2 - visBB.x1 + 100)).orient("left").tickSubdivide(true).ticks(5);

  /* create a scale for color interpolation*/
  colorScale = d3.scale.linear().domain([0, maxValues.y]).range(["blue", "red"]);

  /* update Data on start and on "shuffle"*/
  updateData = function() {
    var dp, i;
    data = [];

    /* create a random sized, random-valued list*/
    for (i = 0; i<= Math.random() * 50 + 50; ++i) {
      data[i] = {
        pos: i,
        value: Math.random(i) * 9999 + 1
      };
    }

    /* do the D3 thing -- select a set of datapoint nodes
     dp contains only the "updating" elements
    */
    dp = svg.selectAll(".datapoint").data(data);

    /* dp.enter() contains all new,unbound nodes. A circle element
     is added which gets some attributes assigned
    */
    dp.enter().append("circle").attr({
      "class": "datapoint",
      "cx": function(d) {
        return scaleX(0);
      },
      "cy": function(d) {
        return scaleY(d.value);
      }
    }).on({
      "mouseover": function(d, i) {
        return textField.text(d.value);
      },
      "mouseout": function(d, i) {
        return textField.text("---");
      }
    });

    /* !!! at this point dp contains all updated elements, all new elements, and
    all elements that should dissapear

    .. remove the nodes that should dissapear
    */
    dp.exit().remove();
    /* dp contains now exactly the set of .datapoint that are bound to data*/

    /* a transition is applied to move them smoothly from their old position
    to their new position. The color scale is used to double encode the data value (y-value)
    */
    return dp.transition().attr({
      "r": 5,
      "cx": function(d) {
        return scaleX(d.pos);
      },
      "cy": function(d) {
        return scaleY(d.value);
      }
    }).style({
      "fill": function(d) {
        return colorScale(d.value);
      }
    });
  };

  /* on changeScale the linear scale is transformed into a logarithmic scale
  and vice versa
  */
  changeScale = function() {
    var dp;
    if (isLinearScale) {
      scaleY = d3.scale.log().domain([1, maxValues.y]).range([visBB.y1, visBB.y2]);
      isLinearScale = false;
    } else {
      scaleY = d3.scale.linear().domain([1, maxValues.y]).range([visBB.y1, visBB.y2]);
      isLinearScale = true;
    }
    dp = svg.selectAll(".datapoint").transition().attr({
      "cy": function(d) {
        return scaleY(d.value);
      }
    });
    yAxis.scale(scaleY);
    return svg.select(".y.axis").transition().call(yAxis);
  };

  /* function to swap the x-Axis*/
  swapX = function() {
    if (xIsSwapped) {
      scaleX = d3.scale.linear().domain([0, maxValues.x]).range([visBB.x1, visBB.x2]);
      xIsSwapped = false;
    } else {
      scaleX = d3.scale.linear().domain([0, maxValues.x]).range([visBB.x2, visBB.x1]);
      xIsSwapped = true;
    }

    /* to have a stagged animation each .datapoint should have a different animation
    delay -- here we use the i (index) parameter to apply to each element an own
    delay value
    */
    svg.selectAll(".datapoint").transition().ease("linear").duration(500).delay(function(d, i) {
      return i * 5;
    }).attr({
      "cx": function(d) {
        return scaleX(d.pos);
      }
    });
    xAxis.scale(scaleX);
    return svg.select(".x.axis").transition().duration(1000).call(xAxis);
  };

  updateData();
  svg.append("g").attr("class", "x axis").attr("transform", "translate(0,220)").call(xAxis);
  svg.append("g").attr("class", "y axis").attr("transform", "translate(80,0)").call(yAxis);

}).call(this);

