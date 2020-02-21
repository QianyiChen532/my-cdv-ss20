console.log('hello!');

let color = [
  '#f4433691', //red
  '#ffc1079e',//orange
  '#ffeb3b75',//yellow
  '#4caf5082',//green
  '#00bcd482'//blue
]

let data = [
  {
    "timestamp": "2020-02-19T06:01:33.120Z",
    "pizza": 10,
    "chocolate": 2,
    "coffee": 10,
    "hotpot": 8,
    "yoghurt": 5
  },
  {
    "timestamp": "2020-02-19T06:01:37.084Z",
    "pizza": 8,
    "chocolate": 8,
    "coffee": 7,
    "hotpot": 10,
    "yoghurt": 8
  },
  {
    "timestamp": "2020-02-19T06:01:38.428Z",
    "pizza": 9,
    "chocolate": 7,
    "coffee": 8,
    "hotpot": 4,
    "yoghurt": 3
  },
  {
    "timestamp": "2020-02-19T06:01:38.708Z",
    "pizza": 3,
    "chocolate": 9,
    "coffee": 9,
    "hotpot": 10,
    "yoghurt": 5
  },
  {
    "timestamp": "2020-02-19T06:01:38.801Z",
    "pizza": 7,
    "chocolate": 10,
    "coffee": 9,
    "hotpot": 10,
    "yoghurt": 5
  },
  {
    "timestamp": "2020-02-19T06:01:39.091Z",
    "pizza": 8,
    "chocolate": 5,
    "coffee": 5,
    "hotpot": 9,
    "yoghurt": 10
  },
  {
    "timestamp": "2020-02-19T06:01:39.514Z",
    "pizza": 8,
    "chocolate": 7,
    "coffee": 9,
    "hotpot": 10,
    "yoghurt": 10
  },
  {
    "timestamp": "2020-02-19T06:01:39.784Z",
    "pizza": 8,
    "chocolate": 10,
    "coffee": 10,
    "hotpot": 10,
    "yoghurt": 8
  },
  {
    "timestamp": "2020-02-19T06:01:41.015Z",
    "pizza": 7,
    "chocolate": 5,
    "coffee": 9,
    "hotpot": 2,
    "yoghurt": 10
  },
  {
    "timestamp": "2020-02-19T06:01:44.589Z",
    "pizza": 10,
    "chocolate": 5,
    "coffee": 8,
    "hotpot": 10,
    "yoghurt": 6
  },
  {
    "timestamp": "2020-02-19T06:01:45.563Z",
    "pizza": 7,
    "chocolate": 6,
    "coffee": 1,
    "hotpot": 7,
    "yoghurt": 9
  },
  {
    "timestamp": "2020-02-19T06:01:46.431Z",
    "pizza": 7,
    "chocolate": 8,
    "coffee": 10,
    "hotpot": 7,
    "yoghurt": 9
  },
  {
    "timestamp": "2020-02-19T06:01:47.885Z",
    "pizza": 6,
    "chocolate": 10,
    "coffee": 6,
    "hotpot": 10,
    "yoghurt": 10
  },
  {
    "timestamp": "2020-02-19T06:02:17.312Z",
    "pizza": 8,
    "chocolate": 9,
    "coffee": 10,
    "hotpot": 7,
    "yoghurt": 9
  }
]
console.log(data);

// the function dates a data
// arrayn as an argument
function averageData(data){

  let newData = [];
  let keys = Object.keys(data[0]);
  // now we loop over the keys/categories
  for(let i = 0; i < keys.length; i++){
    let key = keys[i];
    let sum = 0;
    let num = 0;
    for(let j = 0; j < data.length; j++){
      let datum = data[j];
      if(key in datum){
        // add to sum
        sum += datum[key];
        // increase count
        num++;
      }
    }
    let avg = sum/num;
    if(!isNaN(avg)){
      let newDataPoint = {"name": key, "average": avg, 'numMeasurements': num};
      // add the new datapoint to the new data array
      newData.push(newDataPoint);
    }
  }
  return newData;
}

let transformedData = averageData(data);
console.log(transformedData);

for (let i = 0;i<transformedData.length;i++){
  let datapoint = transformedData[i];
//create invisible tooltip div first, then create bar div inside
  let tooltip = document.createElement('div');
  let bar = document.createElement('div');
  tooltip.className = 'tooltip';
  bar.className = 'bar';
  bar.style.height = datapoint.average*40 + 'px';
  bar.style.backgroundColor = color[i];

  document.getElementById('container').appendChild(tooltip);
  document.getElementsByClassName('tooltip')[i].appendChild(bar);

  let tooltipbox = document.createElement('span');
  tooltipbox.className = 'tooltiptext';
  document.getElementsByClassName('tooltip')[i].appendChild(tooltipbox);
  //assign text to tooltip
  span = document.getElementsByClassName('tooltiptext')[i];
  txt = document.createTextNode(datapoint.name+' '+datapoint.average.toFixed(2));
  span.appendChild(txt);
}



//
// function createGrid(size) {
//   var up = document.getElementById('viz');
//     var ratioW = Math.floor($(up).width()/size),
//         ratioH = Math.floor($(up).height()/size);
//     var  p = document.getElementById('container');
//     var parent = $('<div />', {
//         class: 'grid',
//         width: ratioW  * size,
//         height: ratioH  * size
//     }).addClass('grid').appendTo(p);
//
//     for (var i = 0; i < ratioH; i++) {
//         for(var p = 0; p < ratioW; p++){
//             $('<div />', {
//                 width: size - 1,
//                 height: size - 1
//             }).appendTo(parent);
//         }
//     }
//     console.log(ratioH);
// }
//
// createGrid(50);
