let w = 1200;
let h = 700;
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

let viz = d3.select(".svg-container")
.append("svg")
.attr("width", w)
.attr("height", h)
.append("g")

let svg=d3.select('svg');
let margin = {top: 20, right: paddingX, bottom: 110, left: paddingX},
margin2 = {top: h*0.8, right: paddingX, bottom: 30, left: paddingX},
width = +svg.attr("width")- margin.left - margin.right,
height = +svg.attr("height") - margin.top - margin.bottom,
height2 = +svg.attr("height") - margin2.top - margin2.bottom;

// initialise scales
let x = d3.scaleLinear().range([0, width]);
let x2 = d3.scaleLinear().range([0, width]);
let y2 = d3.scaleLinear().range([height2-paddingY,paddingY]);
let y = d3.scaleLinear().range([height-paddingY,paddingY]);

let xAxis = d3.axisBottom(x);
let xAxis2 = d3.axisBottom(x2);
let yAxis = d3.axisLeft(y);

let focus = svg.append("g")
.attr("class", "focus")
.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
// .attr('width',width-paddingX*2)
// .attr('height',height)
;


let context = svg.append("g")
.attr("class", "context")
.attr("transform", "translate(" + margin2.left + "," + margin2.top + ")")
// .attr('width',width)
// .attr('height',height2)
.attr('fill','green')
;


//load data
d3.csv("merged.csv").then(function(incomingData){
  console.log(incomingData);

  //process datapoint
  incomingData = incomingData.filter(function(d,i){
      if(d.modified == 'TRUE'){
        return true;
      }else{
        return false;
      }
    })

  incomingData = incomingData.slice(0,1000);
  let maxAge = d3.max(incomingData, function(d) {
     return d.age; })
  x.domain([10,maxAge]);
  y.domain([0, 6]);
  x2.domain(x.domain());
  y2.domain(y.domain());

  let maxNumofSentence = d3.max(incomingData, function(d) {
     return d.num_sentence; })

  let rScale = d3.scaleLinear().domain([1,maxNumofSentence]).range([3,12]);

  //init brush
  let paddingBrush = 80;
  let brush = d3.brushX()
  .extent([[0,paddingBrush],[width, height2+paddingBrush]])
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
    .attr("width", width)
    .attr("height", height);

  let zoomRect = svg.append("rect")
       .attr("class", "zoom")
       .attr("width", width-paddingX*2)
       .attr("height", height)
       .attr("transform", "translate("+margin.left+',' + margin.top + ")")
       .call(zoom);

  let chart = focus.selectAll("#area").data(incomingData)

  let chartEnter = chart.enter();
  let chartExit = chart.exit();

//append circles
  chartEnter
  .append("circle")
  .attr('cx',function(d,i){
    return x(d.age)
  })
  .attr('cy',function(d,i){
    return y(category_index[d.predicted_category])
  })
  .attr('r',3)
  .attr("id", "area")
  .attr('class','selected')
  .on('mouseover',showTooltip)
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

  incomingData = incomingData.map(function(datapoint){
    datapoint.x = x(datapoint.age);
    datapoint.y = h/2;

    return datapoint;
  })

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
  ;

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
    if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") return; // ignore brush-by-zoom
    let s = d3.event.selection || x2.range();
    x.domain(s.map(x2.invert, x2));
    focus.select(".axis--x").call(xAxis.tickFormat(d3.format(".0f")));
    svg.select(".zoom").call(zoom.transform, d3.zoomIdentity
      .scale(width / (s[1] - s[0]))
      .translate(-s[0], 0));
updateChart();
      restartForce();
    }

    function zoomed() {
      if (d3.event.sourceEvent && d3.event.sourceEvent.type === "brush") return; // ignore zoom-by-brush
      if (d3.event.sourceEvent && d3.event.sourceEvent.type === "hover") return;
      let t = d3.event.transform;
      x.domain(t.rescaleX(x2).domain());
      focus.select(".axis--x").call(xAxis);
      context.select(".brush").call(brush.move, x.range().map(t.invertX, t));
      restartForce()
      updateChart();
    }

    focus.selectAll('circle')
    .on('mouseover',showTooltip)

    function showTooltip(){
      console.log('show');
    }

  //tooltip
  var tooltip = d3.select("#chart")
        .append("div")
        .attr("class", "my-tooltip")//add the tooltip class
        .style("position", "absolute")
        .style("z-index", "10")
        .style("visibility", "hidden");
    tooltip.append("div")
        .attr("id", "tt-name")
        .text("simple");
    tooltip.append("div")
        .attr("id", "tt-size")
        .text("simple");

  })
