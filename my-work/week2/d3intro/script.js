console.log('js');

//regradless of the data
let viz = d3.select('#viz-container')
  .append('svg')
    .attr('id','viz')//whatever element put here,even 'hello'
    .attr('width',600)
    .attr('height',600)
;

//load the data, and do things with the data

d3.json('data.json').then(gotData);

function gotData(incomingData){
  
}
