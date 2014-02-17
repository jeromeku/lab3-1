svg = d3.select("#visSimpsons").append("svg")
svg.attr
  width: 600
  height: 400

### here is the full list of data - our "world knowledge" ###
worldData = [
  {name:"homer"
  age:45}
  {name:"maggie"
  age:3}
  {name:"march"
  age:42}
  {name:"bart"
  age:14}
  {name:"lisa"
  age:13}
  {name:"grandpa"
  age:88}
]

### our view on the data is only the last 3 elements ###
data=[]
for i in [1..3]
  data.push(worldData.pop())

### this is high-order function woodoo to create a list of only all names
we need this list as reference for our ordinal scale/axis ###
names = data.reduce(((old, d) -> old.concat(d.name)),[])

ordinalScale = d3.scale.ordinal().domain(names).rangeBands([10,500])
yScale = d3.scale.linear().domain([0,d3.max(data, (d) -> d.age)]).range([0,200])

xAxis = d3.svg.axis().scale(ordinalScale)

### and for the fun of it we use some color scale. we use the woodoo from before to
create a list of all (worldData) names to assign already colors to all potential elements ###
colorScale = d3.scale.category10().domain(worldData.reduce(((old, d) -> old.concat(d.name)),[]))

### create axis ###
svg.append("g")
  .attr
    "class":"x axis"
    "transform":"translate(0,200)"
  .call(xAxis)


update = ->
  ### and again the pattern.. first all update data elements ###
  bars = svg.selectAll(".bar").data(data)

  ### then add alle new elements and give them an initial position ###
  bars.enter().append("rect")
    .attr
      "class":"bar"
      "x":(d) -> ordinalScale(d.name)+2
      "y":(d) -> 200 -yScale(d.age)
      "width": 1
      "height": 1

  ### delete the unused elements ###
  bars.exit().remove()

  ### and now apply the transition to all bound elements (including the newly added ones,
  excluding the just removed ones) ###
  bars.transition().attr
      "x":(d) -> ordinalScale(d.name)+2
      "y":(d) -> 200 -yScale(d.age)
      "width": ordinalScale.rangeBand()-5
      "height": (d) ->yScale(d.age)
    .style
      "fill":(d) -> colorScale(d.name)




update()

### create a button and apply a data change ###
d3.select("body").append("button").text("add a simpson")
.on
  "click": ->
    if (worldData.length>0)
      # get the next element from worldData and add it to our data taht will be displayed
      data.push(worldData.pop())
      # update the names list (one name more)
      names = data.reduce(((old, d) -> old.concat(d.name)),[])
      #update the scales and axis
      ordinalScale = d3.scale.ordinal().domain(names).rangeBands([10,500])
      xAxis.scale(ordinalScale)
      yScale.domain([0,d3.max(data, (d) -> d.age)])
      d3.select(".x.axis").transition().call(xAxis)
      # and update the data representation
      update()

