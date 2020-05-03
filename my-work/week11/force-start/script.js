let w = 1500;
let h = 800;
let padding = 90;
let category_index = {
  'exercise':0,
  'bonding':1,
  'nature':2,
  'leisure':3,
  'achievement':4,
  'affection':5,
  'enjoy_the_moment':6
}

// let svg = d3.select("#visualization")
//     .append("svg")
//   .style("background-color", "lavender")
//   .attr("width", w)
//   .attr("height", h)
// ;

let viz = d3.select("#visualization")
.append("svg")
.attr("width", w)
.attr("height", h)
.append("g")

let svg=d3.select('svg');
let margin = {top: 20, right: 20, bottom: 110, left: 20},
margin2 = {top: h*0.8, right: 20, bottom: 30, left: 20},
width = +svg.attr("width")- margin.left - margin.right,
height = +svg.attr("height") - margin.top - margin.bottom,
height2 = +svg.attr("height") - margin2.top - margin2.bottom;

// initialise scales
let x = d3.scaleLinear().range([padding, width-padding]);
let x2 = d3.scaleLinear().range([padding, width-padding]);
let y2 = d3.scaleLinear().range([height2-padding,padding]);
let y = d3.scaleLinear().range([height-padding,padding]);

let xAxis = d3.axisBottom(x);
let xAxis2 = d3.axisBottom(x2);
let yAxis = d3.axisLeft(y);

let focus = svg.append("g")
.attr("class", "focus")
.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
.attr('width',width)
.attr('height',height);;

let context = svg.append("g")
.attr("class", "context")
.attr("transform", "translate(" + margin2.left + "," + margin2.top + ")")
.attr('width',width)
.attr('height',height2);


//load data
d3.csv("merged.csv").then(function(incomingData){
  console.log(incomingData);

  incomingData = incomingData.slice(0,1000);
  x.domain(d3.extent(incomingData, function(d) { return d.age; }));
  y.domain([0, 6]);
  x2.domain(x.domain());
  y2.domain(y.domain());

  let rScale = d3.scaleLinear().domain([1,69]).range([1,8]);

  //init brush
  let brush = d3.brushX()
  .extent([[0,100],[width, height2+100]])
  .on('brush end',brushed)
  ;

  let zoom = d3.zoom()
  .scaleExtent([1, Infinity])
  .translateExtent([[0, 0], [w, h]])
  .extent([[0, 0], [w, h]])
  .on("zoom", zoomed);

  svg.append("defs").append("clipPath")
    .attr("id", "clip")
  .append("rect")
    .attr("width", width)
    .attr("height", height);

    svg.append("rect")
       .attr("class", "zoom")
       .attr("width", width)
       .attr("height", height)
       .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
       .call(zoom);

  let chart = focus.selectAll(".area").data(incomingData)

  let chartEnter = chart.enter();
  let chartExit = chart.exit();

  chartEnter
  .append("circle")
  .attr('cx',function(d,i){
    return x(d.age)
  })
  .attr('cy',function(d,i){
    return y(category_index[d.predicted_category])
  })
  .attr('r',1)
  .attr('fill','red')
  .attr("class", "area")
  ;

  focus.append("g")
  .attr("class", "axis axis--x")
  .attr("transform", "translate(0," + height + ")")
  .call(xAxis);

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
  .attr("transform", "translate(0," + height2 + ")")
  .call(xAxis2);


  context.append("g")
  .attr("class", "brush")
  .call(brush)
  .call(brush.move, x.range());

  function updateChart(){

    focus.selectAll(".area").data(incomingData)
    .attr('cx',function(d,i){
      return x(d.age)
    })
    .attr('cy',function(d,i){
      return y(category_index[d.predicted_category])
    })
    ;
  }//when not using force

  // incomingData = incomingData.map(function(datapoint){
  //   datapoint.x = x(datapoint.age);
  //   datapoint.y = h/2;
  //
  //   return datapoint;
  // })

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
  // ;


  function restartForce(){
//need to do something with xscale here
    let simulation = d3.forceSimulation(incomingData)
    .force('forceX', d3.forceX().x(function(d,i){
      return x2(d.age)
    }))
    .force('forceY', d3.forceY().y(function(d){
      return y(category_index[d.predicted_category])
    }))
    .force('collide', d3.forceCollide().radius(function(d,i){
      return rScale(d.num_sentence)+1;
    }))
    .on('tick',simulationRan)
    ;
  }


  function simulationRan(){
    focus.selectAll(".area")
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
    if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") return; // ignore brush-by-zoom
    let s = d3.event.selection || x2.range();
    x.domain(s.map(x2.invert, x2));
    focus.select(".axis--x").call(xAxis);
    svg.select(".zoom").call(zoom.transform, d3.zoomIdentity
      .scale(width / (s[1] - s[0]))
      .translate(-s[0], 0));
      updateChart();
      restartForce()
    }

    function zoomed() {
      if (d3.event.sourceEvent && d3.event.sourceEvent.type === "brush") return; // ignore zoom-by-brush
      let t = d3.event.transform;
      x.domain(t.rescaleX(x2).domain());
      focus.select(".axis--x").call(xAxis);
      context.select(".brush").call(brush.move, x.range().map(t.invertX, t));
      updateChart();

    }

  })
