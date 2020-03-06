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

let div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

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
// console.log('1');
  let date = viz.selectAll('date').data(incomingdata).enter()

//d
date
  .append('circle')
    .attr('fill', function(d){return tc[d.topic];})
    .attr('cx',xLocation)
    .attr('cy',yLocation)
    .attr('r',10)



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

  // let h = viz.selectAll('.how').data(incomingdata.how).enter()

// let dots = viz.selectAll(".circle").data(incomingdata).enter()
//
// function connection(d){
//   dots
//     .filter(function(d) { return d.howmedium ==  })
//         .style("fill", "red")
//         .attr("r", 3.5)
//         .attr("cx", function(d) { return x(d.date); })
//         .attr("cy", function(d) { return y(d.close); });
// }
  // h
  // .append('text')
  //   .attr('x',i*150+340)
  //   .attr('y',240)
  //   .attr('font-size',15)
  //   .attr('fill','white')
  //   .attr('z-index',1)
  //   .text(how[i])

}

function xLocation(d){
  return d.no*30;
}
function yLocation(d){
    return 70+(d.date % 2)*300;
}
