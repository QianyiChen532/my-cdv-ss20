let w = 1300;
let h = 800;
let paddingX = 90;
let paddingY = 80;

let category_index = {
  'exercise':0,
  'bonding':1,
  'nature':2,
  'leisure':3,
  'achievement':4,
  'affection':5,
  'enjoy_the_moment':6
}

//set up container
let viz = d3.select(".svg-container")
.append("svg")
.attr("width", w)
.attr("height", h)
.append("g")

let svg=d3.select('svg');

let margin = {top: 20, right: paddingX, bottom: 110, left: paddingX};
let margin2 = {top: h*0.8, right: paddingX, bottom: 30, left: paddingX};
let chartWidth = +svg.attr("width")- margin.left - margin.right;
let chartHeight = +svg.attr("height") - margin.top - margin.bottom;
let brushHeight = +svg.attr("height") - margin2.top - margin2.bottom;

// initialise scales
let x = d3.scaleLinear().range([0, chartWidth]);
let x2 = d3.scaleLinear().range([0, chartWidth]);
let y2 = d3.scaleLinear().range([brushHeight-paddingY,paddingY]);
let y = d3.scaleLinear().domain([0,6]).range([chartHeight-paddingY,paddingY]);

let xAxis = d3.axisBottom(x);
let xAxis2 = d3.axisBottom(x2);
let yAxis = d3.axisLeft(y);

//styling grid
function make_x_gridlines() {
  return d3.axisBottom(x)
  .ticks(7)
}
//not showing yet
function make_y_gridlines() {
  return d3.axisRight(y)
  .ticks(7)
}

//group for chart
let focus = svg.append("g")
.attr("class", "focus")
.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
;

//group for brush
let context = svg.append("g")
.attr("class", "context")
.attr("transform", "translate(" + margin2.left + "," + margin2.top + ")")
.attr('fill','green')
;

//labels for different categories
let labels = ['exercise','bonding','nature','leisure','achievement','affection',  'moment'];

let labelGroup = focus.append("g").attr("class", "labelGroup");

//append text outside data function
for(let i=0;i<7;i++){
labelGroup
  .attr('transform','translate('+chartWidth+','+'0)')
  .append('text')
  .text(labels[i])
  .attr('x','-30')
  .attr('y',y(i))
  .attr('stroke','black')
  ;
}


//load data
d3.csv("merged.csv").then(function(incomingData){
  console.log(incomingData);

//process datapoint,filter out unmodified sentences
incomingData = incomingData.filter(function(d,i){
    if(d.modified == 'TRUE'){
      return true;
    }else{
      return false;
    }
  })

//limit datapoints,n for the start point of slice
let n=Math.floor(Math.random(1)*50000);
let dataSize = 1000;
incomingData = incomingData.slice(n,n+dataSize);
let maxAge = d3.max(incomingData, function(d) {
    return d.age;
  })

//set axis domain
x.domain([13,maxAge-5]);
y.domain([0,6]);
x2.domain(x.domain());
y2.domain(y.domain());

let maxNumofSentence = d3.max(incomingData, function(d) {
      return d.num_sentence;
    })

let rScale = d3.scaleLinear().domain([1,maxNumofSentence]).range([3,12]);

//init brush
let paddingBrush = 80;
let brush = d3.brushX()
.extent([[200,paddingBrush],[chartWidth, brushHeight+paddingBrush]])
.on('brush end',brushed)
;

//zoom
let zoom = d3.zoom()
.scaleExtent([1, 8])
.translateExtent([[0, 0], [w, h]])
.extent([[0, 0], [w, h]])
.on("zoom", zoomed);

svg.append("defs").append("clipPath")
.attr("id", "clip")
.append("rect")
.attr("width", chartWidth)
.attr("height", chartHeight);

let zoomRect = svg.append("rect")
.attr("class", "zoom")
.attr("width", chartWidth-paddingX*2)
.attr("height", chartHeight)
.attr("transform", "translate("+margin.left+',' + margin.top + ")")
.call(zoom);

let chart = focus.selectAll(".area").data(incomingData)
let chartEnter = chart.enter();
let chartExit = chart.exit();

//tooltip

let tooltip = d3.select(".svg-container")
.append("div")
.style("opacity", 0)
.attr('width','100px')
.attr("class", "tooltip")
.style("background-color", "white")
.style("border", "solid")
.style("border-width", "1px")
.style("border-radius", "5px")
.style("padding", "5px")
.style('z-index','2')

//mouse interaction
function mouseover(d){

  console.log(d.cleaned_hm);
  chart
  .attr('opacity',0.1)

  d3.select(this)
  .style("stroke", "black")
  .style("opacity", 1)

  ;
}

function mousemove(d){
  tooltip
  .style("opacity", 1)
  .html("The happy moment is:<br> " + d.cleaned_hm)
  .style("left", (d3.mouse(this)[0]) + "px")
  .style("top", (d3.mouse(this)[1]) + "px")

}

function mouseleave(d) {
  tooltip
  .style("opacity", 0)

  // d3.select(this)
  //  .style("stroke", "none")
  //  .style("opacity", 1)

  viz.selectAll(".datapoint").data(fullData)
  .attr('opacity',1)
  ;
}


//append circles
let datagroup = chartEnter
.append("circle")
.attr('cx',function(d,i){
  return x(d.age)
})
.attr('cy',function(d,i){
  return y(category_index[d.predicted_category])
})
.attr('r',3)
.attr("class", "area")
//   .on('mouseover',function(d){
//   console.log('mouseover');
//   datagroup
//   .attr('opacity',0.1)
//   d3.select(this)
//   .attr('opacity',1)
// })
.on('mouseover',mouseover)
.on('mousemove',mousemove)
.on('mouseleave',mouseleave)
;

// focus.append("g")
// .attr("class", "axis axis--x")
// .attr("transform", "translate(0," + height + ")")
// .call(xAxis);

let xAxisGroup = focus.append("g").attr("class", "axis axis--x");
xAxisGroup
// .attr("transform","translate(0," + height + ")")
.style("stroke-dasharray",("3,3"))
.call(make_x_gridlines()
.tickSize(-chartHeight)
.tickFormat("")
)

let yAxisGroup = focus.append("g").attr("class", "axis axis--y");
yAxisGroup
.attr('transform','translate('+chartWidth+','+'0)')
.attr("class","axis axis--y")
.style("stroke-dasharray",("3,3"))
.call(make_y_gridlines()
.tickSize(-chartWidth)
.tickFormat("")
  )

  //circles on the brush filter
  // context.selectAll(".area2").data(incomingData).enter()
  // .append("circle")
  //     // .datum(incomingData)
  //     .attr('cx',function(d,i){
  //       return x2(d.age)
  //     })
  //     .attr('cy',function(d,i){
  //       return y2(category_index[d.predicted_category]);
  //     })
  //       .attr('r',1)
  //       .attr('fill','black')
  //     .attr("class", "area2")
  //     ;

context.append("g")
.attr("class", "axis axis--x")
.attr("transform", "translate(0," + brushHeight + ")")
.call(xAxis2);

context.append("g")
.attr("class", "brush")
.call(brush)
.call(brush.move, x.range());

incomingData = incomingData.map(function(datapoint){
  datapoint.x = x(datapoint.age);
  datapoint.y = h/2;

  return datapoint;
})

  // let simulation = d3.forceSimulation(incomingData)
  // .force('forceX', d3.forceX().x(function(d,i){
  //   return x(d.age)
  // }))
  // .force('forceY', d3.forceY().y(function(d){
  //   return y(category_index[d.predicted_category])
  // }))
  // .force('collide', d3.forceCollide().radius(function(d,i){
  //   return rScale(d.num_sentence)+1;
  // }))
  // .on('tick',simulationRan)
  // .tick(10)
  // ;

//when not using force
function updateChart(){

  chart
  .attr('cx',function(d,i){
    return x(d.age)
  })
  .attr('cy',function(d,i){
    return y(category_index[d.predicted_category])
  })
  ;
}

function restartForce(){
  //need to do something with xscale here
  let simulation = d3.forceSimulation(incomingData)
  .force('forceX', d3.forceX().x(function(d,i){
    return x(d.age)
  }))
  .force('forceY', d3.forceY().y(function(d){
    return y(category_index[d.predicted_category])
  }))
  .force('collide', d3.forceCollide().radius(function(d,i){
    return rScale(d.num_sentence)+1;
  }))
  .on('tick',simulationRan)
  .tick(10)
  ;
}

function simulationRan(){
  focus.selectAll("circle")
  .attr("cx", function(d){
    return d.x;
  })
  .attr("cy", function(d){
    return d.y;
  })
  .attr("r", function(d){
    return rScale(d.num_sentence)
  })
  ;
}

function brushed() {
  if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") return;
      if (d3.event.sourceEvent && d3.event.sourceEvent.type === "hover") return; // ignore brush-by-zoom
  let s = d3.event.selection || x2.range();
  x.domain(s.map(x2.invert, x2));
  focus.select(".axis--x").call(xAxis.tickFormat(d3.format(".0f")));
  svg.select(".zoom")
  .call(zoom.transform, d3.zoomIdentity
    .scale(chartWidth / (s[1] - s[0]))
    .translate(-s[0], 0));
    // restartForce();
}

function zoomed() {
if (d3.event.sourceEvent && d3.event.sourceEvent.type === "brush") return; // ignore zoom-by-brush

let t = d3.event.transform;x.domain(t.rescaleX(x2).domain());
focus.select(".axis--x").call(xAxis);
context.select(".brush").call(brush.move, x.range().map(t.invertX, t));
// restartForce()
}

//filters
function filterData(){

}

//update with checkbox
function update(){


// For each check box:
d3.selectAll(".checkbox").each(function(d){
  let cb = d3.select(this);
  console.log(cb);
  console.log(this);

  let grp = cb.property("value")
  console.log(grp);
  console.log(cb.property("checked"));
  //how to access the text/label
})
}

d3.selectAll(".checkbox").on("change",update);



})
