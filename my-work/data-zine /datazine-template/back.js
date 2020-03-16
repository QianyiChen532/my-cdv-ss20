console.log('js');

const canvasWidth = 1200;
const canvasHeight = 800;
const paddingX = 30;
const paddingY = 20;

let vizWidth = canvasWidth-2*paddingX;
let vizHeight = canvasHeight-2*paddingY;

//7 boxes for 7 days in a week
let boxGap = 100;
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


function textGroupPosition(){
  let px= paddingX+80;
  let py = 320;
  return 'translate('+px+','+py+')';
}

//filter timescale
let timeParse = d3.timeParse("%H:%M");

function mapFunction(d){
  d.time = timeParse(d.time);
  return timeParse(d.time);
}

function transformData(dataToTransform){

  let timeCorrected = dataToTransform.map(mapFunction);
  return dataToTransform;
}

//load json

d3.json('data.json').then(gotData);

function gotData(incomingdata){
  // console.log(incomingdata);
  let transformedData = transformData(incomingdata);
  // console.log(transformedData);

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

//7tag for 7topics
  for (let i = 0;i<7;i++){
    viz
    .append('g')
    .append('rect')
    .attr('x',i*150)
    .attr('y',Math.abs(i-3)*50)//Math.abs(i-3)*50
    .attr('width',boxWidth)
    .attr('height',boxHeight/4)//boxHeight-paddingY*3
    .style('fill','#d8cac13d')
      .attr('transform',textGroupPosition)
    ;
//i=group index
  }

  let label = viz.selectAll('.label').data(transformedData).enter()
  .append('g')
  .attr('class','label')
  .attr('transform',textGroupPosition)
  ;

  label
  .append('text')
  .text(getLabel)
  .attr('x',xLocationLabel)
  .attr('y',yLocationLabel)
  .style('fill',topicColor)
  .style("fill", "black")
    .style("writing-mode", "tb")
    .style("glyph-orientation-vertical", 0)
    .style('font-family','monospace')

  function xLocationLabel(d,i){
    let indexXforLabbel = getGroup(d)-1;

    return indexXforLabbel*150;
  }

  function yLocationLabel(d,i){
    let indexYforLabbel = getGroup(d)-1;

    return Math.abs(indexYforLabbel-3)*50+50;
  }

  function getLabel(d){

  let topic = d.topic;
  let num = d.topic.length;

    return num + ' messages about '+topic+' '
    //how to clean up repetition

    // let labeled = [0,0,0,0,0,0,0];
    // let indexforLabel = getGroup(d)-1;
    // console.log(labeled);
    // if(labeled[indexforLabel] = 0){
    //   labeled[indexforLabel] = 1;
    //   return d.topic;
    // }else {
    //   return
    // }
  }



  //d
  // datagroup
  // .append('circle')
  // .attr('fill', topicColor)
  // .attr('cx',xLocation)
  // .attr('cy',yLocation)
  // .attr('r',radius)


  // let symbol = viz.selectAll('.symbol').data(transformedData).enter()
  // .append('g')
  //     .attr('transform',groupPosition)
  //
  // symbol
  // .attr('class','symbol')
  //     	.append('rect')
  //       .attr("x", xLocation)
  //       .attr("y",yLocation)
  //       .attr('width',15)
  //       .attr('height',15)
  //       .style('fill',mediumColor)
  //        .attr('transform',mediumPosition)
  //     	;

  let byTopic = d3.group(incomingdata, d=> d.topic)

  let news = viz.selectAll('.news').data(byTopic.get('news')).enter()

  .append('g')
  .attr('class','news')
  .append('circle')
  .attr('cx',xLocationByTopic)
  .attr('cy',yLocationByTopic)
  .attr('r',radius)
  .style('stroke',function(d){return hc[d.howmedium];})
  .style('fill',topicColor)
  .attr('transform',mediumPosition)
  //
  // let text = viz.selectAll('.text').data(byTopic.get('news')).enter()
  // .append('g')
  // .append('text')
  // .attr('class','text')
  // .style('fill','black')
  // .attr('x',xLocationByTopic)
  // .attr('y',yLocationByTopic)
  // .text(function(d,i){ return i;})
  //
  // .attr('transform',mediumPosition)

  let art = viz.selectAll('.art').data(byTopic.get('design&art')).enter()

  .append('g')
  .attr('class','art')
  .append('circle')
  .attr('cx',xLocationByTopic)
  .attr('cy',yLocationByTopic)
  .attr('r',radius)
  .style('stroke',function(d){return hc[d.howmedium];})
  .style('fill',topicColor)
  .attr('transform',mediumPosition)

  let entertainment = viz.selectAll('.entertainment').data(byTopic.get('entertainment')).enter()

  .append('g')
  .attr('class','entertainment')
  .append('circle')
  .attr('cx',xLocationByTopic)
  .attr('cy',yLocationByTopic)
  .attr('r',radius)
  .style('stroke',function(d){return hc[d.howmedium];})
  .style('fill',topicColor)
  .attr('transform',mediumPosition)

  let personal = viz.selectAll('.personal').data(byTopic.get('personal')).enter()

  .append('g')
  .attr('class','personal')
  .append('circle')
  .attr('cx',xLocationByTopic)
  .attr('cy',yLocationByTopic)
  .attr('r',radius)
  .style('stroke',function(d){return hc[d.howmedium];})
  .style('fill',topicColor)
  .attr('transform',mediumPosition)

  let culture = viz.selectAll('.culture').data(byTopic.get('culture')).enter()

  .append('g')
  .attr('class','culture')
  .append('circle')
  .attr('cx',xLocationByTopic)
  .attr('cy',yLocationByTopic)
  .attr('r',radius)
  .style('stroke',function(d){return hc[d.howmedium];})
  .style('fill',topicColor)
  .attr('transform',mediumPosition)

  let tech = viz.selectAll('.tech').data(byTopic.get('tech')).enter()

  .append('g')
  .attr('class','tech')
  .append('circle')
  .attr('cx',xLocationByTopic)
  .attr('cy',yLocationByTopic)
  .attr('r',radius)
  .style('stroke',function(d){return hc[d.howmedium];})
  .style('fill',topicColor)
  .attr('transform',mediumPosition)

  let business = viz.selectAll('.business').data(byTopic.get('business')).enter()

  .append('g')
  .attr('class','business')
  .append('circle')
  .attr('cx',xLocationByTopic)
  .attr('cy',yLocationByTopic)
  .attr('r',radius)
  .style('stroke',function(d){return hc[d.howmedium];})
  .style('fill',topicColor)
  .attr('transform',mediumPosition)


  function xLocationByTopic(d,i){
    let indexX = getGroup(d);
    return (indexX-1)*150+(i+1)%4*30;
  }

  function yLocationByTopic(d,i){
    let indexY = getGroup(d);
    let ballH = 600;

    let yScale = d3.scaleLinear().domain([0,800]).range([0,ballH]);
    let y = yScale(i*20)
    let ycord = y+Math.abs(indexY-4)*100;
    return ycord;
    //Math.floor((i+4)/4)*50;
  }

}
function groupPosition(){
  return 'translate(0,'+paddingY+')';
}

function getGroup(d){
  let group;
  let groupIndex;

  if(d.topic == 'design&art'){
    group =5;
  }
  else if(d.topic == 'news'){
    group =4;
  }else if(d.topic == 'entertainment'){
    group =7;
  }else if(d.topic == 'culture'){
    group =1;
  }else if(d.topic == 'business'){
    group =2;
  }
  else if(d.topic == 'personal'){
    group =6;
  }
  else if(d.topic == 'tech'){
    group =3;
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

  return 'translate(100,60)';
}

function mediumColor(d,i){
  let c = hc[d.howmedium];
  return c.toString();
}

function topicColor(d,i){

  return tc[d.topic];
}
