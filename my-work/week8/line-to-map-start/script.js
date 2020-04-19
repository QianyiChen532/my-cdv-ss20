let w = 1200;
let h = 800;
let padding = 90

// SVG
let viz = d3.select("#container").append("svg")
.style("width", w)
.style("height", h)
.style("background-color", "lavender")
;


// IMPORT DATA
d3.json("mainland.geojson").then(function(geoData){
  d3.csv('china-pop-2018.csv').then(function(incomingData){

    incomingData  =incomingData.map(function(d,i){
      d.population  =Number(d.population);
      return d;//turn string to numbber
    })
    // PRINT DATA
    console.log(incomingData);
    let minpop = d3.min(incomingData,function(d,i){
      return d.population;
    })
    console.log('minpop',minpop);
    let maxpop = d3.max(incomingData,function(d,i){
      return d.population;
    })
    console.log('maxpop',maxpop);

    let colorScale = d3.scaleLinear().domain([minpop,maxpop]).range(['white','blue']);
    console.log(colorScale(20));

    // SCALES (to translate data values to pixel values)
    // let xDomain = d3.extent(incomingData, function(d){ return Number(d.year); })
    // let xScale = d3.scaleLinear().domain(xDomain).range([padding,w-padding]);
    // let yDomain = d3.extent(incomingData, function(d){ return Number(d.birthsPerThousand); })
    // let yScale = d3.scaleLinear().domain(yDomain).range([h-padding,padding]);
    //
    //
    // // PATH (line) MAKER - gets points, returns one of those complicated looking path strings
    // let lineMaker = d3.line()
    //     .x(function(d){
    //       return xScale(Number(d.year));
    //     })
    //     .y(function(d){
    //       return yScale(Number(d.birthsPerThousand));
    //     })
    // ;
    let projection  = d3.geoEqualEarth()
    .translate([w/2,h/2])
    //  .center([103.8,34.1])//which longitude will be the center
    .fitExtent([[padding,padding],[w-padding,h-padding]],geoData)//注意格式 一个array,fit in 一个box
    ;

    let pathMaker = d3.geoPath(projection);

    // CREATE SHAPES ON THE PAGE!
    viz.selectAll(".province").data(geoData.features).enter()
    .append("path")
    .attr("class", "province")
    .attr("d", pathMaker)
    .attr("fill", function(d,i){
      console.log(d.properties.name);  //filter always return array,find function直接找element 结果不是array是point
      let correspondingDatapoint = incomingData.filter(function(datapoint){
        // console.log(datapoint);
        if(datapoint.province == d.properties.name){
          return true
        }else{
          return false;
        }

      })
      console.log(correspondingDatapoint);
if(correspondingDatapoint[0].population != undefined){
          console.log(correspondingDatapoint[0]);
}



    })
    .attr("stroke", "white")
    .attr("stroke-width", 4)
    ;





  })
})
