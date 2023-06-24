d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json")
  .then(jsonData => {
    data = jsonData;
   // Call the init function to initialize the dashboard
    init(data);
  });
// Declare global variables
var dataset; 
var weeklyFreq;

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
  var weeklyFreq = selectedMetadata.wfreq;
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
//
  function optionChanged(sampleId) {
    console.log("optionChanged called");
    var sampleId = document.getElementById("selDataset").value;
    console.log("Selected Sample ID:", sampleId);
    console.log("Current dataset:", dataset);
    updateBarChart(dataset, sampleId);
    updateBubbleChart(dataset,sampleId);
    updateMetadata(dataset, sampleId);
    
  } 

 
  
  