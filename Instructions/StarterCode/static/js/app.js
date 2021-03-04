// kcharlesr


  
d3.json('samples.json').then((data)=>{
    var id=data.names;
    console.log(data.metadata);
    var select=d3.selectAll('#selDataset');
    Object.entries(id).forEach(([i,v])=>{
        select.append('option').text(v);
    })
})
function makePlot(testId){
    d3.json('samples.json').then((data)=>{
        var samples=data.samples;
        var testNum=samples.map(row=>row.id).indexOf(testId);
        var otuValueTen=samples.map(row=>row.sample_values);
        var otuValueTen=otuValueTen[testNum].slice(0,10).reverse();
        var otuIdTen=samples.map(row=>row.otu_ids);
        var otuIdTen=otuIdTen[testNum].slice(0,10);
        var otuLabelTen=samples.map(row=>row.otu_labels); 
        var otuLabelTen=otuLabelTen[testNum].slice(0,10); 
        var trace={
            x: otuValueTen,
            y: otuIdTen.map(r=>`UTO ${r}`),
            text: otuLabelTen,
            type:'bar',
            orientation:'h'
        }

        Plotly.newPlot('bar',[trace]);
        var otuValue=samples.map(row=>row.sample_values);
        var otuValue=otuValue[testNum];
        var otuId=samples.map(row=>row.otu_ids);
        var otuId=otuId[testNum];
        var otuLabel=samples.map(row=>row.otu_labels); 
        var otuLabel=otuLabel[testNum];
        var minIds=d3.min(otuId);
        var maxIds=d3.max(otuId);
        var mapNr = d3.scaleLinear().domain([minIds, maxIds]).range([0, 1]);
        var bubbleColors = otuId.map( val => d3.interpolateRgbBasis(["royalblue", "greenyellow", "goldenrod"])(mapNr(val)));
        var trace1={
            x: otuId,
            y: otuValue,
            text: otuLabel,
            mode: 'markers',
            marker: {
                color: bubbleColors,
                size: otuValue.map(x=>x*10),
                sizemode: 'area'
            }
        };
        var data1=[trace1];
        var bubbleLayout={
            xaxis:{
                autochange: true,
                height: 600,
                width: 1000,
                title: {
                    text: 'OTU ID'
                }
            },
        };

        Plotly.newPlot('bubble',data1,bubbleLayout);    
        var meta=data.metadata;
        var data2 = [   {
                domain: { x: [0, 1], y: [0, 1] },
                value: meta[testNum].wfreq,
                title: { text: "Belly Button Washing Frequency <br> Scrubs per Week" },
                type: "indicator",
                mode: "gauge+number",
                gauge: { axis: { range: [0, 9] },
                bar:{color: 'red'},
                   steps: [
                    { range: [0, 1], color: "rgba(232, 204, 255, .75)" },
                    { range: [1, 2], color: "rgba(221, 178, 255,, .75)" },
                    { range: [2, 3], color: "rgba(210, 153, 255, .75)" },
                    { range: [3, 4], color: "rgba(199, 127, 255, .75)" },
                    { range: [4, 5], color: "rgba(188, 102, 255, .75)" },
                    { range: [5, 6], color: "rgba(177, 76, 255, .75)" },
                    { range: [6, 8], color: "rgba(165, 51, 255, .75)" },
                    { range: [8, 9], color: "rgba(154, 25, 255, .75)" }
                        ]}
                        }   ];

        var gaugeLayout = { width: 600, height: 500};
        Plotly.newPlot('gauge', data2, gaugeLayout);
        // display meta info
        var metadata=d3.select('#sample-metadata');
        metadata.html('');
        Object.entries(meta[testNum]).forEach(([k,v])=>{
            metadata.append('p').text(`${k.toUpperCase()}:\n${v}`);
        })
    })
}
// button handler
function optionChanged(newId) {
    // select id fro page
    makePlot(newId);
}






