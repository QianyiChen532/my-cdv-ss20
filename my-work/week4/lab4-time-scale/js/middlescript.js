let w = 2400;
let h = 800;

let viz = d3.select("#container")
  .append("svg")
    .attr("class", "viz")
    .attr("width", w)
    .attr("height", h)
    .style("background-color", "lightpink")
;

function filterFunction(d){
  if(d.fame_score>150){
    return true;
  }else{
    return false;
  }
}

let timeParse = d3.timeParse('%Y');//a functioon to format time data

function mapFunction(d){
  d.death_year = timeParse(d.death_year);
  return timeParse(d.death_year);
}

function transformData(dataToTransform){
let newData = dataToTransform.filter(filterFunction);
// console.log(newData);
let timeCorrected = newData.map(mapFunction);
return newData;
}

function gotData(incomingData){
  // console.log(incomingData);
  let transformedData = transformData(incomingData);
  console.log(transformedData);

  function getYear(d){
    return d.death_year;
  }

  let minimumY = d3.min(transformedData,getYear);
  let maximumY = d3.max(transformedData,getYear);

let padding = 10;
  let timeScale = d3.scaleTime().domain([minimumY,maximumY]).range([padding,w]);

  let datagroups = viz.selectAll('datagroup').data(transformedData).enter()

  .append('g')
    .attr('class','datagroup')
;

function getText(d,i){
  console.log(d.death_year);
  return d.name + ' '+d.death_year.getFullYear();

}

let lable = datagroups
  .append('text')
  .attr('x',0)
  .attr('y',0)
  .attr('fill','black')
  .text(getText)
  ;

let circle = datagroups
  .append('circle')
  .attr('cx',0)
  .attr('cy',0)
  .attr('r',5)
  .attr('fill','white')
  ;

  datagroups
  .attr('transform',positioonGroup);

  function positioonGroup(d,i){
    let x = timeScale(d.death_year);
    let y = padding + Math.random()*(h-padding+2);

    return 'translate('+x+','+y+')';
  }


}


d3.json("celebrity_deaths.json").then(gotData);
