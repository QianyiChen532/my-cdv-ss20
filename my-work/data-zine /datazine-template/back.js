console.log('js');

const canvasWidth = 1200;
const canvasHeight = 800;
const paddingX = 30;
const paddingY = 30;

let vizWidth = canvasWidth-2*paddingX;
let vizHeight = canvasHeight-2*paddingY;

//7 boxes for 7 days in a week
let boxGap = 50;
let boxNum = 7;
let boxWidth = (vizWidth - boxGap*(boxNum-1))/boxNum;
let boxHeight = vizHeight-paddingY;

let weekNum;
let timeperiod;

//topic color
let tc = {
  'news':'#85bdaebd',
  'personal':'#cea8a8db',
  'design&art':'#ff98009c',
  'tech':'#a6cadca3',
  'entertainment':'#e91e1eba',
  'business':'#5e82acc9',
  'culture':'#ff075f70'

}

let how = ['talking','wechat/weibo','phonecall/meeting','video/website'];
//how color
let hc = {
  'talking':'#192d69bd',
  'wechat/weibo':'#ffc100bd',
  'phone call/meeting':'#70b2e4b5',
  'video/website':'#e9591e94'
}

//how to symbol
let hs = {
  'talking':'symbolCircle',
  'wechat/weibo':'symbolCross',
  'phone call/meeting':'symbolDiamond',
  'video/website':'symbolStar'
}

let symbolTypes = ['symbolCircle', 'symbolCross', 'symbolDiamond', 'symbolStar', 'symbolTriangle', 'symbolWye'];

//initialize container

let viz = d3.select('#container')
.append('svg')
.attr('id','viz')
.attr('height',800)
.attr('width',1200)
.append('g')
  .attr('transform',groupPosition)
;

let div = d3.select("body").append("div")
.attr("class", "tooltip")
.style("opacity", 0);

let tag = ['Monday','Tuesday','Wednesday','Thursday', 'Friday','Saturday', 'Sunday'];

//filter timescale
let timeParse = d3.timeParse("%H:%M");

function mapFunction(d){
  d.time = timeParse(d.time);
  console.log(d.time);
  return timeParse(d.time);
}

function transformData(dataToTransform){

let timeCorrected = dataToTransform.map(mapFunction);
return dataToTransform;
}

//load json

d3.json('data.json').then(gotData);

function gotData(incomingdata){
  console.log(incomingdata);
  let transformedData = transformData(incomingdata);
console.log(transformedData);

function getTime(d){
  return d.time;
}

let minimumT = d3.min(transformedData,getTime);
let maximumT = d3.max(transformedData,getTime);

let padding = 40;
let timeScale = d3.scaleTime().domain([minimumT,maximumT]).range([5-padding/2,boxHeight-4.5*padding]);

  // console.log(incomingdata);
  let datagroup = viz.selectAll('.datagroup').data(transformedData).enter()
  .append('g')
  .attr('class','datagroup')
    .attr('transform',groupPosition)

  //d
  datagroup
  .append('circle')
  .attr('fill', topicColor)
  .attr('cx',xLocation)
  .attr('cy',yLocation)
  .attr('r',radius)


let symbol = viz.selectAll('.symbol').data(transformedData).enter()
.append('g')
    .attr('transform',groupPosition)

symbol
.attr('class','symbol')
    	.append('rect')
      .attr("x", xLocation)
      .attr("y",yLocation)
      .attr('width',15)
      .attr('height',15)
      .style('fill',mediumColor)
       .attr('transform',mediumPosition)
    	;


function xLocation(d,i){
  let indexX = getGroup(d);

  return indexX*150+(d.level-3)*30;
}

function yLocation(d,i){
  let indexY = getGroup(d);
let ballH = 600;

let yScale = d3.scaleLinear().domain([0,ballH]).range([0,ballH/3]);
let y = yScale(i*10)
  return y+Math.abs(indexY-4)*100;
}

}
function groupPosition(){
  return 'translate(0,'+paddingY+')';
}

function getGroup(d){
  let group;

  if(d.topic == 'design&art'){
    group =4;
  }
  else if(d.topic == 'news'){
    group =5;
  }else if(d.topic == 'entertainment'){
    group =3;
  }else if(d.topic == 'culture'){
    group =1;
  }else if(d.topic == 'business'){
    group =2;
  }
  else if(d.topic == 'personal'){
  group =6;
  }
  else if(d.topic == 'tech'){
  group =7;
  }

  return group;

}

//function gotdata end

function symbolType(d,i){
  let symbolGenerator = d3.symbol()
  	.size(100);

    symbolGenerator.type(d3.symbolCircle);
      console.log(hs[d.howmedium]);
    return symbolGenerator();
}

function radius(d,i){

  return d.level*3+6;
  //5*Math.round(1+5*Math.random(10,25));//random-return(0,1)
}

function mediumPosition(d,i){

  return 'translate(-9,9)';
}

function mediumColor(d,i){
  let c = hc[d.howmedium];
  return c.toString();
}

function topicColor(d,i){
  console.log(i,d.topic,tc[d.topic]);
  return tc[d.topic];
}
