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
  {name:"geoOrthographic",projection:d3.geoOrthographic()},
  {name:"geoWagner6",projection:d3.geoWagner6()},
  {name:"geoWagner7",projection:d3.geoWagner7()},
  {name:"geoVanDerGrinten4",projection:d3.geoVanDerGrinten4()},
  {name:"geoPolyconic",projection:d3.geoPolyconic()}

]


// IMPORT DATA
d3.json("mainland.geojson").then(function(geoData){
  d3.csv("china-pop-2018.csv").then(function(incomingData){
    d3.json("countries.geojson").then(function(countryData){

      console.log(incomingData);//latitude longitude

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

      let sizeScale = d3.scaleLinear().domain([minPop, maxPop]).range([3,15]);


      console.log(colorScale(20));

      let textGroup = viz.append("g").attr("class", "textGroup");
      let mapGroup = viz.append("g").attr("class", "mapGroup");
      let rect3dGroup = viz.append('g')
      .attr('class','rect3dGroup')
      .attr("transform", "translate (-5,-5)")
      ;


      function updateMap(mapData,pIndex){

        if (mapData == countryData){
          mapIndex =0;
        }else{
          mapIndex = 1;
        }


        if(pIndex == undefined){
          pIndex=0;
        }
        // console.log(pIndex);
        projection= projections[pIndex].projection
        .translate([w/2, h/2])
        .fitExtent([[padding, padding], [w-padding, h-padding]], mapData);

        let pathMaker = d3.geoPath()
        .projection(projection);

        let map = mapGroup.selectAll('.countries').data(mapData.features)
        // console.log(map);

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
        .ease(d3.easeCubic)
        .attr("d", pathMaker)
        ;

        exitingElement
        .transition()
        .duration(500)
        .remove()
        ;

        let text = textGroup.selectAll('text').data(projections)

        text
        .enter()
        .append('text')
        .attr('fill',function(d){
          return 'black'
        })
        .attr('x',0)
        .attr('y',30)
        .text(function(d,i){
          return 'current projection:'+ projections[pIndex].name
        })
        ;

        //update
        text
        .text(function(d,i){
          // console.log(pIndex);
          return 'current projection:'+ projections[pIndex].name
        })
        ;

        function colorChoice(d,i){
          // console.log(d);
          if(d.properties.iso_a2 == "CN"){
            let correspondingDatapoint = incomingData.find(function(datapoint){
              // console.log(datapoint);
              if(datapoint.province == d.properties.name){
                console.log(datapoint.province);
                return true;
              }else{

                return false;
              }
            })
            if(correspondingDatapoint != undefined){
              console.log(correspondingDatapoint.population);
            }
            return colorScale(correspondingDatapoint.population);
          }
          else{
            return 'none';
          }
        }


        let rect3d  =rect3dGroup.selectAll('.rect3d')
        .data(mapData.features)
        ;

                let top  =rect3dGroup.selectAll('.top')
                .data(mapData.features)
                ;
                console.log(top);

        let rh = 20, rw = 20, ang=45;
        // console.log(rect3d);

        rect3d
        .enter()
        .append("rect")
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
        .attr("fill", 'none')
        ;

//update
        rect3d
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
        .attr("height", rh)
        .attr("width", function(d,i){
          console.log(d.properties.name);
          if(d.properties.iso_a2 == "CN"){
            let correspondingDatapoint = incomingData.find(function(datapoint){
              // console.log(datapoint);
              if(datapoint.province == d.properties.name){
                console.log(datapoint.province);
                return true;
              }else{
                return false;
              }
            })
            if(correspondingDatapoint != undefined){
              console.log(correspondingDatapoint.population);
              return sizeScale(correspondingDatapoint.population);
            }
          }
          else{
            return rh;
          }
        })
        .attr("fill", colorChoice)
        ;

        // top
        // .enter()
        // .append("rect")
        // .attr('class','top')
        // .attr("x", function(d,i){
        //   let lat = d.properties.latitude;
        //   let lon = d.properties.longitude;
        //   // console.log(projection([lon, lat]));
        //   return projection([lon, lat])[0];
        // })
        // .attr("y", function(d,i){
        //   let lat = d.properties.latitude;
        //   let lon = d.properties.longitude;
        //
        //   return projection([lon, lat])[1];
        // })
        // .attr("width", rw)
        // .attr("height", rh/2)
        // .attr ("transform", "translate ("+(-rh/2)+","+(-rh/2)+") skewX("+ang+")")
        // ;
        //
        // rect3d
        // .enter()
        // .append("rect")
        //   .attr("class", "side")
        //   .attr("x", function(d,i){
        //     let lat = d.properties.latitude;
        //     let lon = d.properties.longitude;
        //     // console.log(projection([lon, lat]));
        //     return projection([lon, lat])[0];
        //   })
        //   .attr("y", function(d,i){
        //     let lat = d.properties.latitude;
        //     let lon = d.properties.longitude;
        //
        //     return projection([lon, lat])[1];
        //   })
        //   .attr('fill','red')
        // .attr("width", rh/2)
        // .attr("height", rh)
        // .attr ("transform", "translate ("+(-rh/2)+","+(-rh/2)+") skewY("+ang+")")
        // ;

        // top
        // .attr("x", function(d,i){
        //   let lat = d.properties.latitude;
        //   let lon = d.properties.longitude;
        //   // console.log(projection([lon, lat]));
        //   return projection([lon, lat])[0];
        // })
        // .attr("y", function(d,i){
        //   let lat = d.properties.latitude;
        //   let lon = d.properties.longitude;
        //
        //   return projection([lon, lat])[1];
        // })
        // .attr('fill','red')
        // .attr("width", rw)
        // .attr("height", rh/2)
        // .attr ("transform", "translate ("+(-rh/2)+","+(-rh/2)+") skewX("+ang+")")
        // ;
        //
        // rect3d
        // .append("rect")
        //   .attr("class", "side")
        //   .attr("x", function(d,i){
        //     let lat = d.properties.latitude;
        //     let lon = d.properties.longitude;
        //     // console.log(projection([lon, lat]));
        //     return projection([lon, lat])[0];
        //   })
        //   .attr("y", function(d,i){
        //     let lat = d.properties.latitude;
        //     let lon = d.properties.longitude;
        //
        //     return projection([lon, lat])[1];
        //   })
        //   .attr('fill','red')
        // .attr("width", rh/2)
        // .attr("height", rh)
        // .attr('fill','red')
        // .attr ("transform", "translate ("+(-rh/2)+","+(-rh/2)+") skewY("+ang+")")
        // ;

        rect3d
        .exit()
        .transition()
        .duration(500)
        .remove()
        ;

        top
        .exit()
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

        let n = Math.floor(Math.random()*projections.length);
        console.log(projections[n].name);

        updateMap(mapData,n);
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
