// Grammar components
PartialGrammar = {
    "attr": ['Model', 'MPG', 'Cylinders', 'Displacement', 'Horsepower', 'Weight', 'Acceleration', 'Year', 'Origin'],
    "const": ['number', 'string'],
    "func": ['AVG', 'MAX', 'MIN', 'COUNT']
}

var hypoGrammar = {
    "hypo": "expr '[' pred ']' op expr '[' pred ']'",
    "expr": "func '(' var ')' | var",
    "var": "attr | const",
    "pred": "var op const | ",
    "op":"'=' | '<' | '>'",
    "attr": "'Model' | 'MPG' | 'Cylinders' | 'Displacement' | 'Horsepower' | 'Weight' | 'Acceleration' | 'Year' | 'Origin'",
    "const": "'number' | 'string'",
    "func": "'AVG' | 'MAX' | 'MIN' | 'COUNT'"
}

// var pred = {
//     "pred": "var op const | ",
//     "var": "attr | const",
//     "op":"'=' | '<' | '>'",
//     "attr": "'Model' | 'MPG' | 'Cylinders' | 'Displacement' | 'Horsepower' | 'Weight' | 'Acceleration' | 'Year' | 'Origin'",
//     "const": "'number' | 'string'",
//     "func": "'AVG' | 'MAX' | 'MIN' | 'COUNT'"
// }

const CDgrm = {
    "hypo": "expr '=' 'number' ",
    "expr": " 'DIVIDE' '(' 'COUNT' '('  ')' '[' subpred ']' ',' 'COUNT' '('  ')' '[' pred ']' ')' | var '[' pred ']'",
    "op":"'=' | '<' | '>'",
    "var": "attr | const ",
    "attr": "'Model' | 'MPG' | 'Cylinders' | 'Displacement' | 'Horsepower' | 'Weight' | 'Acceleration' | 'Year' | 'Origin'",
    "const": "'number' | 'string'",
    "func": "'DIVIDE' | 'COUNT' | 'Q1' ",
    "pred": " | subpred ",
    "subpred": " "
}

const CDpred = {
    "pred": " var op const",
    "var": "attr | const",
    "op":"'=' | '<' | '>'",
    "attr": "'Model' | 'MPG' | 'Cylinders' | 'Displacement' | 'Horsepower' | 'Weight' | 'Acceleration' | 'Year' | 'Origin'",
    "const": "'number' | 'string'",
}

const CORRgrm = {
    "hypo": "expr '=' 'number' ",
    "expr": " 'CORR' '(' attr ',' attr ')' '[' pred ']'",
    "op":"'=' | '<' | '>'",
    "var": "attr | const ",
    "attr": "'Model' | 'MPG' | 'Cylinders' | 'Displacement' | 'Horsepower' | 'Weight' | 'Acceleration' | 'Year' | 'Origin'",
    "const": "'number' | 'string'",
    "func": "'DIVIDE' | 'COUNT' | 'Q1' ",
    "pred": " | subpred ",
    "subpred": " "
}

const ANOMgrm = {
    "hypo": "expr op 'Q1 - 1.5 * IQR' |  expr op 'Q3 + 1.5 * IQR'",
    "expr": " attr '[' pred ']'",
    "op": "'=' | '<' | '>'",
    "var": "attr | const ",
    "const": "'number' | 'string'",
    "func": "'DIVIDE' | 'COUNT' | 'Q1' ",
    "pred": " 'Model' '=' 'string' ",
    "subpred": " "
}


const EXTREgrm = {
    "hypo": "func '(' attr ')' op attr '[' pred ']' |  'COUNT' '(' ')' '[' pred ']' op attr '[' pred ']'",
    "op":"'=' | '<' | '>'",
    "var": "attr ",
    "attr": "'Model' | 'MPG' | 'Cylinders' | 'Displacement' | 'Horsepower' | 'Weight' | 'Acceleration' | 'Year' | 'Origin'",
    "const": "'number' | 'string'",
    "func": "'MIN' | 'AVG' | 'MAX' ",
    "pred": " | subpred ",
    "subpred": " "
}

var exprList = []
var subpredList = []
var chooseList = []

var li


// Get Request
function httpGetAsync(theUrl, callback)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous 
    xmlHttp.send(null);
}

// Post Request
function httpPostAsync(url, data, callback) {
    console.log(data)
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
      if (xmlHttp.readyState == 4 && xmlHttp.status == 201){
        callback(xmlHttp.responseText);
      }
    }
    xmlHttp.open("POST", url, true); // true for asynchronous
    xmlHttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xmlHttp.send(JSON.stringify(data));
}

function sendGrammarCallback(responseText){
    receivedData = JSON.parse(responseText)
    console.log(receivedData)
    subpredList = receivedData
    showChooseBox(subpredList)
    console.log(hypoGrammar)
}

function sendComponentsCallback(responseText){
    receivedData = JSON.parse(responseText)
    console.log(receivedData)
    $("#hypothesis_list").html(receivedData.join("<br/>"))
}

function updateProduction(userChoice){
    var tempRightprod = ""
    for (let index = 0; index < userChoice.length; index++) {
        const element = userChoice[index];
        if (element["checked"] == true) {
            label_name = element.nextElementSibling.innerHTML
            if(tempRightprod.length == 0){
                tempRightprod = tempRightprod + "'" + label_name + "'" 
            }else{
                tempRightprod = tempRightprod + " | " + "'" + label_name + "'" 
            }
        }
    }
    return tempRightprod
}

function showChooseBox(componentList) {
    $("#chooseBox").empty()

    $.each(componentList, function(index, value){
        li = $("<li/>").addClass("list-item")
                    .attr("data-item", value)
                    .text(value)
                    .appendTo("#chooseBox")

        li.on('click', function(){
            $(this).addClass('selected');
            chooseList.push($(this).attr("data-item"))
        });
    })

    return chooseList
}

// main entrance here
$(document).ready(function(){
    // read in partial grammar
    $.each(PartialGrammar['attr'], function(index, value) {
        $('#attr').append('<input type="checkbox" class="attribute"  name="attr" unchecked/> ')
        $('#attr').append('<label >' + value + '</label>');
    });

    taskList = ["Characterize Distribution", "Correlation", "Find anomalies", "Find extremum"]
    $.each(taskList, function(index, value) {
        $('#task').append('<input type="checkbox" class="task"  name="expr" unchecked/> ')
        $('#task').append('<label >' + value + '</label>')
    });

    $("#customize").click(function(){
        // task
        var task = $("#task .task")
        $.each(task, function(index){
            if(task[index]["checked"] == true){
                console.log(taskList[index]);
                switch (index) {
                    case 0:
                        hypoGrammar = CDgrm
                        pred = CDpred
                        break;
                    case 1:
                        hypoGrammar = CORRgrm
                        pred = CDpred
                        break;
                    case 2:
                        hypoGrammar = ANOMgrm
                        pred = CDpred
                        break;
                    case 3:
                        hypoGrammar = EXTREgrm
                        pred = CDpred
                        break;
                  }
            }
        })
        
        // attribute
        var attribute = $("#attr .attribute")
        attrList = updateProduction(attribute)
        hypoGrammar['attr'] = attrList
        pred['attr'] = attrList
        // console.log(pred)

        // sent to backend
        httpPostAsync("http://localhost:6969/users", 
                    pred,
                    sendGrammarCallback)
    })

    $("#generateHypo").click(function(){

        var tempRightprod = ""
        $.each(chooseList, function(index){
            if(tempRightprod.length == 0){
                tempRightprod = tempRightprod + "'" + chooseList[index] + "'" 
            }else{
                tempRightprod = tempRightprod + " | " + "'" + chooseList[index] + "'"
            }
        })
        hypoGrammar['subpred'] = tempRightprod

        // sent to backend
        httpPostAsync("http://localhost:6969/hypo", 
                    hypoGrammar,
                    sendComponentsCallback)
    })
});



