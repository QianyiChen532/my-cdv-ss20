let w = 900;
let h = 500;

let viz = d3.select("#container")
  .append("svg")
    .style("width", w)
    .style("height", h)
    .style("outline", "solid black")
;

let data = [
  [
    [0,   100],
    [300, 400],
    [600, 300],
    [900, 350]
  ],
  [
    [0,   300],
    [230, 350],
    [900, 90 ]
  ]
]


let graphGroup = viz.append("g").attr("class", "graphGroup");
let lineMaker = d3.line();
//
// function lineFunction(d,i){
//   console.log(d);
//
//   let dataString = '';
//   for (let i = 0;i<d.length;i++){
//     if(i == 0){
//       dataString +='M';
//     }else{
//       dataString +='L';
//     }
//
//     dataString += d[i].join(' ');
//   }
//   console.log(dataString);
//   return dataString;
// }
//do the same as d3.line()

graphGroup.selectAll('.line').data(data).enter()
  .append('path')
  .attr('d',lineMaker)
  .attr('fill','none')
  .attr('stroke','black')
  .attr('stroke-width',5)
