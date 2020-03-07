console.log('js');
//about d3 group:https://github.com/d3/d3-array

//topic color
let tc = {
  'news':'#f44336ab',
  'personal experience':'#03a9f4ad',
  'design&art':'#ff98009c',
  'tech':'#8bc34ab0',
  'entertainment':'#b02792b0',
  'business':'#673ab7b5',
  'culture':'#ffeb3bad'

}

let how = ['talking','wechat/weibo','phonecall/meeting','video/website'];
//how color
let hc = {
  'talking':'#ffdf3b',
  'wechat/weibo':'#4caf50',
  'phonecall/meeting':'#03a9f4',
  'video/website':'#f44336'
}

//how to symbol
let hs = {
  'talking':'symbolCircle',
  'wechat/weibo':'symbolCross',
  'phonecall/meeting':'symbolDiamond',
  'video/website':'symbolStar'
}

let viz = d3.select('#viz-container')
.append('svg')
.attr('id','viz')
.attr('height',800)
.attr('width',1200)
.append('g')
.attr('transform','translate(50,100)')//whatever element put here,even 'hello'
;

let div = d3.select("body").append("div")
.attr("class", "tooltip")
.style("opacity", 0);

//how button
// for(let i = 0; i<how.length;i++){
//   viz
//   .append('rect')
//   .attr('x',i*150+320)
//   .attr('y',220)
//   .attr('width',130)
//   .attr('height',30)
//   .attr('fill',hc[how[i]])
//   .attr('class','how')
//   // .on('mouseover',connection)
//
//   viz
//   .append('text')
//   .attr('x',i*150+340)
//   .attr('y',240)
//   .attr('font-size',15)
//   .attr('fill','white')
//   .attr('z-index',1)
//   .text(how[i])
// }

//load json

d3.json('data.json').then(gotData);

function gotData(incomingdata){
  // console.log(incomingdata);
  let datagroup = viz.selectAll('.datagroup').data(incomingdata).enter()
  .append('g')
  .attr('class','datagroup')

  //d
  datagroup
  .append('circle')
  .attr('fill', function(d){return tc[d.topic];})
  .attr('cx',xLocation)
  .attr('cy',yLocation)
  .attr('r',radius)


  // datagroup.selectAll('.howmedium').data()
  d3.selectAll('circle')
  .on("mouseover", function(d) {
    div.transition()
    .duration(200)
    .style("opacity", .9);
    div	.html(d.howmedium + "<br/>"  + d.topic)
    .style("left", (d3.event.pageX) + "px")
    .style("top", (d3.event.pageY - 40) + "px");
  })
  .on("mouseout", function(d) {
    div.transition()
    .duration(500)
    .style("opacity", 0);
  });
  // .attr('class',function(d){return (d.from).toString();})
  // .on('mouseover',info)
  ;

  let byHow = d3.group(incomingdata, d=> d.howmedium)

  let w = viz.selectAll('.wechat').data(byHow.get('wechat/weibo')).enter()
  .append('g')
  .attr('class','wechat')
  .append('circle')
  .attr('cx',xLocation)
  .attr('cy',yLocation)
  .attr('r',5)
  .style('fill-opacity',0.5)
  .style('fill','grey')
  .attr('transform','translate(0,-20)')

  let video = viz.selectAll('.web').data(byHow.get('video/website')).enter()
  .append('g')
    .attr('class','web')
    .append('rect')
    .attr('cx',xLocation)
    .attr('cy',yLocation)
    .attr('r',5)
    .style('fill-opacity',0.5)
    .style('fill','grey')
    .attr('transform','translate(0,-20)')



}

function xLocation(d){
  return d.no*30;
}
function yLocation(d,i){

  return i*Math.random(40,75)+(d.date % 2)*300;
}

function radius(d,i){
  console.log((Math.round(10*Math.random(10,25))));
  return (i%4+1)*Math.round(1+10*Math.random(10,25));
}
