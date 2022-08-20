var url = "./../../data/samples.json";
var ids = [];
var samples=[];
var metadata=[];
//length of neddle
const neddleLength = 0.35;
//base size of neddle
const basesize = 0.02;
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
        title:"<b>Top 10 OTU Ids</b>"
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
        title:"<b>OTU bubble chart</b>",
        xaxis : { 
            title: {text:"OTU ID"}
        },
        showlegend: false
    };
    Plotly.newPlot("bubble",data,layout);
    
    //plot gauge
    var data = [{
        values: [1, 1, 1, 1, 1, 1, 1, 1, 1,9],
        text: ["0-1","1-2","2-3","3-4","4-5","5-6","6-7","7-8","8-9"],
        name: 'UOI',
        hoverinfo: 'none',
        hole: .7,
        type: 'pie',
        textposition: "inside",
        textfont: {
            color: 'black',
        },
        insidetextorientation:"horizontal",
        marker: {
            colors: ["#e1d1ec","#cac2ec","#bab3ec","#9e9dec","#8f8eec","#7d7dec","#6e70ec","#5c5cec","#4f4fec","white"] 
          },
        rotation: 90,
        textinfo: 'text',
        direction: 'clockwise'
      }];
    //needle paremeter
    // convert degrees to radians function
    radians = (theta) => theta * Math.PI / 180;
    //calculate angle of neddle in radian
	var theta = metapoint.wfreq * 180 / 9 ;
    //convert angle to rad
	var rads = radians(theta);
    //calculate needle position end point
	var x1 = -1 * neddleLength * Math.cos(rads) + 0.5;
	let y1 = neddleLength * Math.sin(rads) + 0.5;
    //calculate base positions
    var p0 = [-1 * basesize * Math.cos(radians(theta-90)) + 0.5, basesize * Math.sin(radians(theta-90)) + 0.5];
    var p1 = [-1 * basesize * Math.cos(radians(theta+90)) + 0.5, basesize * Math.sin(radians(theta+90)) + 0.5];
    var layout = {
        title: '<b> Belly Button Washing Frequency </b> <br> Scrubs per week',
        shapes: [
            //triangle needle
            {
                type: 'path',
                path: `M ${x1} ${y1} L ${p0[0]} ${p0[1]} L ${p1[0]} ${p1[1]} Z`,
                fillcolor: 'red',
                line: {
                    width: 0
                }
            },
            //circle of needle
            {
                type: 'circle',
                // x-reference is assigned to the x-values
                xref: 'paper',
                // y-reference is assigned to the plot paper [0,1]
                yref: 'paper',
                x0: 0.5-basesize ,
                y0: 0.5-basesize ,
                x1: 0.5+basesize,
                y1: 0.5+basesize,
                fillcolor: 'red',
                line: {
                    width: 0
                },
            }
        ],
        showlegend: false,
        margin: {
            l: 40,
            r: 40,
            b: 0,
            t: 100,
          }
    };
      Plotly.newPlot('gauge', data, layout);
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
        title:"<b>OTU bubble chart</b>",
        xaxis : { 
            title: {text:"OTU ID"}
        },
        showlegend: false
    };
    Plotly.react("bubble",data,layout);
   

    //update gauge
    var data = [{
        values: [1, 1, 1, 1, 1, 1, 1, 1, 1,9],
        text: ["0-1","1-2","2-3","3-4","4-5","5-6","6-7","7-8","8-9"],
        name: 'UOI',
        hoverinfo: 'none',
        hole: .7,
        type: 'pie',
        textposition: "inside",
        textfont: {
            color: 'black',
        },
        insidetextorientation:"horizontal",
        marker: {
            colors: ["#e1d1ec","#cac2ec","#bab3ec","#9e9dec","#8f8eec","#7d7dec","#6e70ec","#5c5cec","#4f4fec","white"] 
          },
        rotation: 90,
        textinfo: 'text',
        direction: 'clockwise'
      }];
    //needle paremeter
    // convert degrees to radians function
    radians = (theta) => theta * Math.PI / 180;
    //calculate angle of neddle in radian
	var theta = metapoint.wfreq * 180 / 9 ;
    //convert angle to rad
	var rads = radians(theta);
    //calculate needle position end point
	var x1 = -1 * neddleLength * Math.cos(rads) + 0.5;
	let y1 = neddleLength * Math.sin(rads) + 0.5;
    //calculate base positions
    var p0 = [-1 * basesize * Math.cos(radians(theta-90)) + 0.5, basesize * Math.sin(radians(theta-90)) + 0.5];
    var p1 = [-1 * basesize * Math.cos(radians(theta+90)) + 0.5, basesize * Math.sin(radians(theta+90)) + 0.5];
    var layout = {
        title: '<b> Belly Button Washing Frequency </b> <br> Scrubs per week',
        shapes: [
            //triangle needle
            {
                type: 'path',
                path: `M ${x1} ${y1} L ${p0[0]} ${p0[1]} L ${p1[0]} ${p1[1]} Z`,
                fillcolor: 'red',
                line: {
                    width: 0
                }
            },
            //circle of needle
            {
                type: 'circle',
                // x-reference is assigned to the x-values
                xref: 'paper',
                // y-reference is assigned to the plot paper [0,1]
                yref: 'paper',
                x0: 0.5-basesize ,
                y0: 0.5-basesize ,
                x1: 0.5+basesize,
                y1: 0.5+basesize,
                fillcolor: 'red',
                line: {
                    width: 0
                },
            }
        ],
        showlegend: false,
        margin: {
            l: 40,
            r: 40,
            b: 0,
            t: 100,
          }
    };
    Plotly.react('gauge', data, layout);
};
