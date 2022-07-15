// // LekagulSensorData.csv

function updateAttr(){ 
    console.log(this.files[0]);
    var result;
    Papa.parse(this.files[0], {
        complete: function(results) {
            // console.log("Finished:", results.data);
            attr = results.data[0];
            $("#attr").append("attr -> ");
            for(var i in attr){
                if(i == attr.length-1){
                    $("#attr").append(attr[i]);
                }
                else{
                    $("#attr").append(attr[i] + " | ");
                }
            }
        }
    });
}

$(document).ready(function(){
    document.getElementById("input").addEventListener("change", updateAttr, false);
});