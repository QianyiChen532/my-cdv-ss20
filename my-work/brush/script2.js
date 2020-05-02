let w = 1500;
let h = 500;
let padding = 25;



let viz = d3.select("#visualization")
    .append("svg")
  .style("background-color", "lavender")
  .attr("width", w)
  .attr("height", h)
;

// var focus = viz.append("g")
//     .attr("class", "focus")
//     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  let brush = d3.brushX()
  .extent([[0,0],[w,h-10]])


let brushGroup = viz.append("g")
    .attr("class", "brush")
    .call(brush)
// initialise scales
let x = d3.scaleTime().range([padding, w-padding]);
let x2 = d3.scaleTime().range([padding, w-padding]);
let yScale2 = d3.scaleLinear().range([10,0]);

let xAxis = d3.axisBottom(x);
let xAxis2 = d3.axisBottom(x2);

let zoom = d3.zoom()
.scaleExtent([1, Infinity])
    .translateExtent([[0, 0], [w, h]])
    .extent([[0, 0], [w, h]])
    .on("zoom", zoomed);

let area2 = d3.area()
    .curve(d3.curveMonotoneX)
    .x(function(d) { return x2(d.date); })
    .y0(10)
    .y1(function(d) { return yScale2(d.price); });

d3.json("data.json",function(error,incomingData){
  console.log(incomingData);
  // if(error) throw error;
  incomingData = incomingData.slice(0,1000);

  //turn date in to data object
  incomingData = incomingData.map(d=>{
    d.date = new Date(d.parsedDate)
    d.price = Number(d.price);
    return d
  })

brush
.on("brush end", brushed);
  // function brushed(){
  //   if (d3.event.sourceEvent.type === "brush") return;
  //   console.log('brush');
  //   var e = brush.extent().call();
  // }

  // get the earliest and latest date in the dataset
  let extent = d3.extent(incomingData, function(d){
    return d.date;
  })
  console.log(extent);
  x.domain(extent);
  x2.domain(x.domain())

  let xAxisGroup = viz.append("g").attr("class", "xaxisgroup");
  xAxisGroup.call(xAxis);

  let priceExtent = d3.extent(incomingData,function(d){
    return d.price;
  })
console.log(priceExtent);

  let rScale = d3.scaleLinear().domain(priceExtent).range([2,20]);


  // put a circle for each data point onto the page


  viz.selectAll(".datapoint").data(incomingData).enter()
    .append("circle")
    .attr("class", "datapoint")
    .attr("cx", function(d){
      return x(d.date);
    })
    .attr("cy", function(d){
      return h/2;
    })
    .attr("r", function(d){
      return rScale(d.price);
    })
  ;

  let simulation = d3.forceSimulation(incomingData)
  .force('forfeX',function(d,i){
      return d3.forceX(x(d.date))
  })
  .force('forceY',d3.forceY(h/2))
  .force('collide',d3.forceCollide().radius(function(d,i){
// console.log(rScale(d.price));
    return rScale(d.price)+3;
// return 5;
}))
  .on('tick',simulationRan)
  ;
  // problem: points overlap!

incomingData = incomingData.map(function(datapoint){
  datapoint.x = x(datapoint.date);
  datapoint.y = h/2;
  datapoint.price = Number(datapoint.price);
  return datapoint
})

  function simulationRan(){
    viz.selectAll(".datapoint")
      .attr("cx", function(d){
        return d.x;
      })
      .attr("cy", function(d){
        return d.y;
      })
      .attr("r", function(d){
        return rScale(d.price);
      })
    ;
  }


})

function brushed() {
  if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") return; // ignore brush-by-zoom
  var s = d3.event.selection || x2.range();
  x.domain(s.map(x2.invert, x2));
  viz.select(".area").attr("d", area);
  viz.select(".axis--x").call(xAxis);
  svg.select(".zoom").call(zoom.transform, d3.zoomIdentity
      .scale(width / (s[1] - s[0]))
      .translate(-s[0], 0));
}

function zoomed() {
  if (d3.event.sourceEvent && d3.event.sourceEvent.type === "brush") return; // ignore zoom-by-brush
  var t = d3.event.transform;
  x.domain(t.rescaleX(x2).domain());
  viz.select(".area").attr("d", area);
  viz.select(".axis--x").call(xAxis);
  context.select(".brush").call(brush.move, x.range().map(t.invertX, t));
}
