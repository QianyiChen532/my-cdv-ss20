console.log('js');

//regradless of the data
let viz = d3.select('#viz-container')
.append('svg')
  .attr('id','viz')//whatever element put here,even 'hello'
  .attr('width',600)
  .attr('height',600)
;

function randomX(){
  return Math.random()*600;
}

function randomY(d,i,a){
  console.log(d,i,a);
  return Math.random()*400;
}

function randomGroupPosition(d,i,a){
  let x =i*100;
  console.log(d,i,a);
  return "translate("+x+',200)'
}
//load the data, and do things with the data

d3.json('data.json').then(gotData);

function gotData(incomingData){
  // //cn food
  //   viz.selectAll('.chinesefood').data(incomingData).enter()
  //   .append('circle')
  //     .attr('cx',randomX)
  //     .attr('cy',randomY)
  //     .attr('r',20)
  //     .attr('fill','white')
  //     .attr('class','chineseFood')
  // //Halal
  // //这里all后面要改成class name！！！！
  //     viz.selectAll('.halalFood').data(incomingData).enter()
  //     .append('circle')
  //       .attr('cx',randomX)
  //       .attr('cy',randomY)
  //       .attr('r',20)
  //       .attr('fill','red')
  //       .attr('class','halalFood')

  let datagroups = viz.selectAll('.datagroup').data(incomingData).enter()
  .append('g')
    .attr('class','datagroup')
  ;
  //append a circle inside each datagroup
  datagroups
  .append('circle')
    .attr('cx',0)
    .attr('cy',0)
    .attr('r',21)

  datagroups
  .append('text')
    .attr('x',0)
    .attr('y',0)
    .text('Hello')

  datagroups.attr('transform',randomGroupPosition);


}
