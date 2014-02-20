CS171 - lab 3 - scales, axis, transitions
====


## Introduction

Coffeescript is introduced as a meta-language that compiles to JavaScript and adds syntactical sugar. See [link](http://coffeescript.org) for further details. Installing coffeescript is not essential for this lab, it is an additional information for advanced JavaScript programmers.

In the repository the files for the coffescript version are:

* xyz.coffe (**  always refer to this file for commented code !!! **)
* xyz.js
* xyz.map

the more readable JavaScript file is named:

* xyzClean.js



## Scales & Axis

#### scales (.html | .coffe | .js)

The file `scales.html` contains some style information, adds a `div` element with id "visScales" and a very basic script is included that outputs values for a linear and a logarithmic scale. 

The scales are defined in the example as linear mapping from (0 to the maximum `x`) on the x coordinates of the visualization bounding box (visBB):

	scaleX = d3.scale.linear().domain([0, maxValues.x]).range([visBB.x1, visBB.x2]);

This scales definition is used to define an `axis` function, that will later be called to draw an axis:

	xAxis = d3.svg.axis().scale(scaleX).tickSize(10);

The axis is drawn at the very end of the javascript/coffescript. A group node `<g>` is added to the SVG node and the former defined `xAxis` function is called to add several elements to the group node. (Give a look to the DOM inspector !!):

	svg.append("g").attr("class", "x axis").attr("transform", translate(0,220)").call(xAxis);

Scales can also be applied to colors (interpolation between colors):

	colorScale = d3.scale.linear().domain([0, maxValues.y]).range(["blue", "red"]);

#### simpsons (.html | .coffe | .js)

The file `simpsons.html` is a slightly modified copy of `scales.html`. 
In the related JS file you we define an ordinal scale for the members of the Simpson family:

`ordinalScale = d3.scale.ordinal().domain(names).rangeBands([10,500])`

For a clever use of `rangeBands` and and `rangePoints` see this very good [description](http://www.jeromecukier.net/blog/2011/08/11/d3-scales-and-color/) where this picture is taken from:

![COPIED FROM jeromecukier.net ](http://i1.wp.com/www.jeromecukier.net/wp-content/uploads/2011/08/d3ordinalRange.png)




## Transitions

#### scales (.html | .coffe | .js)

Transitions can be easily applied in D3 by the `transition()` function. All animation parameters
are set to a default value that defines a good interpolation, easing, etc.:

	dp.transition().attr({ // <- HERE !!!!
      "r": 5,
      ....
          });


The main consideration is  around how to arrange the adding,
removing, and updating of elements when data changes. A good general 
strategy was given in the lecture to D3:

1.  Select all elements of your data representation class (`.datapoint`). The return value (`dp`) now contains
	all elements/nodes that will remain in the visualization (because they are bound to data)

		dp = svg.selectAll(".datapoint").data(data);

2. then add all new appearing elements (which appear due to new data). The function `dp.enter()` gives you exactly these elements:

		 dp.enter().append("circle").attr({
	     "class": "datapoint",
   		   "cx": function(d) {
     	   return scaleX(0);
   			},
    	  "cy": function(d) {
	        return scaleY(d.value);
    	  }
    	});


3. then remove all elements where we don't have data anymore. Remove all elements from the `dp.exit()` selection:
	
		dp.exit().remove();


4. after 1.-3. the variable `dp` contains exactly the set of nodes which have the actual (new) data bound. So we can apply a `transition()` to all of them to move them to their new, valid position:

		dp.transition().attr({
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


### staggering animations (in scales.js)

To allow staggering animations (see [Heer and Robertson](http://vis.berkeley.edu/papers/animated_transitions/)) we use the (absolutely cool) feature, that for 
every parameter which we define for an element, we can access the attached data and data-index. As we read from the [documentation](https://github.com/mbostock/d3/wiki/Transitions) 
we can parametrize transitions to start after a specific delay. We now define this delay in dependence of each elements index in the display list.
And with this little trick, we are done.. Voilà!

	svg.selectAll(".datapoint")
		.transition()
		.ease("linear")
		.duration(500)
		.delay(function(d, i) { // <- HERE !!!!
	      return i * 5;
	    }).attr(......);









