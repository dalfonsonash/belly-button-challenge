// Example from Week 14 day 3: const url = "https://api.spacexdata.com/v2/launchpads";
const url = "://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Fetching JSON data for console log (per demo.js class 14.3)
d3.json(url).then(function(data) {
    console.log(data);
  });

