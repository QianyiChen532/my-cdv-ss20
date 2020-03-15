let viz = d3.select('#container')
    .append('svg')
    .attr('id', 'viz')
    .style('width', '100%')
    .style('height', '100%')
    .style('background', '#3B8CF3')

const weekdayStrings = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const dateFormat = d3.timeFormat('%Y-%m-%d');



function gotData(data) {
    console.log(data);
    initCalendar(data);
}

function initCalendar(data) {
    const calendarOffset = [100, 100];
    const cellSize = 80;

    let dateCountData = getDateCount(data);

    let calendarView = viz.append('g')
        .attr('id', 'calendarView')
        .attr('transform', 'translate(' + calendarOffset[0] + ',' + calendarOffset[1] + ')')
        .attr('text-anchor', 'middle')
        .attr('fill', "white")
        .attr('font-family', 'Gill Sans');

    calendarView.append('text')
        .text('Feb 2020')
        .attr('font-size', '40')
        .attr('transform', 'translate(' + cellSize / 2 + ',' + -cellSize * 0.2 + ')')

    let weekdayElements = calendarView.selectAll('.weekday').data(weekdayStrings)
        .enter()
        .append('g')
        .attr('class', 'weekday')
        .attr('transform', (d, i) => `translate(${i*cellSize},30)`);

    let weekdayText = weekdayElements.append('text')
        .text(d => d);


    // get the range of visit count
    let maxCount = 0,
        minCount = 100;
    dateCountData.forEach(e => {
        maxCount = Math.max(e.count, maxCount);
        minCount = Math.min(e.count, minCount);
    });



    // create a size scale
    let sizeFn = d3.scaleSqrt()
        .domain([minCount, maxCount])
        .range([10, cellSize * 0.8]);

    // calendar date count elements
    let dateCountElements = calendarView.selectAll('.dateCount').data(dateCountData)
        .enter()
        .append('g')
        .attr('class', 'dateCount')
        .attr('transform', getDateCountTranslation);

    // dateCountShape
    let dateCountShape = dateCountElements.append('circle')
        .attr('r', d => sizeFn(d.count))
        .attr('fill', getDateCountShapeColor)
        .attr('fill-opacity', '0.85')




    // dateCountText
    let dateCountText = dateCountElements.append('text')
        .text(d => d.date.getDate())
        .attr('transform', 'translate(' + 0 + ',' + 4 + ')');


    function getDateCount(data) {
        //create an array of all the date in Feb 2020
        let dateCount = d3.scaleTime()
            .domain([new Date(2020, 1, 1), new Date(2020, 1, 29)])
            .ticks(d3.timeDay, 1)
            .map(d => {
                return {
                    'date': d,
                    'count': 0
                }
            });

        //fill in the date count data
        data.forEach(datum => {
            let date = new Date(datum.lastVisitTimeUTC);
            dateCount.forEach(d => {
                //count when the date is the same
                if (dateFormat(d.date) === dateFormat(date))
                    d.count++;
            })
        });

        return dateCount;
    }

    function getDateCountTranslation(d, i) {
        let x = d.date.getDay();
        let y = Math.floor((d.date.getDate() + 5) / 7); // 5 is the weekday number of Feb 1st
        return `translate(${x*cellSize},${(y+1)*cellSize})`;
    }

    function getDateCountShapeColor(d, i) {
        let colorFn = d3.scaleLinear().domain([minCount - 100, maxCount])
            .interpolate(d3.interpolateHcl);
        if (i < 16) {
            // color gradient for before school
            colorFn.range([d3.rgb("#E04838"), d3.rgb('#FFCA4A')]);
            return colorFn(d.count);
        } else {
            // color gradient for after school
            colorFn.range([d3.rgb("#E04838"), d3.rgb('#57068c')]);
            return colorFn(d.count);
        }
    }
}


d3.json('./data/chrome_history_anonymous.json').then(gotData)
