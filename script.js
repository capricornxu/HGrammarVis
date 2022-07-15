$(document).ready(function(){
    $.get("LekagulSensorData.csv", function(CSVdata) {
         data = CSVdata.split('\n');
         attr = data[0].split(',');
         console.log(attr);
     });
});