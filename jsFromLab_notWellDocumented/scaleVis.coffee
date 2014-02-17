svg = d3.select("#vis").append("svg")
svg.attr
  width: 600
  height: 400

textField = d3.select("body").append("div").text("value")

d3.select("body").append("button").text("shuffle")
.on
    "click": -> updateData()

d3.select("body").append("button").text("change scale")
.on
    "click": -> changeScale()

d3.select("body").append("button").text("swap")
.on
    "click": -> swapX()


data= []
isLogScale = false


scaleY = d3.scale.linear().domain([1,10000]).range([300,10])
scaleX = d3.scale.linear().domain([0,100]).range([10+80,400])
xAxis = d3.svg.axis().scale(scaleX).tickSize(10)
yAxis = d3.svg.axis().scale(scaleY).tickSize(-500).orient("left")
colorScale = d3.scale.linear().domain([1,10000]).range(["blue","red"])

updateData = ->
  dataSize = (Math.random()*50+50)

  for i in [0..dataSize]
    data[i]=
      pos: i
      value: Math.random()*9999+1

  dp = svg.selectAll(".datapoints").data(data)
  dp.enter().append("circle").attr
    "class":"datapoints"
    "r":5
    "cx": (d) -> scaleX(d.pos)
    "cy": (d) -> scaleY(d.value)
  .style
    "fill": (d) -> colorScale(d.value)
  .on
    "mouseover":(d) -> textField.text(d.value)
    "mouseout": -> textField.text("---")

changeScale = ->
  if (isLogScale)
    scaleY = d3.scale.linear().domain([1,10000]).range([300,10])
    isLogScale = false
  else
    scaleY = d3.scale.log().domain([1,10000]).range([300,10])
    isLogScale = true

  yAxis.scale(scaleY)
  d3.select(".y.axis").transition().call(yAxis)
  svg.selectAll(".datapoints").transition().attr("cy",(d) -> scaleY(d.value))

updateData()

svg.append("g").attr("class","x axis")
.attr("transform","translate(0,305)")
.call(xAxis)

svg.append("g").attr("class","y axis")
.attr("transform","translate(80,0)")
.call(yAxis)
console.log data
