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

//how color
let hc = {
'talking':'#ffdf3b',
'wechat/weibo':'#4caf50',
'phonecall/meeting':'#03a9f4',
'video/website':'#f44336'
}

let viz = d3.select('#viz-container')
  .append('svg')
    .attr('id','viz')//whatever element put here,even 'hello'
;
//load json

d3.json('data.json').then(gotData);

function gotData(incomingdata){


  let date = viz.selectAll('dateData').data(incomingdata).enter()

//d
date
  .append('rect')
    .attr('fill', 'grey')
    .attr('x',xLocation)
    .attr('y',yLocation)
    .attr('width',200)
    .attr('height',200)
    .attr('id','date')
    ;
console.log(incomingdata);
}

function xLocation(d){

  return d.date*120;
}
function yLocation(d){
    return 100+(d.date % 2)*300;
}

// function gotData()
//
// function xLocation(datapoint){
//   return datapoint * 40;
// }
//
// viz.selectAll('circle').data(myData).enter()
// //selectAll()--empty object?(select nothing)  data()--bind data, enter-selection
// //the text in selectAll
//   .append('circle')
//     .attr('cx',xLocation)//without () means just passing a reference to it
//     .attr('cy',188)
//     .attr('r',30)//apply to each one, =loop
// ;
//
// viz.selectAll('rect').data(myData).enter()
// //selectAll()--empty object?(select nothing)  data()--bind data, enter-selection
//   .append('line')
//     .attr('x1',20)
//     .attr('x2',188)
//     .attr('y1',40)
//     .attr('y2',40)
//     .attr('stroke-width',4)
//     .attr('stroke','black')//apply to each one, =loop
// ;
// // let type = [];
// // let color = [];
// //
// // function chooseColor(){
// //   if (==type[i]){
// //     fill color[i]
// //   }
// // }
//
// //symbol
// var symbolGenerator = d3.symbol()
// 	.size(100);
//
// var symbolTypes = ['symbolCircle', 'symbolCross', 'symbolDiamond', 'symbolStar'];
//
// var xScale = d3.scaleLinear().domain([0, symbolTypes.length - 1]).range([0, 700]);
//
// d3.select('g')
// 	.selectAll('path')
// 	.data(symbolTypes)
// 	.enter()
// 	.append('path')
// 	.attr('transform', function(d, i) {
// 		return 'translate(' + xScale(i) + ', 0)';
// 	})
// 	.attr('d', function(d) {
// 		symbolGenerator
// 			.type(d3[d]);
//
// 		return symbolGenerator();
// 	});
//
// d3.select('g')
// 	.selectAll('text')
// 	.data(symbolTypes)
// 	.enter()
// 	.append('text')
// 	.attr('transform', function(d, i) {
// 		return 'translate(' + xScale(i) + ', 40)';
// 	})
// 	.text(function(d) {
// 		return 'd3.' + d;
// 	});
