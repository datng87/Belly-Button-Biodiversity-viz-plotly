//plot gauge ids[0]

var gaugedata={};
metadata.forEach(function(element){
    if (element.id==ids[0]){
        gaugedata = element;
    };
});
//code for gauge chart in app.js