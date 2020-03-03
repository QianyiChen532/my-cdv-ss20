console.log('js');

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

//how button
for(let i = 0; i<how.length;i++){
  viz
    .append('rect')
      .attr('x',i*150+320)
      .attr('y',220)
      .attr('width',130)
      .attr('height',30)
      .attr('fill',hc[how[i]])
      .attr('class','how')
      // .on('mouseover',connection)

  viz
      .append('text')
        .attr('x',i*150+340)
        .attr('y',240)
        .attr('font-size',15)
        .attr('fill','white')
        .attr('z-index',1)
        .text(how[i])

}

//load json

d3.json('data.json').then(gotData);

function gotData(incomingdata){
console.log('1');
  let date = viz.selectAll('date').data(incomingdata).enter()

//d
date
  .append('circle')
    .attr('fill', function(d){return tc[d.topic];})
    .attr('cx',xLocation)
    .attr('cy',yLocation)
    .attr('r',10)
    .attr('opacity')
    // .attr('class',function(d){return (d.from).toString();})
    // .on('mouseover',info)
    ;

  let h = viz.selectAll('.how').data(incomingdata.how).enter()

  h
  .append('text')
    .attr('x',i*150+340)
    .attr('y',240)
    .attr('font-size',15)
    .attr('fill','white')
    .attr('z-index',1)
    .text(how[i])

}

function xLocation(d){
  return d.no*30;
}
function yLocation(d){
    return 70+(d.date % 2)*300;
}

function connection(d){
  svg.selectAll("dot")
        .data(data)
    .enter().append("circle")
    .filter(function(d) { return d.close < 400 })
        .style("fill", "red")
        .attr("r", 3.5)
        .attr("cx", function(d) { return x(d.date); })
        .attr("cy", function(d) { return y(d.close); });
}

let symbolGenerator = d3.symbol()
	.size(100);

var symbolTypes = ['symbolCircle', 'symbolCross', 'symbolDiamond', 'symbolSquare', 'symbolStar', 'symbolTriangle', 'symbolWye'];

var xScale = d3.scaleLinear().domain([0, symbolTypes.length - 1]).range([0, 700]);


//
// date
// 	.append('path')
// 	.attr('transform', function(d, i) {
// 		return 'translate(' + xScale(i) + ', 0)';
// 	})
// 	.attr('d', function(d) {
// 		symbolGenerator
// 			.type(d3[d]);
// 		return symbolGenerator();
// 	});

//
// //symbol

//
