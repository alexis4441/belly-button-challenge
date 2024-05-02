// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    
  // get the metadata field
    let metadata = data.metadata;
    
  // Filter the metadata for the object with the desired sample number  
    let sampleNumber = metadata.find(sampleObj => sampleObj.id == sample);

  // Use d3 to select the panel with id of `#sample-metadata`
    let panel = d3.select("#sample-metadata");
    
  // Use `.html("") to clear any existing metadata
    panel.html("");

  // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    
    Object.entries(sampleNumber).forEach(([key, value]) => {
      panel.append("p").text(`${key}: ${value}`);
    });
  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    
  // Get the samples field
    let samples = data.samples;
    
  // Filter the samples for the object with the desired sample number
    let sampleNumber = samples.find(sampleObj => sampleObj.id == sample);

  // Get the otu_ids, otu_labels, and sample_values
    let otu_ids = sampleNumber.otu_ids;
    let sample_values = sampleNumber.sample_values;
    let otu_labels = sampleNumber.otu_labels;

  // Build a Bubble Chart
    let BubbleChart = document.getElementById("bubble");
    let trace1 = [{
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: "markers",
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: "Earth"
      }
    }];

  // Render the Bubble Chart
  let Bubblelayout = {
    title: "Bacteria Cultures Per Sample",
    xaxis: {title:"OTU ID"}
  };
    Plotly.newPlot(BubbleChart, trace1, Bubblelayout);

  // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    let yticks = otu_ids.map(id => `OTU ${id}`);

  // Build a Bar Chart
  // Don't forget to slice and reverse the input data appropriately
    let BarChart = document.getElementById("bar");
    let trace2 = [{
      x: sample_values.slice(0, 10).reverse(),
      y: yticks.slice(0, 10).reverse(),
      type: "bar",
      orientation: "h"
    }];
    
    let layout = {
      title: "Top 10 Bacteria Cultures Found",
      xaxis: {title:"Number of Bacteria"}
  };
// Render the Bar Chart
    Plotly.newPlot(BarChart, trace2, layout);
  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    
  // Get the names field
    let names = data.names;

  // Use d3 to select the dropdown with id of `#selDataset`
    let dropdownmenu = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    names.forEach(name => {
      dropdownmenu.append("option").text(name).property("value", name);
    });

  // Get the first sample from the list
    let firstsample = names[0];

  // Build charts and metadata panel with the first sample
    buildMetadata(firstsample);
    buildCharts(firstsample);
  });
}

// Function for event listener
function optionChanged(newSample) {

// Build charts and metadata panel each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
}

// Initialize the dashboard
init();