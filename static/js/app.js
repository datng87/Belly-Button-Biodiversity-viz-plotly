var url = "./../../data/samples.json";
var ids = [];
var samples=[];
var metadata=[];

//read json and draw default value
d3.json(url).then(function(jsonData){
    ids = jsonData.names;
    samples = jsonData.samples;
    metadata = jsonData.metadata;
    //populate id to drop down box
    var dropDownOption = d3.select("#selDataset").selectAll("option").data(ids);
    dropDownOption.enter().append("option")
    .attr("value",function(d){
        return d;
    })
    .text(function(d){
        return d;
    });
    //extract data
    var otuIdnum = [];
    var otuIds =[];
    var sampleValues = [];
    var otuLables = [];
    var defaultId = ids[0];
    var metapoint=
    {
        "id": 0,
        "ethnicity": "",
        "gender": "",
        "age": 0,
        "location": "",
        "bbtype": "",
        "wfreq": 0
    };

    samples.forEach(function(element){
        if (element.id==defaultId){
            [otuIdnum,sampleValues,otuLables] = [element.otu_ids,element.sample_values,element.otu_labels];
        };
    });
    metadata.forEach(function(element){
        if (element.id==defaultId){
            metapoint = element;
        };
    });
    
    //convert id to string
    for(var i = 0;i < otuIdnum.length;i++)
    {
        otuIds.push("OTU " + otuIdnum[i]);
    };
    //select top 10 values
    var topOtuIds = otuIds.slice(0,10);
    var topSampleValues = sampleValues.slice(0,10);
    var topOtuLables = otuLables.slice(0,10);
    //plot bar
    var trace1 = {
        x:topSampleValues,
        y:topOtuIds,
        text:topOtuLables,
        type:"bar",
        orientation:"h",
        transforms: [{
            type: 'sort',
            target: 'y',
            order: 'descending'
          }]

    };
    var data =[trace1];
    var layout = {
        title:"Top 10 OTU Ids"
    };
    Plotly.newPlot("bar",data,layout);
    //update info
    var update_info = [`id: ${metapoint.id}`,
    `ethnicity: ${metapoint.ethnicity}`,
    `gender: ${metapoint.gender}`,
    `age: ${metapoint.age}`,
    `location: ${metapoint.location}`,
    `bbtype: ${metapoint.bbtype}`,
    `wfreq: ${metapoint.wfreq}`];
    var info = d3.select("#sample-metadata").selectAll("h6").data(update_info);
    info.enter()
    .append("h6").text(function(d){
        return d;
    });

    //plot bubble

    var trace2 = {
        x:otuIdnum,
        y:sampleValues,
        text:otuLables,
        mode: 'markers',
        marker:{
            color: otuIdnum,
            size: sampleValues,
            sizemode: 'area',
            sizeref:2*Math.max(...sampleValues)/(Math.pow(Math.max(...sampleValues)/2,2)),
            colorscale: 'Portland'
        }
    };
    data =[trace2];
    layout = {
        title:"OTU bubble chart",
        xaxis : { 
            title: {text:"OTU ID"}
        },
        showlegend: false
    };
    Plotly.newPlot("bubble",data,layout);

});

d3.selectAll("#selDataset").on("change", optionChanged);
function optionChanged(){
    //get dropdown value
    var id = d3.select("#selDataset").property("value");
    //get data for the chosen value
    var utuIdnum =[];
    var otuIds =[];
    var sampleValues = [];
    var otuLables = [];
    var metapoint=
    {
        "id": 0,
        "ethnicity": "",
        "gender": "",
        "age": 0,
        "location": "",
        "bbtype": "",
        "wfreq": 0
    };
    metadata.forEach(function(element){
        if (element.id==id){
            metapoint = element;
        };
    });
    samples.forEach(function(element){
        if (element.id==id){
            [otuIdnum,sampleValues,otuLables] = [element.otu_ids,element.sample_values,element.otu_labels];
        };
    });
    //convert id to string
    for(var i = 0;i < otuIdnum.length;i++)
    {
        otuIds[i] = "OTU " + otuIdnum[i];
    };
    //select top 10 values
    var topOtuIds = otuIds.slice(0,10);
    var topSampleValues = sampleValues.slice(0,10);
    var topOtuLables = otuLables.slice(0,10);
    
    //restyle plot bar
    Plotly.restyle("bar",{x:[topSampleValues],y:[topOtuIds],text:[topOtuLables]});

    //update info table
    
    var update_info = [`id: ${metapoint.id}`,
    `ethnicity: ${metapoint.ethnicity}`,
    `gender: ${metapoint.gender}`,
    `age: ${metapoint.age}`,
    `location: ${metapoint.location}`,
    `bbtype: ${metapoint.bbtype}`,
    `wfreq: ${metapoint.wfreq}`];
    var info = d3.select("#sample-metadata").selectAll("h6").data(update_info);
    info.text(function(d){
        return d;
    });

    //update bubble
    var trace2 = {
        x:otuIdnum,
        y:sampleValues,
        text:otuLables,
        mode: 'markers',
        marker:{
            color: otuIdnum,
            size: sampleValues,
            sizemode: 'area',
            sizeref:2*Math.max(...sampleValues)/(Math.pow(Math.max(...sampleValues)/2,2)),
            colorscale: 'Portland'
        }
    };
    data =[trace2];
    layout = {
        title:"OTU bubble chart",
        xaxis : { 
            title: {text:"OTU ID"}
        },
        showlegend: false
    };
    Plotly.react("bubble",data,layout);
   

    //update gauge

};
