let w = 2400;
let h = 800;

let viz = d3.select("#container")
  .append("svg")
    .attr("class", "viz")
    .attr("width", w)
    .attr("height", h)
    .style("background-color", "lightblue")
;

function gotData(incomingData){
  console.log(incomingData);

  let datagroups = viz.selectAll('.datagroup').data(incomingData).enter()
    .append('g')
      .attr('class','datagroup')
  ;

  let yScale = d3.scaleLinear().domain([0,900]).range([0,h/2]);
  let colorScale = d3.scaleLinear().domain([300,450,850]).range(['black','orange','yellow']);
  //play with colorScale you can put 3 val in that range,eg the start point is not neccesary 0
  // console.log(yScale(830));//check scale

function getColor(d,i){
  // if (d.name == 'Shanghai Tower'){
  //   return 'yellow';
  // }else {
  //   return 'black'
  // }
  return colorScale(d.height);
}

  let towers = datagroups.append('rect')
    .attr('class','tower')
    .attr('x',0)
    .attr('y',getYPosition)
    .attr('width',20)
    .attr('height',getHeight)
    .style('fill',getColor)
    ;

function getName(d){
  return d.name;
}
  let lables = datagroups
  .append('text')
    .attr('class','labels')
    .text(getName)
    .attr('x',5)
    .attr('y',-4)
    .attr('transform','rotate(90)')
    .style('font-family','sans-serif')

    function getYPosition(d,i){
      return -yScale(d.height);//h-height
    }

  function getGroupPoosition(d,i){
    // console.log(d,i);
    let x = (w/100)*i;
    let y = h/2;
    console.log(h);

    return 'translate('+ x+','+y+')';
  }
  datagroups.attr('transform',getGroupPoosition)

  function getHeight(d,i) {
    return yScale(d.height);
  }




}


d3.json("buildings.json").then(gotData);
