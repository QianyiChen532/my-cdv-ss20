let w = 600;
let h = 400;

let viz = d3.select('#vizwrapper').append('svg')
.attr('width',600)
.attr('height',400)
.attr('fill','black')
.attr('class','viz')
;

let xScale = d3.scaleLinear().domain([0,100]).range([0,w])
let yScale = d3.scaleLinear().domain([0,100]).range([0,h])
let rScale = d3.scaleLinear().domain([0,100]).range([10,h/2])

let data = [[50,50,60]];

let graphGroup = viz.append('g').attr('class','graphGroup');





function updateGraph(){
	let elements = graphGroup.selectAll('.datapoint').data(data)

	let entering = elements.enter()

	entering
	.attr('class','datapoint')
	.append('circle')
	.attr('cx',function(d,i){
		let x = d[0];
		return xScale(x)
	})
	.attr('cy',function(d,i){
		let y = d[i];
		return yScale(y)
	})
	.attr('r',function(d,i){
		let r = d[2];
		return rScale(r)
	})
	.attr('fill','lightblue')
	;

	let exiting = elements.exit();
}

updateGraph();

d3.select('#left').on('click',function(d,i){
	data = [[0,0,60]];
	let elements = graphGroup.selectAll('.datapoint').data(data);

	elements
	.transition()
	.attr('cx',function(d,i){
		let x = d[0];
		return xScale(x)
	})
	// .attr('cy',function(d,i){
	// 	let y = d[i];
	// 	return yScale(y)
	// })
	// .attr('r',,function(d,i){
	// 	let r = d[2];
	// 	return rScale(r)
	// })
	// .attr('fill',lightblue')
	;
})
