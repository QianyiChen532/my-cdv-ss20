console.log('hello!');

let color = [
  '#f4433691', //red
  '#ffc1079e',//orange
  '#ffeb3b75',//yellow
  '#4caf5082',//green
  '#00bcd482',//blue
  '#3f51b5b8',
  '#9c27b08f'

]

let data = [
    {
        "timestamp": "2020-02-21T14:49:04.024Z",
        "folkMusic": 7,
        "electronicMusic": 5,
        "rock": 4,
        "jazz": 9,
        "classical": 6,
        "postrock": 9,
        "rap": 3
    },
    {
        "timestamp": "2020-02-21T14:49:23.721Z",
        "folkMusic": 9,
        "electronicMusic": 2,
        "rock": 2,
        "jazz": 9,
        "classical": 4,
        "postrock": 10,
        "rap": 1
    },
    {
        "timestamp": "2020-02-21T16:08:00.853Z",
        "folkMusic": 8,
        "electronicMusic": 3,
        "rock": 5,
        "jazz": 10,
        "classical": 3,
        "postrock": 8,
        "rap": 7
    },
    {
        "timestamp": "2020-02-22T02:27:04.788Z",
        "folkMusic": 7,
        "electronicMusic": 5,
        "rock": 6,
        "jazz": 8,
        "classical": 7,
        "postrock": 5,
        "rap": 5
    },
    {
        "timestamp": "2020-02-22T08:14:06.590Z",
        "folkMusic": 8,
        "electronicMusic": 6,
        "rock": 6,
        "jazz": 5,
        "classical": 9,
        "postrock": 5,
        "rap": 3
    },
    {
        "timestamp": "2020-02-22T08:16:02.284Z",
        "folkMusic": 5,
        "electronicMusic": 10,
        "rock": 5,
        "jazz": 6,
        "classical": 5,
        "postrock": 7,
        "rap": 10
    },
    {
        "timestamp": "2020-02-23T11:38:16.428Z",
        "folkMusic": 5,
        "electronicMusic": 6,
        "rock": 6,
        "jazz": 6,
        "classical": 7,
        "postrock": 4,
        "rap": 6
    },
    {
        "timestamp": "2020-02-23T11:39:09.523Z",
        "folkMusic": 4,
        "electronicMusic": 8,
        "rock": 8,
        "jazz": 5,
        "classical": 3,
        "postrock": 4,
        "rap": 9
    },
    {
        "timestamp": "2020-02-23T11:40:00.638Z",
        "folkMusic": 9,
        "electronicMusic": 3,
        "rock": 4,
        "jazz": 7,
        "classical": 6,
        "postrock": 9,
        "rap": 5
    },
    {
        "timestamp": "2020-02-23T11:40:55.187Z",
        "folkMusic": 8,
        "electronicMusic": 8,
        "rock": 7,
        "jazz": 8,
        "classical": 8,
        "postrock": 7,
        "rap": 8
    },
    {
        "timestamp": "2020-02-23T11:41:29.567Z",
        "folkMusic": 4,
        "electronicMusic": 4,
        "rock": 3,
        "jazz": 7,
        "classical": 6,
        "postrock": 4,
        "rap": 4
    },
    {
        "timestamp": "2020-02-23T11:41:48.645Z",
        "folkMusic": 8,
        "electronicMusic": 5,
        "rock": 6,
        "jazz": 4,
        "classical": 8,
        "postrock": 5,
        "rap": 7
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
