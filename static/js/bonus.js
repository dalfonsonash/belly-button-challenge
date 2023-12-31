function updateGaugeChart(data, sampleId) {
  // Retrieve weekly wash frequency value
  var weeklyFreq = data.metadata.find(metadata => metadata.id.toString() === sampleId.toString()).wfreq;

  // Select the gauge chart element
  var gaugeChart = document.getElementById("gauge");

  var trace = {
    type: "indicator",
    mode: "gauge+number+delta",
    value: weeklyFreq,
    title: { text: "Weekly Washing Frequency", font: { size: 24 } },
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
        { range: [2, 3], color: "#c6dbef" },
        { range: [3, 4], color: "#9ecae1" },
        { range: [4, 5], color: "#6baed6" },
        { range: [5, 6], color: "#4292c6" },
        { range: [6, 7], color: "#2171b5" },
        { range: [7, 8], color: "#08519c" },
        { range: [8, 9], color: "#08306b" }
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
      }
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

  // Plot the gauge chart
  Plotly.newPlot(gaugeChart, data, layout);
}

function optionChanged(sampleId) {
  var sampleId = document.getElementById("selDataset").value;
  updateGaugeChart(dataset, sampleId);
}

