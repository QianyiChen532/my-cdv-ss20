// set the dimensions and margins of the graph
let margin = {top: 10, right: 30, bottom: 40, left: 100};

let w1 = 450;
let h1 = 450;
let paddingX1 = 20;

let category_color = {
  'exercise':'#a8acd3',
  'bonding':'#a2cae0',
  'nature':'#b9d28f',
  'leisure':'#a2cebb',
  'achievement':'#f2cfb7',
  'affection':'#f2c3c0',
  'enjoy_the_moment':'#f88776'
}


let treemapSvg = d3.select(".svg-container1")
  .append("svg")
  .attr('width',600)
  .attr('height',h1)
;

let categorynumGroup = treemapSvg.append("g")
  .attr("transform",
        "translate(" +50 + "," + 100 + ")")
  .attr('class','treemap')
  ;

let chartSvg = d3.select(".svg-container2")
  .append("svg")
  .attr('width',600)
  .attr('height',h1)
;

let subjectnumGroup = chartSvg.append("g")
  .attr("transform",
        "translate(" + 100 + "," + 100 + ")");

let chartSvg2 = d3.select("section")
  .append("svg")
  .attr('width',600)
;

let subjectDetailGroup = chartSvg2.append("g")
  .attr("transform",
        "translate(" + 20 + "," + 10 + ")");


//load data
d3.csv("data/merged-filter.csv").then(function(fullData){
  d3.csv("data/category-count.csv").then(function(categoryData){
    d3.csv("data/subject-count.csv").then(function(subjectData){

console.log(fullData);


//----------deal with treemap of category-------//
categoryData = categoryData.map(function(d){
  d.num = Number(d.num);
  return d;
})

let maxCategory = d3.max(categoryData,function(d){
  return d.num;
})


let root = d3.stratify()
   .id(function(d) { return d.category; })
   .parentId(function(d) { return d.parent; })
   (categoryData);
  root.sum(function(d) { return +d.num })


 d3.treemap()
   .size([w1,h1])
   .padding(4)
   (root)

console.log(root.leaves())
 // use this information to add rectangles:
categorynumGroup
   .selectAll("rect")
   .data(root.leaves())
   .enter()
   .append("rect")
     .attr('x', function (d) { return d.x0; })
     .attr('y', function (d) { return d.y0; })
     .attr('width', function (d) { return d.x1 - d.x0; })
     .attr('height', function (d) { return d.y1 - d.y0; })
     .style("fill", "#69b3a2");

 // and to add the text labels
categorynumGroup
   .selectAll("text")
   .data(root.leaves())
   .enter()
   .append("text")
     .attr("x", function(d){ return d.x0+10})
     .attr("y", function(d){ return d.y0+20})
     .text(function(d){ return d.data.category})
     .attr("font-size", "15px")
     .attr("fill", "white")
;

//---subject,lolipop chart
let subjects = subjectData.map(function(d) {
    return d.subject;
  });

//Y axis
let ySubject = d3.scaleBand()
  .range([ 0, h1])
  .domain(subjects)
  .padding(1);


subjectData = subjectData.map(function(d){
  d.num = Number(d.num);
  return d;
})

let maxSubject = d3.max(subjectData,function(d){
  return d.num;
})
let xSubject = d3.scaleLinear()
  .domain([0,maxSubject])
  .range([ 0, w1-paddingX1*2]);

let xAxisSubject = d3.axisBottom(xSubject);

let xAxisGroupSubject = subjectnumGroup.append("g").attr("class", "axis axis--x");

  xAxisGroupSubject
    .attr('transform','translate(0,'+-10+')')
    .style("stroke-dasharray",("3,3"))
    .call(xAxisSubject)
  ;

let yAxisSubject = d3.axisLeft(ySubject);

let yAxisGroupSubject = subjectnumGroup.append("g").attr("class", "axis axis--y");

  yAxisGroupSubject
    .attr("class","axis axis--y")
    .style("stroke-dasharray",("3,3"))
    .call(yAxisSubject);

// Lines
subjectnumGroup.selectAll("myline")
  .data(subjectData)
  .enter()
  .append("line")
    .attr("x1", function(d) { return xSubject(d.num);  })
    .attr("x2", xSubject(0))
    .attr("y1", function(d) { return ySubject(d.subject);  })
    .attr("y2", function(d) { return ySubject(d.subject);  })
    .attr("stroke", "grey")
;

// Circles
subjectnumGroup.selectAll("circle")
  .data(subjectData)
  .enter()
  .append("circle")
    .attr("cx", function(d) { return xSubject(d.num); })
    .attr("cy", function(d) { return ySubject(d.subject); })
    .attr("r", "7")
    .style("fill", "#69b3a2")
    .attr("stroke", "black")
;

//----------subject detail version--------
fullData = fullData.filter(function(d,i){
    if(d.modified == 'TRUE'){
      return true;
    }else{
      return false;
    }
    if(d.num_sentence<20){
      return true;
    }else{
      return false;
    }
})

subjectDetailGroup.data(fullData)
  .enter()
  .append('text')
  .text(function(d){
    if(d.daughterson == 'TRUE'){
      return d.cleaned_hm;
    }
  })
    .attr('font-size','13px')
    .attr('x',0)
    .attr('y',0)
    .attr('fill','#344b56')
  ;





})
})
})
