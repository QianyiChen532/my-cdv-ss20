## Mini-project - week1

Based on what we've done in lab 1 I develop this mini-project.

Some main changes I made:
- Change bar graph from horizontal to vertical: mainly through the alignment in css
- Add tooltips to each bar. Took me lots of time on it. The main question is about decide which one should be the parent.

Other notes during debugging:
- When getting elements from a class, it's not only one object, so it should be getElement**s**ByClassName('')[i].()
- To round the data, another way instead of using Math.round: .toFixed(). Details see [here](https://stackoverflow.com/questions/11832914/round-to-at-most-2-decimal-places-only-if-necessary).
- I tried using grid by creating certain grid in the div but had some issues with the overlapping. So I didn't make it for now.
- Found a powerful chart library [Chart.js](https://www.chartjs.org/) which draw charts using html5 canvas. Things like tooltip and grid can be easily done through this library.
- When exporting the data I run into several issues that almost drive me crazy. I ended up by frozing the first line of that sheet and it worked. Tutorial [here](http://blog.pamelafox.org/2013/06/exporting-google-spreadsheet-as-json.html)
