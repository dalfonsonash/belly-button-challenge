var dataset; // Declare the data global variable
var weeklyFreq; // Declare the weekly wash frequency global variable

function init(data) {
  dataset = data;
  // Populate the dropdown menu with test subject IDs
  var dropdown = d3.select("#selDataset");

  data.names.forEach(sampleId => {
    dropdown.append("option").text(sampleId).property("value", sampleId);
  });
  // Add an event listener to the dropdown menu
  dropdown.on("change", function () {
    // Get the selected sample ID
    var selectedSampleId = dropdown.property("value");

    // Call the update functions with the selected sample ID
    updateBarChart(data, selectedSampleId);
    updateBubbleChart(data, selectedSampleId);
    updateMetadata(data, selectedSampleId);
  });
  // Call the update functions with the first test subject ID to initialize the charts
  var initialId = data.names[0];
  updateBarChart(data, initialId);
  updateBubbleChart(data, initialId);
  updateMetadata(data, initialId);
}

// Read the samples.json file
d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json")
  .then(jsonData => {
    data = jsonData;

    // Call the init function to initialize the dashboard
    init(data);
  });

function updateBarChart(data, sampleId) {
  
  // Filter the data to find the sample with the selected ID
  var selectedSample = data.samples.find(sample => sample.id === sampleId) ?? {};
  
  // Extract the top 10 OTUs from the selected sample
  var top10SampleValues = selectedSample.sample_values.slice(0, 10)?.reverse() || [];
  var top10OtuIds = selectedSample.otu_ids.slice(0, 10)?.reverse() || [];
  var top10OtuLabels = selectedSample.otu_labels.slice(0, 10)?.reverse() || [];

  // Create the trace for the bar chart
  var trace = {
    x: top10SampleValues,
    y: top10OtuIds.map(id => `OTU ${id}`),
    text: top10OtuLabels,
    type: "bar",
    orientation: "h"
  };

  // Create the data array and layout for the bar chart
  var data = [trace];
  var layout = {
    title: "Top 10 OTUs",
    xaxis: { title: "Sample Values" },
    yaxis: { title: "OTU IDs" }
  };

  // Plot the bar chart
  Plotly.newPlot("bar", data, layout);
  } 


function updateBubbleChart(data, sampleId) {
  
  // Filter the data to find the sample with the selected ID
  var selectedSample = data.samples.find(sample => sample.id === sampleId);

  // Extract the required data for the bubble chart
  var otuIds = selectedSample.otu_ids;
  var sampleValues = selectedSample.sample_values;
  var otuLabels = selectedSample.otu_labels;

  // Create the trace for the bubble chart
  var trace = {
    x: otuIds,
    y: sampleValues,
    text: otuLabels,
    mode: 'markers',
    marker: {
    size: sampleValues,
    color: otuIds,
    colorscale: 'Earth'
    }
  };

  var data = [trace];

  var layout = {
    title: 'OTU Frequency',
    xaxis: { title: 'OTU ID' },
    yaxis: { title: 'Sample Values' },
    width: 950,
    height: 500
  };

  // Update the bubble chart
  Plotly.newPlot('bubble', data, layout);
 
} 


// Populate the Demographic Info.
function updateMetadata(data, sampleId) {
  // Filter the data to find the metadata for the selected sample ID
  var selectedMetadata = data.metadata.find(metadata => metadata.id.toString() === sampleId.toString());
  
  // Retrieve weekly wash frequency value
  var weeklyFreq = selectedMetadata.wfreq;
  
  // Select the metadata panel
  var metadataPanel = d3.select("#sample-metadata");

  // Clear the existing metadata
  metadataPanel.html("");

  // Check if selectedMetadata exists
  if (selectedMetadata) {
    // Iterate over each key-value pair in the metadata and append it to the panel
    Object.entries(selectedMetadata).forEach(([key, value]) => {
    metadataPanel.append("p").text(`${key}: ${value}`);
    });
    } else {
      metadataPanel.text("No metadata found for the selected sample ID.");
    }
  }
// Function to update the weekly wash frequency
function updateGaugeChart(weeklyFreq){
  
  // Select the gauge chart element
  var gaugeChart = document.getElementById("gauge");
  
  var trace = {
    type: "indicator",
    mode: "gauge+number+delta",
    value: weeklyFreq,
    title: { text: "Belly Button Washing Frequency", font: { size: 24 } },
    delta: {
      reference: weeklyFreq,
      increasing: { color: "RebeccaPurple" },
      title: { text: "Number of Washes per Week:", font: { size: 16 } }
    },
    gauge: {
      axis: { range: [null, 9], tickwidth: 0, tickcolor: "darkblue" },
      bar: { color: "darkblue", thickness: 0.05 },
      bgcolor: "white",
      borderwidth: 2,
      bordercolor: "gray",
      steps: [
        { range: [0, 1], color: "#f7fbff" },
        { range: [1, 2], color: "#deebf7" },
        { range: [2, 3], color: "#c6dbef"},
        { range: [3, 4], color: "#9ecae1"},
        { range: [4, 5], color: "#6baed6"},
        { range: [5, 6], color: "#4292c6"},
        { range: [6, 7], color: "#2171b5"},
        { range: [7, 8], color: "#08519c"},
        { range: [8, 9], color: "#08306b"}
      ],
      threshold: {
        line: { reference: weeklyFreq, color: "red", width: 4 },
        thickness: 0.75,
        value: weeklyFreq
      },
      textinfo: "value",
      marker: {
        colors: ["transparent"],
        line: { color: "black", width: 2 },
        size: 10
      },
    }
  };
  
  var data = [trace];
  
  var layout = {
    width: 500,
    height: 400,
    margin: { t: 25, r: 25, l: 25, b: 25 },
    paper_bgcolor: "lavender",
    font: { color: "darkblue", family: "Arial" }
  };
  
  Plotly.newPlot(gaugeChart, data, layout);

}

  function optionChanged(sampleId) {
    console.log("optionChanged called");
    var sampleId = document.getElementById("selDataset").value;
    console.log("Selected Sample ID:", sampleId);
    console.log("Current dataset:", dataset);
    updateBarChart(dataset, sampleId);
    updateBubbleChart(dataset,sampleId);
    updateMetadata(dataset, sampleId);
    updateGaugeChart(sampleId);
  } 

 
  
  