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

var pred = {
    "pred": " var op const",
    "var": "attr | const",
    "op":"'=' | '<' | '>'",
    "attr": "'Model' | 'MPG' | 'Cylinders' | 'Displacement' | 'Horsepower' | 'Weight' | 'Acceleration' | 'Year' | 'Origin'",
    "const": "'number' | 'string'",
}

const CDgrm = {
    "hypo": "expr '=' 'number' ",
    "expr": " 'DIVIDE' '(' 'COUNT' '('  ')' '[' subpred ']' ',' 'COUNT' '('  ')' '[' pred ']' ')' ",
    "op":"'=' | '<' | '>'",
    "var": "attr | const ",
    "attr": "'Model' | 'MPG' | 'Cylinders' | 'Displacement' | 'Horsepower' | 'Weight' | 'Acceleration' | 'Year' | 'Origin'",
    "const": "'number' | 'string'",
    "func": "'DIVIDE' | 'COUNT' | 'Q1' ",
    "pred": " | subpred ",
    "subpred": " "
}

const CDpred = {
    "pred": " var op const ",
    "func": "'Q1' | 'Q3'",
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
    "hypo": " 'MAX' '(' expr ')' '<' 'Q1 - 1.5 * IQR' | 'MIN' '(' expr ')' '>' 'Q3 + 1.5 * IQR'",
    "expr": " attr '[' 'Model' '=' 'string' ']'",
    "op": "'=' | '<' | '>'",
    "var": "attr | const ",
    "const": "'number' | 'string'",
    "func": "'DIVIDE' | 'COUNT' | 'Q1' ",
    "pred": " subpred ",
    "subpred": " "
}

const ANOMpred = {
    "pred": "",
}

const EXTREgrm = {
    "hypo": "'COUNT' '(' ')' '[' pred ']' op COUNT '[' '!' '(' pred ')' ']'",
    "hypo": "'MAX' '(' attr ')' op 'MAX' '(' attr ')' '[' pred ']' ",
    "hypo": "'MIN' '(' attr ')' op 'MIN' '(' attr ')' '[' pred ']' ",
    "hypo": "'AVG' '(' attr ')' op 'AVG' '(' attr ')' '[' pred ']' ",  
    "op":"'=' | '<' | '>'",
    "var": "attr ",
    "attr": "'Model' | 'MPG' | 'Cylinders' | 'Displacement' | 'Horsepower' | 'Weight' | 'Acceleration' | 'Year' | 'Origin'",
    "const": "'number' | 'string'",
    "func": "'MIN' | 'AVG' | 'MAX' ",
    "pred": " | subpred ",
    "subpred": " "
}

var attrExamples = {"Model": [],
                "MPG": [],
                "Cylinders": [],
                "Displacement": [],
                "Horsepower": [],
                "Weight": [],
                "Acceleration": [],
                "Year": [],
                "Origin": []
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

    $.each(receivedData,function(index, data){
        console.log(attrExamples)

        // split hypothesis array by empty space
        hypoArray = $.trim(data).split(/\s+/)
        constIndex = []

        $.each(hypoArray, function(index, element) {
            // find the indices of number and string in the array
            if (element === "string" || element === "number") {
                targetElement = hypoArray[index - 2]
                // check the target word, if it's an attribute
                if ($.inArray(targetElement, Object.keys(attrExamples)) !== -1){
                    // console.log(targetElement)
                    // console.log(attrExamples[targetElement])

                    // create select
                    var select = $('<select>');

                    $.each(attrExamples[targetElement], function(index, value) {
                        var option = $('<option>').text(value);
                        select.append(option);
                    });

                    hypoArray[index] = select.prop('outerHTML')
                    // console.log(hypoArray)
                }
            }
        });
        receivedData[index] = hypoArray.join(" ")
    })
    
    // append hypothesis to hypothesis_list
    $("#hypothesis_list").html(receivedData.join("<br/><br/>"))
}

// update production based on the choice of attributes
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

// show choose box of predicate list
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
    // get the data from backend and update attrExamples
    $.get('http://localhost:6969/users', function(response) {
        $.each(response, function(index, dictionary) {
            attrExamples["Model"].push(dictionary.Model)
            attrExamples["Cylinders"].push(dictionary.Cylinders)
            attrExamples["MPG"].push(dictionary.MPG)
            attrExamples["Displacement"].push(dictionary.Displacement)
            attrExamples["Horsepower"].push(dictionary.Horsepower)
            attrExamples["Acceleration"].push(dictionary.Acceleration)
            attrExamples["Year"].push(dictionary.Year)
            attrExamples["Origin"].push(dictionary.Origin)
        });
        // console.log(attrExamples)
        $.each(attrExamples, function(index, value){
            attrExamples[index] = [...new Set(value)]
            // console.log(attrExamples[index])
            attrExamples[index].sort(function(a, b) {
                return a - b;
            });
        })
        // console.log(attrExamples)
    });

    // read in partial grammar
    // check box for attribute
    $.each(PartialGrammar['attr'], function(index, value) {
        $('#attr').append('<input type="checkbox" class="attribute"  name="attr" unchecked/> ')
        $('#attr').append('<label >' + value + '</label> </br>');
    });

    // dropdown for task
    taskList = ["Characterize Distribution", "Correlation", "Find anomalies", "Find extremum"]
    $.each(taskList, function(index, value) {
        $('#taskSelectBox').append($('<option>', {
          value: value,
          text: value
        }));
    });

    $("#customize").click(function(){
        // task
        var task = $("#task .task")
        var selectedOption = $("#task #taskSelectBox").val();
        console.log(selectedOption)
        switch (selectedOption) {
            case taskList[0]:
                hypoGrammar = CDgrm
                pred = CDpred
                break;
            case taskList[1]:
                hypoGrammar = CORRgrm
                // pred = pred
                break;
            case taskList[2]:
                hypoGrammar = ANOMgrm
                pred = ANOMpred
                break;
            case taskList[3]:
                hypoGrammar = EXTREgrm
                // pred = pred
                break;
        }
        
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



