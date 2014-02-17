/**
 * Created by hen on 2/14/14.
 */
var data, svg, textField, updateData;

svg = d3.select("#vis1").append("svg");

svg.attr({
    width: 600,
    height: 400
});

textField = d3.select("body").append("div").text("value");

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

updateData = function() {
    var dataSize, i;
    dataSize = Math.random() * 50 + 50;

    for (i = 0; i <= dataSize; ++i) {
        data.push(data[i] = {
            pos: i,
            value: Math.random() * 9999 + 1
        });
    }
    return
};

updateData();

console.log(data);