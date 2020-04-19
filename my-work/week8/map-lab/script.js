let w = 1200;
let h = 800;
let padding = 90

let mapIndex;
// SVG
let viz = d3.select("#container").append("svg")
    .style("width", w)
    .style("height", h)
    .style("background-color", "lavender")
;

let projections = [
  {name:"geoEqualEarth",projection:d3.geoEqualEarth()},
  {name:"geoTransverseMercator",projection:d3.geoMercator()},
  {name:"geoGnomonic",projection:d3.geoGnomonic()},
  {name:"geoWagner6",projection:d3.geoWagner6()},
  {name:"geoWagner7",projection:d3.geoWagner7()},
  {name:"geoVanDerGrinten4",projection:d3.geoVanDerGrinten4()}


]


// IMPORT DATA
d3.json("mainland.geojson").then(function(geoData){
  d3.csv("china-pop-2018.csv").then(function(incomingData){
    d3.json("countries.geojson").then(function(countryData){

    incomingData = incomingData.map(function(d,i){
      d.population = Number(d.population);
      return d;
    });
    // console.log(incomingData);

    let minPop = d3.min(incomingData, function(d,i){
      return d.population;
    });
    console.log("minPop", minPop);
    let maxPop = d3.max(incomingData, function(d,i){
      return d.population;
    });
    // console.log("maxPop", maxPop);


    let colorScale = d3.scaleLinear().domain([minPop, maxPop]).range(["white", "#237d94"]);
    console.log(colorScale(20));




    let mapGroup = viz.append("g").attr("class", "mapGroup");

    function updateMap(mapData){

      if (mapData == countryData){
        mapIndex =0;
      }else{
        mapIndex = 1;
      }

      let projection = d3.geoEqualEarth()
        .translate([w/2, h/2])
        .fitExtent([[padding, padding], [w-padding, h-padding]], mapData);

      let pathMaker = d3.geoPath()
      .projection(projection);


      let map = mapGroup.selectAll('.countries').data(mapData.features)
      console.log(map);

      let enteringElement = map.enter();
      let exitingElement = map.exit();

      enteringElement
      .append('path')
      // .transition()
      // .duration(500)
      .attr('d',pathMaker)
      .attr('class','countries')
      .attr('fill','black')
      .attr('stroke','white')
      .attr('stroke-width','1')
      ;

      //update, don't do enter()
      map
      .transition()
      .duration(500)
        .attr("d", pathMaker)
        ;

      exitingElement
      .transition()
      .duration(500)
      .remove()
      ;


    }

    updateMap(countryData);//world map by default

    function changeProjection(mapData){
      // if(mapIndex == 0){
      //   mapData = countryData;
      // }else {
      //   mapData = geoData;
      // }
      mapData = countryData;

      let n = Math.floor(Math.random()*projections.length);
      console.log(projections[n].name);

      projection = projections[n].projection
      .translate([w/2, h/2])
      .fitExtent([[padding, padding], [w-padding, h-padding]], mapData);

      updateMap(mapData);

    }

    document.getElementById("projection").addEventListener("click", changeProjection);

    document.getElementById("map-cn").addEventListener("click",function(){
      if(mapIndex == 0){
        updateMap(geoData);
      }else{
        updateMap(countryData);
      }
      console.log(mapIndex);

    });

  })
})
})
