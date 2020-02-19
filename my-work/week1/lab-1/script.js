console.log('hello!');

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
  // new empty array to be filled
  // with data in new structure
  let newData = [];
  // assuming each data point has the same
  // keys/categories, we extract an array of them from the
  // first data point in the array
  // in class we changed it to the last element instead
  // as the first one did not have all the categories filled out
  // there is more thorough ways to do this, but for out purposes
  // now, this will be enough
  let keys = Object.keys(data[0]);
  // now we loop over the keys/categories
  for(let i = 0; i < keys.length; i++){
    // store the current key/category in
    // a variable:
    let key = keys[i];
    // now we will loop over each data point
    // in the data set, check if it has a value
    // for the key/category and add them to
    // a total sum variable
    // as well as count the occurences in order to
    // calulate the averae in the end
    let sum = 0;
    let num = 0;
    for(let j = 0; j < data.length; j++){
      let datum = data[j];
      // check if the key exists
      // for this datapoint
      if(key in datum){
        // add to sum
        sum += datum[key];
        // increase count
        num++;
      }
    }
    // now calculate the average
    let avg = sum/num;
    // make sure the value is a number
    // (some value might be strings)
    if(!isNaN(avg)){
      // create an object with both the average
      // and also the number of measurements that
      // went into the average
      let newDataPoint = {"name": key, "average": avg, 'numMeasurements': num};
      // add the new datapoint to the new data array
      newData.push(newDataPoint);
    }
  }
  // return everything when it is done
  return newData;
}

let transformedData = averageData(data);
console.log(transformedData);



for (let i = 0;i<transformedData.length;i++){
  let datapoint = transformedData[i];
  let bar = document.createElement('div');
  bar.className = 'bar';
  bar.style.width = datapoint.average*40 + 'px';
  bar.innerHTML = datapoint.name;
  document.getElementById('viz').appendChild(bar);

}
