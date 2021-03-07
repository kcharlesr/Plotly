// kcharlesr



function buildMetadata(sample){
    d3.json("samples.json").then((data) => { 
        var metadata = data.metadata;
        var table = d3.select("#sample-metadata");
        table.html("")
        var filteredData = metadata.filter(i  => i.id === parseInt (sample))[0];
        console.log(metadata);
        Object.entries(filteredData).forEach(([key,value]) => {
            table.append("div").text(`${key}: ${value}`);
        })
        console.log(filteredData);
        })}
// build charts
function buildCharts (sample){
    d3.json("samples.json").then((data) => {
        var samples = data.samples;
        var barData = samples.filter(i => i.id == sample)[0];
        var sampleValues = Object.values(barData.sample_values);
        var otuIds = Object.values(barData.otu_ids);
        var otuLabels = Object.values(barData.otu_labels);
    // bar chart
    var data = [{
        x: sampleValues.slice(0, 11).reverse(),
        y: otuIds.map(d => `ID: ${d}`).slice(0,11).reverse(),
        type: "bar",
        text: otuLabels,
        orientation: 'h' 
      }];
      var layout = {
        title: 'Top 10 OTUs'
      };
      Plotly.newPlot("bar", data, layout);  
    // bubble chart
    var data2 = [{
        x: otuIds,
        y: sampleValues,
        text: otuLabels,
        mode: 'markers',
        marker: {
            size:sampleValues,
            color: otuIds
                }       
                }];
    var layout2 = {
        title: "Bacterial Bubble Chart",
        showlegend: false,
        xaxis:{
            title: {
            text:"OTU ID",
            }}};
    Plotly.newPlot("bubble", data2, layout2);   
    // create trace gauge
    var traceGauge = {
        domain: { x: [0, 1], y: [0, 1] },
        title: "Belly Button Washing Frequency",
        value: sampleValues[otuIds], 
        type: "indicator",
        mode: "gauge+number"
      }    
      var data2 = [traceGauge];
      var layout2 = {
        width: 500, 
        height: 500, 
        margin: {
          t: 0, 
          b: 0
        }
      };
      Plotly.newPlot("gauge", data2, layout2);
})
};
function init(){
    d3.json("samples.json").then((data) => {
        
            var id_names = data.names;
            var dropdown = d3.select("#selDataset");
            id_names.forEach(id => {
                var option = dropdown.append("option");
                option.text(id);
                option.property("value", id);
            });
            var first_sample= id_names[0];
            buildMetadata(first_sample);
            buildCharts(first_sample);
}
)
}
function optionChanged(sample) {
    
    var dropdown = d3.select("#onChange");
    console.log(sample);
    dropdown.on("change", buildMetadata(sample)).on("change", buildCharts(sample));
}
init();