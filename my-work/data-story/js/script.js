let w = 1200;
let h = 800;
let paddingX = 80;
let paddingY = 80;

let category_index = {
  'exercise':0,
  'bonding':1,
  'achievement':2,
  'leisure':3,
  'nature':4,
  'affection':5,
  'enjoy_the_moment':6
}

let category_color = {
  'exercise':'#a8acd3',
  'bonding':'#a2cae0',
  'nature':'#b9d28f',
  'leisure':'#a2cebb',
  'achievement':'#f2cfb7',
  'affection':'#f2c3c0',
  'enjoy_the_moment':'#f88776'
}

//set up container
let viz = d3.select(".svg-container")
  .append("svg")
  .attr("width", w)
  .attr("height", h)
  .append("g")

let svg=d3.select('svg');

let margin = {top: 20, right: paddingX+10, bottom: 110, left: paddingX};
let margin2 = {top: h*0.75, right: paddingX+10, bottom: 30, left: paddingX};
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
let labels = ['exercise','bonding','achievement','leisure','nature','affection',  'moment'];
let labelGroup =viz.append("g")
.attr("class", "labelGroup")
;


//append text outside data function
for(let i=0;i<7;i++){
labelGroup
  .attr('transform','translate('+(chartWidth+margin.left)+','+margin.top+')')
  .append('text')
  .text(labels[i])
  .attr('x','0')
  .attr('y',y(i))
  .attr('stroke','grey')
  ;
}

//creating clip mask for the chart
svg.append("defs").append("clipPath")
  .attr("id", "clip")
  .append("rect")
  .attr("width", chartWidth)
  .attr("height", chartHeight);


//load data
d3.csv("data/merged-filter.csv").then(function(incomingData){
  console.log(incomingData);

//process datapoint,filter out unmodified sentences
incomingData = incomingData.filter(function(d,i){
    if(d.modified == 'TRUE'){
      return true;
    }else{
      return false;
    }
    if(d.num_sentence<20){
      return true;
    }else{
      return false;
    }


})

//limit datapoints,n for a random start point of slice
let n=Math.floor(Math.random(1)*50000);
let dataSize = 1000;
incomingData = incomingData.slice(n,n+dataSize);
let maxAge = d3.max(incomingData, function(d) {
    return d.age;
})

//----axis-----
//set axis domain
x.domain([13,maxAge-5]);
y.domain([0,6]);
x2.domain(x.domain());
y2.domain(y.domain());

let maxNumofSentence = d3.max(incomingData, function(d) {
    return d.num_sentence;
})

console.log(maxNumofSentence,n);


let rScale = d3.scaleLinear().domain([0,maxNumofSentence]).range([1,4.5]);


//x axis
// focus.append("g")
// .attr("class", "axis axis--x")
// .attr("transform", "translate(0," + height + ")")
// .call(xAxis);

let xAxisGroup = focus.append("g").attr("class", "axis axis--x");
xAxisGroup
// .attr("transform","translate(0," + height + ")")
  .style("stroke-dasharray",("3,3"))
  .call(
    make_x_gridlines()
    .tickSize(-chartHeight)
    .tickFormat("")
    )

let yAxisGroup = focus.append("g").attr("class", "axis axis--y");
yAxisGroup
  .attr('transform','translate('+chartWidth+','+'0)')
  .attr("class","axis axis--y")
  .style("stroke-dasharray",("3,3"))
  .call(
    make_y_gridlines()
    .tickSize(-chartWidth)
    .tickFormat("")
    )


context.append("g")
  .attr("class", "axis axis--x")
  .attr("transform", "translate(0," + brushHeight + ")")
  .call(xAxis2);

///----force----

//force simulationRan
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
  .tick(10)
;

function restartForce(){
  //restart simulation of x axis
  simulation
  .alpha(1)
  .restart()
  .force('forceX', d3.forceX().x(function(d,i){
    return x(d.age);
  }))
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
    return rScale(d.num_sentence);
  })
  ;
}




//-----brush-----

//init brush
let paddingBrush = 80;
let brush = d3.brushX()
  .extent([[0,paddingBrush],[chartWidth, brushHeight+paddingBrush]])
  .on('brush end',brushed)
  ;

//brush group
context.append("g")
  .attr("class", "brush")
  .call(brush)
  .call(brush.move, x.range());

//zoom
// let zoom = d3.zoom()
// .scaleExtent([1, 8])
// .translateExtent([[0, 0], [w, h]])
// .extent([[0, 0], [w, h]])
// .on("zoom", zoomed);

// let zoomRect = svg.append("rect")
// .attr("class", "zoom")
// .attr("width", chartWidth-paddingX*2)
// .attr("height", chartHeight)
// .attr("transform", "translate("+margin.left+',' + margin.top + ")")
// .call(zoom);


function brushed() {
  if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") return;
      if (d3.event.sourceEvent && d3.event.sourceEvent.type === "hover") return; // ignore brush-by-zoom
  let s = d3.event.selection || x2.range();
  x.domain(s.map(x2.invert, x2));
  focus.select(".axis--x").call(xAxis.tickFormat(d3.format(".0f")));
  svg.select(".zoom")
  // .call(zoom.transform, d3.zoomIdentity
  //   .scale(chartWidth / (s[1] - s[0]))
  //   .translate(-s[0], 0));
    restartForce();
}

// function zoomed() {
// if (d3.event.sourceEvent && d3.event.sourceEvent.type === "brush") return; // ignore zoom-by-brush
//
// let t = d3.event.transform;x.domain(t.rescaleX(x2).domain());
// focus.select(".axis--x").call(xAxis);
// context.select(".brush").call(brush.move, x.range().map(t.invertX, t));
// // restartForce()
// }


//-----chart-----

let chart = focus.selectAll(".area").data(incomingData)
let chartEnter = chart.enter();
let chartExit = chart.exit();

//append circles
let datagroup = chartEnter
.append("circle")
  .attr('cx',function(d,i){
    return x(d.age)
  })
  .attr('cy',function(d,i){
    return y(category_index[d.predicted_category])
  })
  .attr('r',function(d){
    return rScale(d.num_sentence);
  })
  .attr('fill',function(d){
    return category_color[d.predicted_category];
  })
  .attr("class", "area")
  .on('mouseover',mouseover)
  .on('mousemove',mousemove)
  .on('mouseleave',mouseleave)
  ;

//tooltip
let tooltip = d3.select(".info")
.append("div")
  .style("opacity", 0)
  .attr('class',"tooltip")



//mouse interaction
function mouseover(d){

  // console.log(datagroup);
  //
  // tooltip
  //   .style("opacity", 1)
  //   .html("The happy moment is:<br> " + d.cleaned_hm)
  //   .style("left", (d3.mouse(this)[0]) + 100+"px")
  //   .style("top", (d3.mouse(this)[1]) + "px")
  // ;

  datagroup
    .transition()
    .style('opacity',0.1)
  ;

//change size
  // d3.select(this)
  //   .transition()
  //   .style('opacity',1)
  //   .attr('r',function(d){
  //     return '8';
  //   })
  // ;

}

function mousemove(d){

  tooltip
    .style("opacity", 1)
    .html("The happy moment is:<br> " + d.cleaned_hm)
    .style("left", (d3.mouse(this)[0]) + 100+"px")
    .style("top", (d3.mouse(this)[1]) + "px")
  ;

  datagroup
    .transition()
    .style('opacity',0.1)
  ;
// tooltip
// .style("opacity", 1)
// .html("The happy moment is:<br> " + d.cleaned_hm)
// .style("left", (d3.mouse(this)[0]) + 100+"px")
// .style("top", (d3.mouse(this)[1]) + "px")
// ;

// datagroup
// .style('opacity',0.1)
// ;


// d3.select(this)
// .attr('r',function(d){
//   return rScale(d.num_sentence);
// })
// ;

}

function mouseleave(d) {
tooltip
.style("opacity", 0)
;

datagroup
.style('opacity',1)
;

d3.select(this)
.style("stroke", "none")
.attr('r',function(d){
  return rScale(d.num_sentence);
})
;

}


//-----checkbox & filter-----

d3.selectAll(".checkbox").on("change",function(){
  updateOpacity();
});

//update with checkbox
function updateOpacity(){

  let keywords = ["single", "married", "male", "female", "iwe", "daughterson", "husbandwife", "bfgf", "dogcat", "bossteam", "someone"];

  let selectedCheckBox = [];

  d3.selectAll(".checkbox")
  .each(function(){

  let cb = d3.select(this);
  let name = cb.node().name;
  let state = cb.node().checked;

  if (state == true){
    selectedCheckBox.push(name);
  }

})

  console.log(selectedCheckBox);


  // // console.log(id);
  datagroup.attr('opacity', 0.2);

  datagroup
  .filter(function(d){
    if(d.marital == 'single' && selectedCheckBox.includes('single')){
      return true;
    }
    if(d.marital == 'married' && selectedCheckBox.includes('married')){
      return true;
    }
    if(d.marital == 'm' && selectedCheckBox.includes('male')){
      return true;
    }
    if(d.marital == 'f' && selectedCheckBox.includes('female')){
      return true;
    }
    if(d.iwe == 'TRUE' && selectedCheckBox.includes('iwe')){
      return true;
    }
    if(d.daughterson == 'TRUE' && selectedCheckBox.includes('daughterson')){
      return true;
    }
    if(d.husbandwife == 'TRUE' && selectedCheckBox.includes('husbandwife')){
      return true;
    }
    if(d.bfgf == 'TRUE' && selectedCheckBox.includes('bfgf')){
      return true;
    }
    if(d.bossteam == 'TRUE' && selectedCheckBox.includes('bossteam')){
      return true;
    }
    if(d.dogcat == 'TRUE' && selectedCheckBox.includes('dogcat')){
      return true;
    }
    if(d.someone == 'TRUE' && selectedCheckBox.includes('someone')){
      return true;
      console.log('t');
    }
    else{
      return false;
      console.log('else');
    }
  })
  ;

  console.log(datagroup);
  datagroup
  .attr('opacity', 1)
  ;
  // datagroup.filter(function(d, i){
  //   console.log(d[id]);
  //   // loop over currenbtly sleect array
  //   // and check if the datapoint contains any of the selected categories
  //   // if yes, return true
  //   // else, false
  //   return d[id] == "TRUE"
  // }).attr('opacity', 1)
  // console.log("-----");
  //
  // let cb = d3.select(this);
  // let name = cb.node().name;
  // let state = cb.node().checked;
  // console.log(cb.node());

// // For each check box,get name and state
// d3.selectAll(".checkbox")
// .each(function(d){
//
// let cb = d3.select(this);
// let name = cb.node().name;
// let state = cb.node().checked;
//
// console.log(cb.node().name, cb.node().checked);
//
// datagroup
// .attr('opacity',filterSetting)
// ;
//
// function filterSetting(d){
//
//   // console.log(d.iwe);
//   if(state == true){
//     if(name == 'iwe'){
//         if(d.iwe == true){
//           return '1';
//           console.log('i');
//         }
//     if(name == 'dogcat'){
//         if(d.iwe == true){
//           return '1';
//           console.log('cat');
//         }
//     }
//   }
//   else if(state == false){
//           return '0.1';
//           console.log(false);
//   }else{
//     console.log('else');
//   }
//
// }
// }
//
//
// })

}



})
