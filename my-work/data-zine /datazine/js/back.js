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
  'personal':'#ff071763',
  'design&art':'#ff98009c',
  'tech':'#a6cadca3',
  'entertainment':'#e91e1eba',
  'business':'#5e82acc9',
  'culture':'#dda1b2db'
}

let ti = {
  3:'news',
  5:'personal',
  4:'design&art',
  2:'tech',
  6:'entertainment',
  1:'business',
  0:'culture'
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

function groupPosition(){
  let pdY = paddingY+100;
  return 'translate(0,'+pdY+')';
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


  function xLocationByTopic(d,i,j){

    let indexX = getGroup(d);
    return (indexX-1)*150+(i+1)%4*30;
  }

  function yLocationByTopic(d,i){
    let indexY = getGroup(d);
    let ballH = 600;

    let yScale = d3.scaleLinear().domain([0,900]).range([0,vizHeight-Math.abs(indexY-4)*80]);

    let ycord = i%7*20+i%13*27+i+Math.abs(indexY-4)*100;
    let y = yScale(ycord);
    // console.log(y,vizHeight-Math.abs(indexY-4)*50);
    return y;
    //Math.floor((i+4)/4)*50;
  }


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

  let ti = {
    3:'news',
    5:'personal',
    4:'design&art',
    2:'tech',
    6:'entertainment',
    1:'business',
    0:'culture'
  }

  // deal with text here
 let topic = ['culture','business','tech','news','design&art','personal','entertainment']
 let allLabels = viz.append("g").attr("class", "allLabels");

 function getLabel(d, i){
   return d;
 }
 function getNumber(d, i){
   return byTopic.get(d).length;
 }
 let labelGroups = allLabels.selectAll(".label").data(topic).enter()
   .append("g")
   .attr("class", "label")
 ;
 function tranlateLabelGroup(d, i) {

   let x = i*150+80+paddingX;
   let y = 550;
   return "translate("+x+", "+y+")"
 }

 labelGroups.attr("transform", tranlateLabelGroup)

 labelGroups
   .append("text")
   .style('fill',textColor)
     .text(getNumber)
     .attr("y", 0)
 ;
 labelGroups
   .append("text")
   .style('fill',textColor)
     .text(getLabel)
     .attr("y", 40)
 ;
 labelGroups
   .append("text")
    .style('fill',textColor)
     .text("messages about")
     .attr("y", 20)
 ;

}

function textColor(d){
  return tc[d];
}

function textGroupPosition(){
  let px= paddingX+180;
  let py = paddingY+180;
  return 'translate('+px+','+py+')';
}

function xLocationLabel(d,i){
  let indexXforLabbel = getGroup(d)-1;

  return indexXforLabbel*120+50;
}

function yLocationLabel(d,i){
  let indexYforLabbel = getGroup(d)-1;

  return Math.abs(indexYforLabbel-3)*90+80;
}



function getGroup(d){
  let group;

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

function radius(d,i){
  return d.level*3.5+6;
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
