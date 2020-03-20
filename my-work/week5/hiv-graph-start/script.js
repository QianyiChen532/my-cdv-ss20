let w = 1200;
let h = 800;

let viz = d3.select("#container")
.append("svg")
.attr("width", w)
.attr("height", h)
.style("background-color", "lavender")
;

function gotData(incomingData){
  // all the data:
  console.log(incomingData);

  function filterFunction(datapoint){

    if(datapoint.Code == 'CHN' || datapoint.Code == 'USA'){
      return true;
    }else{
      return false;
    }
  }

  let filteredData = incomingData.filter(filterFunction);
  console.log('filter',filteredData);

  let yearToateObjectConverter = d3.timeParse('%Y');
  // let test = yearToateObjectConverter('2019');

  //14:04
  // let converHandM  =d3.timeParse('%H:%M')
  // let t = converHandM('19:22')

  function mapFunction(datapoint){
    datapoint.Year = yearToateObjectConverter(datapoint.Year);

    datapoint['Incidence - HIV/AIDS - Sex: Both - Age: All Ages (Number) (new cases of HIV)'] = parseFloat(datapoint['Incidence - HIV/AIDS - Sex: Both - Age: All Ages (Number) (new cases of HIV)']);
    return datapoint;
  }

  let filteredAndTimeAdjustData = filteredData.map(mapFunction);

  console.log(filteredAndTimeAdjustData);


  // let alternativeXDomain = d3.extent(filteredAndTimeAdjustData,findTime);
  // console.log(alternativeXDomain);
  //不用写两次minmax

  //X scale
  function findTime(datapoint){

    return datapoint.Year;
  }
  let minTime = d3.min(filteredAndTimeAdjustData,findTime);
  let maxTime = d3.max(filteredAndTimeAdjustData,findTime);

  let xPadding = 50;
  let xScale = d3.scaleTime().domain([minTime,maxTime]).range([xPadding,w-xPadding])

  //xgroup

  let xAxisGroup = viz.append('g').attr('class','xAxis');
  let xAxis = d3.axisBottom(xScale);
  xAxisGroup.call(xAxis);//要call才会出现 类似show

  let xAxisPos  =h-30;
  xAxisGroup.attr('transform','translate(0,'+xAxisPos+')');

  //Y scale

  let valKey = 'Incidence - HIV/AIDS - Sex: Both - Age: All Ages (Number) (new cases of HIV)'//最好直接copy path copy console有时候会报错
  function getCaseCount(datapoint){
    return datapoint[valKey];
  }

  let hivCaseCountExtent  =d3.extent(filteredAndTimeAdjustData,getCaseCount);
  console.log(hivCaseCountExtent);
  let yPadding = 40;
  let yScale = d3.scaleLinear().domain(hivCaseCountExtent).range([h-yPadding,yPadding]);


    //ygroup

    let yAxisGroup = viz.append('g').attr('class','yAxis');
    let yAxis = d3.axisLeft(yScale);
    yAxisGroup.call(yAxis);//要call才会出现 类似show

    let yAxisPos  =xPadding;
    yAxisGroup.attr('transform','translate('+yAxisPos+',0)');

  //建一个viz group作为datag和xaxis的外层group
  let vizGroup = viz.append('g').attr('class','vizgroup');

  let dataGroups = vizGroup.selectAll('.datagroup').data(filteredAndTimeAdjustData).enter()
  .append('g')
  .attr('class','datagroup')
  ;
  function getTranslated(d,i){
    //usually not use random in viz
    let x = xScale(d.Year);
    let y = yScale(d[valKey]);
    return 'translate('+ x +','+ y +')';
    console.log('1');
  }
  dataGroups.attr('transform',getTranslated);

  let circles = dataGroups.append('circle')
  .attr('cx',0)
  .attr('cy',0)
  .attr('r',5)
  .style('fill',getColor)
  ;

  function getColor(d){
    if (d.Code == 'CHN'){
      return 'red';
    }
    else{
      return 'grey';
    }
  }
  function getCountyCode(d){
    return d.Code;
  }
  // let countryLabel = dataGroups.append('text')
  // .attr('x',7)
  // .attr('y',9)
  // .text(getCountyCode)
  // ;
  //
  function getYear(d){
    return d.Year.getFullYear();
  }
  // let yearLabel = dataGroups.append('text')
  // .attr('x',7)
  // .attr('y',20)
  // .text(getYear)

//.html(string) 会直接把string的部分放到网页上 比如<p>sss</p>

let shape = `<polygon points="61.93 108.58 54.08 196.51 165.57 218.49 297.64 253.04 200.11 168.25 335.16 180.81 335.16 135.27 272.35 108.58 229.95 33.2 176.56 97.58 61.93 108.58" style="fill: #231f20"/>
  <polygon points="205.63 33.2 167.45 80.25 71.6 88.82 48.22 88.82 41.2 160.52 9.25 43.62 127.7 16.35 205.63 33.2" style="fill: #231f20"/>
  <polygon points="259.4 59.21 282 94.28 323.3 111.42 329.54 24.14 238.36 33.2 259.4 59.21" style="fill: #231f20"/>
  <path d="M62.24,244.68s330.15,49.94,205-56.11S36.78,14.1,178.89,71.68,360.71,38.17,360.71,38.17" style="fill: none;stroke: #44abe0;stroke-linecap: round;stroke-miterlimit: 10;stroke-width: 13px"/>
</svg>`//虽然不知道具体原理 反正这个符号可以转string

let customShape = dataGroups.append('g').attr('class','customShape')
.html(shape);

customShape
.attr('transform','scale(0.2)');//要用这个形式不能直接接在customshape那个定义下面不然会return那个datagroup报错
//原来的path里面的inline styling比外加的强 要改颜色需要先把原来自带的删掉
customShape.select('path').style('stroke',getColor);
}

d3.csv("new-cases-of-hiv-infection.csv").then(gotData);
