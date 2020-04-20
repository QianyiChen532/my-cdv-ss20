let w = 1200;
let h = 800;
let padding = 90

let mapIndex;
let mapData;
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

      console.log(geoData);//latitude longitude

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

      let projection = d3.geoEqualEarth()
      .translate([w/2, h/2])


      var svg = d3.select('svg');

      var rect3dGroup = svg.append('g')
      .attr('class','rect3dGroup')
      // .attr("transform", "translate (50,50)")
      ;
      let rect3d  =rect3dGroup.selectAll('rect')
      .data(geoData.features)
      .enter()

      ;

      var rh = 20, rw = 20, ang=45;

      rect3d.append("rect")
      .attr('class','rect3d')
      .attr("x", function(d,i){
        let lat = d.properties.latitude;
        let lon = d.properties.longitude;
        // console.log(projection([lon, lat]));
        return projection([lon, lat])[0];
      })
      .attr("y", function(d,i){
        let lat = d.properties.latitude;
        let lon = d.properties.longitude;

        return projection([lon, lat])[1];
      })
      .attr("width", rw)
      .attr("height", rh)
      .attr('fill','white')

      ;


      // rect3d.append("rect")
      // .attr('class','rect3d')
      // .attr("x", function(d,i){
      //   return d.properties.latitude;
      // })
      // .attr("y", function(d,i){
      //   return d.properties.longitude;
      // })
      // .attr("width", rw)
      // .attr("height", rh/2)
      // .attr ("transform", "translate ("+(-rh/2)+","+(-rh/2)+") skewX("+ang+")")
      // ;
      //
      // rect3d.append("rect")
      //   .attr("class", "side")
      //  .attr("x", 0)
      // .attr("y", 0)
      // .attr("width", rh/2)
      // .attr("height", rh)
      // .attr ("transform", "translate ("+(-rh/2)+","+(-rh/2)+") skewY("+ang+")")
      // ;


      projection= d3.geoEqualEarth()
      .translate([w/2, h/2])
      .fitExtent([[padding, padding], [w-padding, h-padding]], mapData);


      let mapGroup = viz.append("g").attr("class", "mapGroup");

      function updateMap(mapData){

        if (mapData == countryData){
          mapIndex =0;
        }else{
          mapIndex = 1;
        }


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
        if(mapIndex == 0){
          mapData = countryData;
        }else {
          mapData = geoData;
        }
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
