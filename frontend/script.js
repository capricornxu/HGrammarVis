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

var attrExamplesNonDuplicate = {"Model": [],
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

// set the dimensions and margins of the graph
const margin = {top: 10, right: 30, bottom: 30, left: 40},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
const svg = d3.select("#attrHist")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          `translate(${margin.left},${margin.top})`);

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
    hypoString = receivedData[0]
    hypoText = receivedData[1]
    console.log(hypoString)
    console.log(hypoText)

    // var returnedHypo

    $.each(hypoString,function(index, data){
        console.log(attrExamples)

        // split hypothesis array by empty space
        hypoArray = $.trim(data).split(/\s+/)
        // constIndex = []

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
        hypoString[index] = hypoArray.join(" ")
    })
    
    // append hypothesis to hypothesis_list
    // $("#hypothesis_list").html(hypoString.join("<br/><br/>"))
    // $("#hypothesis_list").append(hypoText.join("<br/><br/>"))

    // var returnedHypo = hypoString
    $.each(hypoString, function(index, data){
        $("#hypothesis_list").append(hypoString[index])
        var currentText = $('<div>');
        currentText.attr("class", "hypoText");
        currentText.append(hypoText[index] + "<br/><br/>")
        $("#hypothesis_list").append(currentText)
    })
    // $("#hypothesis_list").append(returnedHypo.join("<br/><br/>"))
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
        // var attrExamplesNonDuplicate
        $.each(response, function(index, dictionary) {
            attrExamples["Model"].push(dictionary.Model)
            attrExamples["Cylinders"].push(dictionary.Cylinders)
            attrExamples["Weight"].push(dictionary.Weight)
            attrExamples["MPG"].push(dictionary.MPG)
            attrExamples["Displacement"].push(dictionary.Displacement)
            attrExamples["Horsepower"].push(dictionary.Horsepower)
            attrExamples["Acceleration"].push(dictionary.Acceleration)
            attrExamples["Year"].push(dictionary.Year)
            attrExamples["Origin"].push(dictionary.Origin)

            attrExamplesNonDuplicate["Model"].push(dictionary.Model)
            attrExamplesNonDuplicate["Cylinders"].push(dictionary.Cylinders)
            attrExamplesNonDuplicate["Weight"].push(dictionary.Weight)
            attrExamplesNonDuplicate["MPG"].push(dictionary.MPG)
            attrExamplesNonDuplicate["Displacement"].push(dictionary.Displacement)
            attrExamplesNonDuplicate["Horsepower"].push(dictionary.Horsepower)
            attrExamplesNonDuplicate["Acceleration"].push(dictionary.Acceleration)
            attrExamplesNonDuplicate["Year"].push(dictionary.Year)
            attrExamplesNonDuplicate["Origin"].push(dictionary.Origin)
        });
        
        $.each(attrExamples, function(index, value){
            attrExamples[index] = [...new Set(value)]
            // console.log(attrExamples[index])
            attrExamples[index].sort(function(a, b) {
                return a - b;
            });
        })
        // console.log(attrExamples)

        // read in partial grammar
        // check box for attribute
        $.each(PartialGrammar['attr'], function(index, value) {
            $('#attr').append('<input type="checkbox" class="attribute"  name="attr" unchecked/> ')
            $('#attr').append('<label >' + value + '</label> </br>');

            // draw histogram here
            // $('#attr').append("<figure class='image is-16by9'><img src='https://bulma.io/images/placeholders/128x128.png'></figure>")
            // var data = attrExamplesNonDuplicate[value]

            var histDiv = $("<div>")
            histDiv.attr("id", value)
            $('#attr').append(histDiv)
            var trace = {
                x: attrExamplesNonDuplicate[value],
                type: 'histogram',
                marker: {
                    color: '#a6cee3' // Set the color of the histogram bars to blue
                }
            };
            var layout = {
                width: 250, // Set the width to 800 pixels
                height: 30, // Set the height to 600 pixels
                xaxis: {
                    autorange: true,
                    showgrid: false,
                    zeroline: false,
                    showline: false,
                    autotick: true,
                    ticks: '',
                    showticklabels: false
                },
                yaxis: {
                    autorange: true,
                    showgrid: false,
                    zeroline: false,
                    showline: false,
                    autotick: true,
                    ticks: '',
                    showticklabels: false
                },
                margin: {
                    l: 0, // Set the left margin to 0
                    r: 0, // Set the right margin to 0
                    t: 5, // Set the top margin to 0
                    b: 5  // Set the bottom margin to 0
                  }
            };
            var config = {
                displayModeBar: false
              };
              
            var data = [trace];
            Plotly.newPlot(value, data, layout, config);
        });

        // dropdown for task
        taskList = ["Characterize Distribution", "Correlation", "Find anomalies", "Find extremum"]
        $.each(taskList, function(index, value) {
            $('#taskSelectBox').append($('<option>', {
            value: value,
            text: value
            }));
        });
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



