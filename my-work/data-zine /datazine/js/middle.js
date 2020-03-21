console.log('js');

const canvasWidth = 2400;
const canvasHeight = 800;
const paddingX = 100;
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
  'personal':'#ff071763',
  'design&art':'#ff98009c',
  'tech':'#a6cadca3',
  'entertainment':'#e91e1eba',
  'business':'#5e82acc9',
  'culture':'#dda1b2db'
}

let how = ['talking','wechat/weibo','phonecall/meeting','video/website'];
//how color
let fc = {
  'family':'#192d69bd',
  'friends':'#ffc100bd',
  'class':'#70b2e4b5',
  'teammate':'#e9591e94'
}

// let hc = {
//   'talking':'#192d69bd',
//   'wechat/weibo':'#ffc100bd',
//   'phone call/meeting':'#70b2e4b5',
//   'video/website':'#e9591e94'
// }

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

let tag = ['Monday','Tuesday','Wednesday','Thursday', 'Friday','Saturday', 'Sunday'];

for (let i = 0;i<7;i++){
  viz
  .append('rect')
  .attr('x',i*boxWidth + i * boxGap)
  .attr('y',0)
  .attr('width',boxWidth)
  .attr('height',boxHeight-paddingY*3)
  .style('fill','#d8cac13d')
  .append('g')
    .attr('transform',groupPosition)
  ;

  viz
  .append('text')
  .text(tag[i])
  .attr('x',i*boxWidth + i * boxGap+boxWidth/2-20)
  .attr('y', canvasHeight - paddingY*5)
  .style('font-family','Muli')
  .style('fill','burlywood')
  .append('g')
    .attr('transform',groupPosition)

  ;

}

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

  datagroup
  .append('circle')
  .attr('fill', topicColor)
  .attr('cx',xLocation)
  .attr('cy',yLocation)
  .attr('r',radius)

let text = viz.selectAll('.text').data(transformedData).enter()
.append('g')
    .attr('transform',groupPosition)

text
.attr('class','text')
  .append('text')
  .style("fill", "black")
    .style("writing-mode", "tb")
    .style("glyph-orientation-vertical", 0)
    .style('font-family','monospace')
    .attr("x", xLocation)
    .attr("y",yLocation)
    .text(function(d){ return d.topic;})

let symbol = viz.selectAll('.symbol').data(transformedData).enter()
.append('g')
.attr('class','symbol')
    .attr('transform',groupPosition)

symbol
    	.append('path')
      .attr("x", 0)
      .attr("y",0)
      .style('fill',fromColor)
      .attr('d',symbolType)
       .attr('transform',sybomlPosition)
       // .attr('transform',mediumPosition)
    	;

  function sybomlPosition(d,i){
    let len = d.topic.length*9;
    // return 'translate(-9,'+len*8+')';

    let x = (d.weekday-1)*boxWidth + (d.weekday-1) * boxGap;

    if(d.date<=7){
      weekNum = 1;
    }
    else{
      weekNum = 2;
    }
    let margin = -50;
    let xCor = margin+x+(weekNum % 2)*boxWidth/3+i%5*21-2;

    if(d.date<=7){
        weekNum = 1;
    }
    else{
        weekNum = 2;
    }

    let y = timeScale(d.time)+len;
    // console.log(y);

    return 'translate('+xCor+','+y+')';


  }

  let yAxisGroup = viz.append('g').attr('class','yAxis')
  .attr('transform',groupPosition);
    let yAxis = d3.axisLeft(timeScale);
    yAxisGroup.call(yAxis);//要call才会出现 类似show





function xLocation(d,i){
  console.log(d);
  let x = (d.weekday-1)*boxWidth + (d.weekday-1) * boxGap;

  if(d.date<=7){
    weekNum = 1;
  }
  else{
    weekNum = 2;
  }
  let margin = -50;
  let xCor = margin+x+(weekNum % 2)*boxWidth/3+i%5*21;
  return xCor;
}
function yLocation(d,i){
  if(d.date<=7){
      weekNum = 1;
  }
  else{
      weekNum = 2;
  }

  let y = timeScale(d.time);
  // console.log(y);

  return y;
  //boxHeight/4*timeperiod+(weekNum % 2)*5-i%5*25;
}
}

function groupPosition(){
  return 'translate('+paddingX+','+paddingY+')';
}

function symbolType(d,i){

  let symbolGenerator = d3.symbol()
  	.size(100);

    if(d.howmedium == 'talking'){
        symbolGenerator.type(d3.symbolTriangle);
    }
    if(d.howmedium == 'wechat/weibo'){
        symbolGenerator.type(d3.symbolSquare);
    }
    if(d.howmedium == 'phone call/meeting'){
        symbolGenerator.type(d3.symbolDiamond);
    }
    if(d.howmedium == 'video/website'){
        symbolGenerator.type(d3.symbolStar);
    }

    // symbolGenerator.type(d3.symbolStar);
    //   console.log(hs[d.howmedium]);
    return symbolGenerator();
}

function radius(d,i){

  return d.level*3+6;
  //5*Math.round(1+5*Math.random(10,25));//random-return(0,1)
}

function mediumPosition(d,i){
  let len = d.topic.length;
  return 'translate(-9,'+len*8+')';
}

function fromColor(d,i){
  let c = fc[d.from];

  return c.toString();
}

function topicColor(d,i){
  console.log(i,d.topic,tc[d.topic]);
  return tc[d.topic];
}

//svg
// let hexagon =
// <svg>
// <path d="M933.12 490.666667l-192-332.373334a42.666667 42.666667 0 0 0-37.12-21.333333h-384a42.666667 42.666667 0 0 0-37.12 21.333333l-192 332.373334a42.666667 42.666667 0 0 0 0 42.666666l192 332.373334a42.666667 42.666667 0 0 0 37.12 21.333333h384a42.666667 42.666667 0 0 0 37.12-21.333333l192-332.373334a42.666667 42.666667 0 0 0 0-42.666666z m-256 311.04H344.746667L177.066667 512l167.68-289.706667h334.506666L846.933333 512z" p-id="10217"></path></svg>
//
// let star =
// <svg>
// <path d="M17.684,7.925l-5.131-0.67L10.329,2.57c-0.131-0.275-0.527-0.275-0.658,0L7.447,7.255l-5.131,0.67C2.014,7.964,1.892,8.333,2.113,8.54l3.76,3.568L4.924,17.21c-0.056,0.297,0.261,0.525,0.533,0.379L10,15.109l4.543,2.479c0.273,0.153,0.587-0.089,0.533-0.379l-0.949-5.103l3.76-3.568C18.108,8.333,17.986,7.964,17.684,7.925 M13.481,11.723c-0.089,0.083-0.129,0.205-0.105,0.324l0.848,4.547l-4.047-2.208c-0.055-0.03-0.116-0.045-0.176-0.045s-0.122,0.015-0.176,0.045l-4.047,2.208l0.847-4.547c0.023-0.119-0.016-0.241-0.105-0.324L3.162,8.54L7.74,7.941c0.124-0.016,0.229-0.093,0.282-0.203L10,3.568l1.978,4.17c0.053,0.11,0.158,0.187,0.282,0.203l4.578,0.598L13.481,11.723z"></path>
// </svg>
//
// let diamond=
// <svg t="1584280332086" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5828" width="200" height="200"><path d="M511.9233084 148.91700253l363.00630586 363.00630587-363.00630586 363.00630586-363.00630587-363.00630586 363.00630586-363.00630586m1e-8-86.91700254l-449.9233084 449.92330839 449.9233084 449.92330841 449.9233084-449.92330841-449.92330841-449.92330839z" fill="#000000" p-id="5829"></path></svg>
//
// let web =
// <svg t="1584280408027" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6658" width="200" height="200"><path d="M519.662933 955.7504h-13.636266c-119.808-1.774933-223.402667-45.6704-308.1728-130.4576-25.668267-25.685333-47.5648-53.0432-65.041067-81.390933l-0.170667-0.290134a112.059733 112.059733 0 0 1-3.8912-6.0416C88.610133 670.890667 68.266667 594.9952 68.266667 512c0-81.646933 19.677867-156.3136 58.5216-221.986133 0.6144-1.570133 1.4336-3.054933 2.474666-4.4544l2.2016-3.771734a445.44 445.44 0 0 1 66.389334-83.950933C282.658133 113.629867 386.218667 70.0416 505.719467 68.266667H519.662933c0.034133-0.068267 0.187733 0 0.3072 0 118.391467 1.774933 221.1328 45.3632 305.339734 129.5872a475.989333 475.989333 0 0 1 66.781866 83.182933l0.170667 0.273067 0.221867 0.3584 2.747733 4.727466C935.389867 353.109333 955.733333 429.0048 955.733333 512c0 82.397867-20.053333 157.696-59.579733 223.7952a125.559467 125.559467 0 0 0-2.901333 5.085867 451.464533 451.464533 0 0 1-68.061867 84.5312c-84.053333 84.6336-186.7776 128.546133-305.186133 130.338133h-0.341334z m-193.194666-204.4416a466.773333 466.773333 0 0 0 26.248533 53.418667c41.198933 71.338667 88.098133 109.397333 143.069867 115.985066v-169.745066l-169.3184 0.341333z m203.451733-0.4096v169.796267c53.316267-6.792533 100.829867-45.7728 141.380267-116.002134a496.0768 496.0768 0 0 0 26.7776-54.152533l-168.157867 0.3584z m205.056-0.426667a538.709333 538.709333 0 0 1-34.0992 71.2704c-19.0464 32.989867-39.7312 59.938133-61.986133 80.810667 60.091733-19.3024 114.3808-53.179733 162.218666-101.341867a431.752533 431.752533 0 0 0 44.6464-51.012266l-110.779733 0.273066z m-555.707733 1.2288a432.469333 432.469333 0 0 0 42.7008 49.4592c48.059733 48.059733 102.673067 81.902933 163.208533 101.239467-22.357333-20.855467-43.0592-47.752533-62.0544-80.64a503.0912 503.0912 0 0 1-33.3824-70.365867l-110.472533 0.3072zM102.7072 529.066667c2.542933 69.085867 20.6336 132.437333 53.879467 188.552533l121.4976-0.324267c-17.7152-57.002667-27.357867-120.1664-28.740267-188.228266H102.7072z m180.770133 0c1.450667 68.642133 11.6736 131.84 30.429867 188.125866l181.879467-0.3584V529.066667H283.477333z m246.442667 0v187.6992l181.009067-0.3584c18.773333-55.808 28.9792-118.7328 30.429866-187.3408H529.92z m245.589333 0c-1.3824 67.908267-11.008 130.730667-28.672 187.2384l121.344-0.3072c32.750933-55.637333 50.568533-118.408533 53.077334-186.9312h-145.749334z m0-34.133334h145.7664c-2.525867-68.744533-20.462933-131.805867-53.4016-187.733333h-120.968533c17.646933 56.8832 27.221333 119.876267 28.603733 187.733333z m-245.589333 0h211.456c-1.4336-68.4544-11.6224-131.515733-30.293333-187.733333H529.92v187.733333z m-246.442667 0h212.309334V307.2H313.2416c-18.363733 55.876267-28.347733 118.9376-29.764267 187.733333zM102.724267 494.933333h146.619733c1.348267-68.1472 10.769067-131.140267 28.091733-187.733333H156.279467c-33.041067 55.808-51.029333 118.869333-53.5552 187.733333z m208.0256-186.333866zM734.702933 273.066667h110.6432a458.325333 458.325333 0 0 0-44.1856-51.080534c-47.735467-47.735467-101.905067-81.322667-161.8944-100.522666 22.101333 20.667733 42.6496 47.3088 61.576534 79.872A500.974933 500.974933 0 0 1 734.702933 273.066667zM529.92 273.066667h168.0896a461.482667 461.482667 0 0 0-26.692267-54.647467c-40.516267-69.666133-88.046933-108.356267-141.380266-115.0976V273.066667z m-203.9296 0h169.796267V103.2704c-54.9888 6.5536-101.905067 44.373333-143.121067 115.217067A467.012267 467.012267 0 0 0 325.9904 273.066667z m-147.797333 0h111.104a501.469867 501.469867 0 0 1 33.809066-71.645867c18.926933-32.546133 39.543467-59.1872 61.7984-79.854933-60.416 19.217067-114.944 52.7872-162.9696 100.471466A425.813333 425.813333 0 0 0 178.193067 273.066667z" p-id="6659"></path></svg>
