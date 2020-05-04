let w = 1000;
let h = 900;
let paddingX = 100;
let paddingY = 10;


// let viz = d3.select(".category").append("svg")
// .style("width", '50%')
// .style("height", '80%')
// // .style('background-color','white')
// ;

let viz = d3.select("#category")
   .append("svg")
   .attr("width", w)
   .attr("height", h);

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


    fullData = fullData.slice(0,1000);

    fullData = fullData.filter(function(d,i){
    if(d.modified == 'TRUE'){
      return true;
    }else{
      return false;
    }
  })



    //parse age from str to num
    fullData = fullData.map(function(d,i){
      d.age = Number(d.age);
      return d;
    })

    let ageMax = d3.max(fullData,function(d,i){
      return d.age;
    });


    let xScale = d3.scaleLinear().domain([10,ageMax]).range([paddingX,w-paddingX]);

    let yScale = d3.scaleLinear().domain([0,6]).range([paddingY,h-2*paddingY]);
    let rScale = d3.scaleLinear().domain([1,30]).range([5,8]);

    let xAxisGroup = viz.append("g").attr("class", "xaxisgroup");

    let xAxis = d3.axisBottom(xScale);
    // xAxisGroup.call(xAxis);

    let tooltip = d3.select(".svg-container")
   .append("div")
   .style("opacity", 0)
   .attr('width','100px')
   .attr("class", "tooltip")
   .style("background-color", "white")
   .style("border", "solid")
   .style("border-width", "0.5px")
   .style("border-radius", "5px")
   .style("padding", "5px")
   .style('z-index','2')

    let datagroup = viz.selectAll(".datapoint").data(fullData).enter()
    .append("circle")
    .attr("class", "datapoint")
    .attr("cx", function(d){
      return xScale(d.age);
    })
    .attr("cy", function(d){
      return yScale(category_index[d.predicted_category]);
    })
    .attr("r", function(d){
      return rScale(d.num_sentence);
    })
    .on('mouseover',mouseover)
    .on('mousemove',mousemove)
    .on('mouseleave',mouseleave)

  ;
  function mouseover(d){
  console.log(d.cleaned_hm);
    viz.selectAll(".datapoint").data(fullData)
    .attr('opacity',0.1)

   //  tooltip
   // .style("opacity", 1)
   // .html("The happy moment is:<br> " + d.cleaned_hm)
   // .style("left", (d3.mouse(this)[0]) + "px")
   // .style("top", (d3.mouse(this)[1]) + "px")

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


    let simulation = d3.forceSimulation(fullData)
          .force('forceX', d3.forceX().x(function(d,i){
              return xScale(d.age)
            }))
          .force('forceY', d3.forceY().y(function(d){
            return yScale(category_index[d.predicted_category])
          }))
          .force('collide', d3.forceCollide().radius(function(d,i){
            return rScale(d.num_sentence)+1;
          }))
          .on('tick',simulationRan)
        ;

    console.log(fullData);

    fullData = fullData.map(function(datapoint){
      datapoint.x = xScale(datapoint.age);
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
