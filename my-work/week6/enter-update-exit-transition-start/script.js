let w = 960;
let h = 640;
let xPadding = 70;
let yPadding = 50;

let viz = d3.select("#container")
.append("svg")
.attr("width", w)
.attr("height", h)
;


function gotData(incomingData){
  console.log(incomingData);

  let mergedData = d3.merge(incomingData)//!
  console.log(mergedData);


  //xscale
  let maxX = d3.max(mergedData,function(d,i){
    console.log(d);
    return d.x;
  });

  let xScale = d3.scaleLinear().domain([0,maxX]).range([xPadding,w-xPadding]);

  let xAxisGroup = viz.append('g').attr('class','xaxis');
  let xAxis = d3.axisBottom(xScale);
  xAxisGroup.call(xAxis);
  xAxisGroup.attr('transform','translate(0,'+(h-yPadding)+')')

  //y
  let maxY = d3.max(mergedData,function(d,i){
    console.log(d);
    return d.y;
  });

  let yScale = d3.scaleLinear().domain([0,maxY]).range([h-xPadding,yPadding]);//range要倒过来

  let yAxisGroup = viz.append('g').attr('class','xaxis');
  let yAxis = d3.axisLeft(yScale);
  yAxisGroup.call(yAxis);
  yAxisGroup.attr('transform','translate('+xPadding+',0)')

  //group for viz
  let vizGroup = viz.append('g').attr('class','vizGroup');

  let dataIndex = 0

  function visualizeData(){
    //get data
    let dataToShow = incomingData[dataIndex];

    function assignkeys(d,i){
        return d.name;
    }
    //viz
    let datagroups = vizGroup.selectAll('.datagroup').data(dataToShow,function(d,i){
        return d.name;
    });

    let enteringElements =
    datagroups.enter()
    .append('g')
    .attr('class','datagroup')
    ;
    console.log(enteringElements);

    enteringElements.append('circle')

    .attr('r',30)
    .attr('fill','red')
    ;

    enteringElements.append('text')
    .text(function(d,i){
      return d.name;
    })
    .attr('x',0)
    .attr('y',0)
    .attr('fill','white')
    ;

    enteringElements.attr('transform',getIncomingGroupposition)
    .transition().delay(500).attr('transform',getGroupposition);

    let exitingElements = datagroups.exit();
    exitingElements.transition().attr('transform',getOutGroupposition).remove();//!

    function getGroupposition(d,i){
      let x = xScale(d.x);
      let y = yScale(d.y);
      return 'translate('+x+','+y+')';
    }
    function getIncomingGroupposition(d,i){
      let x = xScale(d.x);
      let y = -30;
      return 'translate('+x+','+y+')';
    }
    function getOutGroupposition(d,i){
      let x = xScale(d.x);
      let y = h-30;
      return 'translate('+x+','+y+')';
    }
    datagroups.transition().duration(500).attr('transform',getGroupposition);//对所有element apply transition要在这里写

  }
  document.getElementById('step1').addEventListener('click',function(){
    dataIndex = 0;
    visualizeData();
  });
  document.getElementById('step2').addEventListener('click',function(){
    dataIndex = 1;
    visualizeData();
  });
  document.getElementById('step3').addEventListener('click',function(){
    dataIndex = 2;
    visualizeData();
  });
  document.getElementById('step4').addEventListener('click',function(){
    dataIndex = 3;
    visualizeData();
  });
  document.getElementById('step5').addEventListener('click',function(){
    dataIndex = 4;
    visualizeData();
  });
  // function step1(){
  //
  //   //get data
  //   let dataToShow = incomingData[0];
  //
  //   //viz
  //   let datagroups = vizGroup.selectAll('.datagroup').data(dataToShow).enter()
  //   .append('g')
  //   .attr('class','datagroup')
  //   ;
  //
  //   datagroups.append('circle')
  //
  //   .attr('r',30)
  //   .attr('fill','red')
  //   ;
  //
  //   datagroups.append('text')
  //   .text(function(d,i){
  //     return d.name;
  //   })
  //   .attr('x',0)
  //   .attr('y',0)
  //   .attr('fill','white')
  //   ;
  //
  //   function getGroupposition(d,i){
  //     let x = xScale(d.x);
  //     let y = yScale(d.y);
  //     return 'translate('+x+','+y+')';
  //   }
  //
  //   datagroups.attr('transform',getGroupposition);
  // }
  // //button
  // document.getElementById('step1').addEventListener('click',step1);
  // document.getElementById('step2').addEventListener('click',step2);
  //   document.getElementById('step3').addEventListener('click',step3);
  // document.getElementById('step4').addEventListener('click',step4);

  // function step2(){
  //   //get data
  //   let dataToShow = incomingData[1];//这里要改！
  //
  //
  //   //viz
  //   let datagroups = vizGroup.selectAll('.datagroup').data(dataToShow)
  //   //return what to update(没有enter的时候)
  //   // .enter()
  //   // .append('g')
  //   // .attr('class','datagroup')
  //   ;
  //
  //   function getGroupposition(d,i){
  //     let x = xScale(d.x);
  //     let y = yScale(d.y);
  //     return 'translate('+x+','+y+')';
  //   }
  //   datagroups.attr('transform',getGroupposition);
  // }
  //
  //
  //   function step3(){
  //     //get data
  //     let dataToShow = incomingData[2];//这里要改！
  //
  //
  //     //viz
  //     let datagroups = vizGroup.selectAll('.datagroup').data(dataToShow);
  //     //return what to update(没有enter的时候)
  //     // .enter()
  //     // .append('g')
  //     // .attr('class','datagroup')
  //     let exitingElements = datagroups.exit();
  //     exitingElements.remove();//!
  //
  //     function getGroupposition(d,i){
  //       let x = xScale(d.x);
  //       let y = yScale(d.y);
  //       return 'translate('+x+','+y+')';
  //     }
  //     datagroups.attr('transform',getGroupposition);
  //   }
  //
  //
  //     function step4(){
  //       //get data
  //       let dataToShow = incomingData[3];//这里要改！
  //
  //
  //       //viz
  //       let datagroups = vizGroup.selectAll('.datagroup').data(dataToShow);
  //       //return what to update(没有enter的时候)
  //       // .enter()
  //       // .append('g')
  //       // .attr('class','datagroup')
  //       let enteringElement = datagroups.enter()
  //       .append('g')
  //       ;
  //
  //       enteringElement.append('circle')
  //
  //       .attr('r',30)
  //       .attr('fill','red')
  //       ;
  //
  //       enteringElement.append('text')
  //       .text(function(d,i){
  //         return d.name;
  //       })
  //       .attr('x',0)
  //       .attr('y',0)
  //       .attr('fill','white')
  //       ;
  //
  //       enteringElement.attr('transform',getGroupposition);
  //
  //       // let exitingElements = datagroups.exit();
  //       // exitingElements.remove();//!
  //
  //       function getGroupposition(d,i){
  //         let x = xScale(d.x);
  //         let y = yScale(d.y);
  //         return 'translate('+x+','+y+')';
  //       }
  //       datagroups.attr('transform',getGroupposition);
  //     }

}



d3.json("data.json").then(gotData);
