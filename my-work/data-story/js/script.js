let w = 900;
let h = 500;
let padding = 30

let viz = d3.select(".category").append("svg")
.style("width", '50%')
.style("height", '80%')
// .style('background-color','white')
;

let category = ['exercise','bonding','nature','leisure','achievement','affection','enjoy_the_moment'] ;

let category_index = {
    'exercise':0,
    'bonding':1,
    'nature':2,
    'leisure':3,
    'achievement':4,
    'affection':5,
    'enjoy_the_moment':6
}

// let c_color = {
//   'exercise':,
//   'bonding':,
//   'nature':,
//   'leisure':,
//   'achievement':,
//   'affection':,
//   'enjoy_the_moment':
// }

// IMPORT DATA
d3.csv("../data/short-msg.csv").then(function(msgData){
  d3.csv("../data/merged.csv").then(function(fullData){
  d3.csv("../data/demographic.csv").then(function(demoData){


    fullData = fullData.slice(0,10000);
    console.log('msg',msgData);
    console.log('demo',demoData);
    console.log('full',fullData);


    //parse age from str to num
    fullData = fullData.map(function(d,i){
      d.age = Number(d.age);
      return d;
    })

    let ageExtent = d3.extent(fullData,function(d,i){
      return d.age;
    });


    let ageScale = d3.scaleLinear().domain(ageExtent).range([padding,w-padding]);

    let yScale = d3.scaleLinear().domain([0,6]).range([padding,h-padding]);
    let rScale = d3.scaleLinear().domain([1,69]).range([1,8]);

    let xAxisGroup = viz.append("g").attr("class", "xaxisgroup");

    let xAxis = d3.axisBottom(ageScale);
    xAxisGroup.call(xAxis);

    viz.selectAll(".datapoint").data(fullData).enter()
    .append("circle")
    .attr("class", "datapoint")
    .attr("cx", function(d){
      return ageScale(d.age);
    })
    .attr("cy", function(d){
      return h/2;
    })
    .attr("r", function(d){
      return rScale(d.num_sentence);
    })
    ;

    let simulation = d3.forceSimulation(fullData)
    .force('forceX',function(d,i){
        return d3.forceX(ageScale(d.age))
      })
    .force('forceY',function(d){
      return d3.forceY(yScale(category_index[d.predicted_category]))
    })
    .force('collide',d3.forceCollide().radius(function(d,i){

      return rScale(d.num_sentence)+1;
    }))
    .on('tick',simulationRan)
    ;

    console.log(fullData);

    fullData = fullData.map(function(datapoint){
      datapoint.x = ageScale(datapoint.age);
      datapoint.y = h/2;

      return datapoint
    })

    function simulationRan(){
      viz.selectAll(".datapoint")
  .attr("cx", function(d){
    // console.log(d);
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



  })
  })
})
