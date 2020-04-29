let w = 700;
let h = 600;
let padding = 90

let viz = d3.select(".category").append("svg")
.style("width", '50%')
.style("height", '80%')
.style('background-color','white')
;

let category = ['exercise','bonding','nature','leisure','achievement','affection','enjoy_the_moment'] ;

// let c_color = {
//   'exercise':,
//   'bonding':,
//   'nature':,
//   'leisure':,
//   'achievement':,
//   'affection':,
//   'enjoy_the_moment':
// }

// IMPORT DATA
d3.csv("../data/short-msg.csv").then(function(msgData){
  d3.csv("../data/cleaned_hm.csv").then(function(fullData){
  d3.csv("../data/demographic.csv").then(function(demoData){

    console.log('msg',msgData);
    console.log('demo',demoData);
    console.log('full',fullData);

    //parse age from str to num
    demoData = demoData.map(function(d,i){
      d.age = Number(d.age);
      return d;
    })

    let minAge = d3.min(demoData,function(d,i){
      return d.age;
    });

    let maxAge = d3.max(demoData,function(d,i){
      return d.age;
    });

    console.log(minAge,maxAge);

    let ageScale = d3.scaleLinear().domain([minAge, maxAge]).range([padding,w-padding]);

    

  })
  })
})
