// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    // get the metadata field
    let metadata = data.metadata;  

    // Filter the metadata for the object with the desired sample number
    var results = metadata.filter(function(sampleObj) { 
      return sampleObj.id == sample; 
    });

    var data = results[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    // Use `.html("") to clear any existing metadata
    let panel = d3.select("#sample-metadata").html("");

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.

    var entries = Object.entries(data);
    for (var i = 0; i < entries.length; i++) {
        var key = entries[i][0];
        var value = entries[i][1];
        panel.append("h6").text(key.toUpperCase() + ": " + value);
    }
  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    let samples = data.samples;

    // Filter the samples for the object with the desired sample number
    let sampleData;
    for (let i = 0; i < samples.length; i++) {
        if (samples[i].id == sample) {
            sampleData = samples[i];
        }
      };
    // Get the otu_ids, otu_labels, and sample_values

    let otu_ids = sampleData.otu_ids;
    let otu_labels = sampleData.otu_labels;
    let sample_values = sampleData.sample_values;

    // Build a Bubble Chart

    let bubbleData = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
          size: sample_values,
          color: otu_ids,
      }
    };

    var bubbleTitle = {
      title: "Bacteria Cultures Per Sample",
      xaxis: { title: "OTU ID" },
  };

    // Render the Bubble Chart
    Plotly.newPlot("bubble", [bubbleData], bubbleTitle);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    let x = sample_values.slice(0, 10).reverse();
    
    let y = otu_ids.slice(0, 10).map(function(otuID) { 
      return `OTU ${otuID}`; 
    }).reverse();

    let text = otu_labels.slice(0, 10).reverse();
      
    let barData = {
      x: x,
      y: y,
      text: text,
      type: 'bar',
      orientation: 'h'
    };  

    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    let title = {
      title: "Top 10 Bacteria Cultures Found",
      xaxis: { title: "Number of Bacteria" },
  };

    // Render the Bar Chart
    Plotly.newPlot("bar", [barData], title);
  
});
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    let sample = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
    let dropdown = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    var names = data.names;
    for (var i = 0; i < names.length; i++) {
        dropdown.append("option").text(names[i]).property("value", names[i]);
    }
    // Get the first sample from the list
    let firstSample = sample[0]

    // Build charts and metadata panel with the first sample
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
