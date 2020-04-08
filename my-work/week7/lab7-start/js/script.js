// just some console.logging at the start to make
// sure the script runs and we have data (from dataManager.js)
console.log("\n\n\nWelcome!\n\n\n");
console.log("script runs.");
console.log("do we have data?");
// check if variable exists: https://stackoverflow.com/a/519157
console.log("data:", typeof data!=='undefined'?data:"nothing here");
console.log(typeof data!=='undefined'?"seems like it ;-) it comes from the dataManager.js script.":"...damnit! let's see what is going wrong in the dataManager.js script.");

let w = 800;
let h = 500;
let padding = 50;

let viz, xAxisGroup, graphGroup;
let xScale, xAxis, yMax, yDomain, yScale;

// put the svg onto the page:
viz = d3.select("#container")
.append("svg")
.style("width", w)
.style("height", h)
;
xAxisGroup = viz.append("g").classed("xAxis", true);
graphGroup = viz.append('g').classed('graphGroup',true);

// binding functions to the buttons on the page
// the functions we use to do the actual work are defined in dataManager.js
function add(){
  addDatapoints(1);
  axisDisplay();
  updateAddExit();
}
document.getElementById("buttonA").addEventListener("click", add);

function remove(){
  removeDatapoints(1);
  axisDisplay();
  updateAddExit();
}
document.getElementById("buttonB").addEventListener("click", remove);

function removeAndAdd(){

  removeAndAddDatapoints(1,1);
  axisDisplay();
  updateAddExit();
}
document.getElementById("buttonC").addEventListener("click", removeAndAdd);

function sortData(){
  sortDatapoints();
  axisDisplay();
  updateAddExit();

}
document.getElementById("buttonD").addEventListener("click", sortData);

function shuffleData(){
  shuffleDatapoints();
  axisDisplay();
  updateAddExit();

}
document.getElementById("buttonE").addEventListener("click", shuffleData);

function surprise(){
  let r = Math.floor(Math.random(0,20)*5);
  shuffleDatapoints();
  removeAndAddDatapoints(r,r);
  console.log(r);
  axisDisplay();
  updateAddExit();
}
document.getElementById("buttonF").addEventListener("click", surprise);

axisDisplay();
function axisDisplay(){
  // function assignKeys(d){
  //   return d.key;
  // }
  //x scale band scale 柱状图的宽 的感觉？
  let allNames = data.map( function(d){return d.key});
  console.log(allNames);

  xScale = d3.scaleBand()
  .domain(allNames)
  .range([padding, w-padding])
  .paddingInner(0.1)
  ;

  xAxis = d3.axisBottom(xScale);
  xAxis.tickFormat(d=>{return data.filter(dd=>dd.key==d)[0].name;})//if doesn't have this line, will return datas in all names//怎么match到emoji？

  xAxisGroup.transition().call(xAxis);

  //modify axis
  xAxisGroup.selectAll("text").attr("font-size", 24).attr("y", 9);
  xAxisGroup.selectAll("line").remove();
  xAxisGroup.attr("transform", "translate(0,"+ (h-padding) +")")

  //y scaleBand
  yMax = d3.max(data, function(d){return d.value});
  yDomain = [0, yMax];
  yScale = d3.scaleLinear().domain(yDomain).range([0,h-padding*2])





}

graphDisplay();
//initial graph
function graphDisplay(){

  //update graph
  function assignKeys(d){
    return d.key;
  }
  let elementsForPage = graphGroup.selectAll(".datapoint").data(data,assignKeys);
  //！do not have enter()
  // console.log("D3's assessment of whats needed on the page:", elementsForPage);

  let enteringElements = elementsForPage.enter();
  let enteringDataGroups = enteringElements.append('g').classed("datapoint", true);

  enteringDataGroups.attr('transform',function(d,i){
    return 'translate('+xScale(d.key)+','+(h-padding)+')'
  });

  enteringDataGroups

  .append('rect')
  .attr('width',function(){
    return xScale.bandwidth();
  })
  .attr('height',function(d,i){
    return yScale(d.value);
  })
  .attr('y',function(d,i){
    return -yScale(d.value);//!-y here
  })
  .attr('fill','black')
  ;

  // let exitingElements = elementsForPage.exit();

  //like taking enter[]and exiting[]from the whole elementsforpage array
  console.log("enteringElements", enteringElements);


}

//change data（graph）
function updateAddExit(){
  //this will not remove the last one and will affect the rearrangment
  function assignKeys(d){
    return d.key;
  }
  console.log("new data",data);
  elementsForPage = graphGroup.selectAll(".datapoint").data(data,assignKeys);
  console.log('elementsForPage',elementsForPage);

  enteringElements = elementsForPage.enter();
  console.log('enteringElements',enteringElements);

  elementsForPage.transition().duration(500).attr("transform", function(d, i){
    return "translate("+ xScale(d.key)+ "," + (h - padding) + ")"
  });

  //update axis
  allNames = data.map(function(d){console.log(d);return d.key});
  xScale.domain(allNames);

  // xAxis = d3.axisBottom(xScale);
  // xAxis.tickFormat(d=>{return data.filter(dd=>dd.key==d)[0].name;}); // we adjust this because it uses the new data
  xAxisGroup.attr("font-size", 18); // we adjust this to bring the new axis onto the page

  // // y scale
  yMax = d3.max(data, function(d){return d.value});
  yDomain = [0, yMax+yMax*0.1];
  yScale.domain(yDomain);
  //update element
  elementsForPage.select("rect")
  .transition()
  .duration(1200)
  .attr("width", function(){
    return xScale.bandwidth();
  })
  .attr("y", function(d,i){
    return -yScale(d.value);
  })
  .attr("height", function(d, i){
    return yScale(d.value);
  });

  // .transition()
  // .duration(200)
  // .attr("fill", "black")


  let incomingDataGroups = enteringElements
  .append("g")
  .classed("datapoint", true)
  ;

  // position the groups:
  incomingDataGroups.attr("transform", function(d, i){
    return "translate("+ xScale(d.key)+ "," + (h - padding) + ")"
  });

  incomingDataGroups
  .append("rect")
  .attr("y", function(d,i){
    return 0;
  })
  .attr("height", function(d, i){
    return 0;
  })
  .attr("width", function(){
    return xScale.bandwidth();
  })

  .transition()
  .duration(800)
  .attr("y", function(d,i){
    return -yScale(d.value);
  })
  .attr("height", function(d, i){
    return yScale(d.value);
  })
  .attr("fill", "#F27294")//if press too quickly the bar will remain pink
  .transition()
  .delay(200)
  .duration(500)
  .attr("fill", "black")
  ;
//add transition to color and width separately?

  let  exitingElements = elementsForPage.exit();
  exitingElements.select("rect")
  .attr("fill", "#04ADBF")//put color first
  .transition()//delete dura
  .attr("y", 0)
  .attr("height", 0)

;

exitingElements
.transition()
.duration(300)
.remove();
//playing with transition on the two parts above to adjust the color changing

//if it is not removed, the new element will also be blue, meaning it is reused
console.log('exitingElements',exitingElements);


}
