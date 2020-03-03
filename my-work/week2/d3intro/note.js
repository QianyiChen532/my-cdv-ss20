console.log('js');

let viz = d3.select('#viz-container')
  .append('svg')
    .attr('id','viz')//whatever element put here,even 'hello'
    .attr('width',600)
    .attr('height',600)
;
//<div id ='viz-container'><svg></svg></div>

// viz.attr('height',400);//important:return value(last selection)
//
// //<div id ='viz-container'><svg><circle></circle></svg></div>
// let myCircle = viz.append('circle')
//     .attr('cx',255)//center x/center y
//     .attr('cy',200)
//     .attr('r',20)
// ;
// //if there is no append circle, the attr will add to svg
// myCircle.attr('fill','white')

//rect x,y,width,height
//circle cx,cy,r
//elipse cx,cy,rx,ry
//line x1,x2,y1,y2
//fill & stroke(both for colors)
//stroke-width

let myData =[4,6,8,2,9];

function xLocation(datapoint){
  console.log(datapoint);
  return datapoint * 40; //do sth to process the data here
}

viz.selectAll('circle').data(myData).enter()
//selectAll()--empty object?(select nothing)  data()--bind data, enter-selection
//the text in selectAll
  .append('circle')
    .attr('cx',xLocation)//without () means just passing a reference to it
    .attr('cy',188)
    .attr('r',30)//apply to each one, =loop
;

viz.selectAll('rect').data(myData).enter()
//selectAll()--empty object?(select nothing)  data()--bind data, enter-selection
  .append('line')
    .attr('x1',20)
    .attr('x2',188)
    .attr('y1',40)
    .attr('y2',40)
    .attr('stroke-width',4)
    .attr('stroke','black')//apply to each one, =loop
;
