// Grammar components
// expr1 = "expr -> func '(' var ')' | var \n \
// var -> attr | const \n \
// op -> '=' | '<' \n \
// attr -> 'customer_id' | 'first_name' | 'last_name' | 'age' | 'country' \n \
// const -> 'number' | 'string' \n \
// func -> 'AVG' | 'MAX' | 'MIN' | 'COUNT' \n \
// "

const hypoGrammar = {
    "root": "hypo",
    "hypo": "expr '[' pred ']' op expr '[' pred ']'",
    "expr": "func '(' var ')' | var",
    "var": "attr | const",
    "pred": "var op const | ",
    "op":"'=' | '<' | '>'",
    "attr": "'customer_id' | 'first_name' | 'last_name' | 'age' | 'country'",
    "const": "'number' | 'string'",
    "func": "'AVG' | 'MAX' | 'MIN' | 'COUNT'"
}

const expr = {
    "expr": "func '(' var ')' | var",
    "var": "attr | const",
    "attr": "'customer_id' | 'first_name' | 'last_name' | 'age' | 'country'",
    "const": "'number' | 'string'",
    "func": "'AVG' | 'MAX' | 'MIN' "
}

const pred = {
    "pred": "var op const | ",
    "var": "attr | const",
    "op":"'=' | '<' | '>'",
    "attr": "'customer_id' | 'first_name' | 'last_name' | 'age' | 'country'",
    "const": "'number' | 'string'",
    "func": "'AVG' | 'MAX' | 'MIN' | 'COUNT'"
}

var exprList = []
var predList = []
var expr1List = []
var pred1List = []
var expr2List = []
var pred2List = []

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
    console.log(JSON.parse(responseText))
    exprList = receivedData[0]
    predList = receivedData[1]
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
            if(index == userChoice.length - 1){
                tempRightprod = tempRightprod + "'" + label_name + "'" 
            }else{
                tempRightprod = tempRightprod + "'" + label_name + "'" + " | "
            }
        }
    }
    return tempRightprod
}

function showChooseBox(componentList, option) {
    $("#chooseBox").empty()

    $.each(componentList, function(index, value){
        li = $("<li/>").addClass("list-item")
                    .attr("data-item", value)
                    .text(value)
                    .appendTo("#chooseBox")

        li.on('click', function(){
            $(this).addClass('selected');
            if (option == "expr1"){
                expr1List.push($(this).attr("data-item"))
            }else if(option == "pred1"){
                pred1List.push($(this).attr("data-item"))
            }else if(option == "expr2"){
                expr2List.push($(this).attr("data-item"))
            }else{
                pred2List.push($(this).attr("data-item"))
            }
            console.log(expr1List)
            console.log(pred1List)
            console.log(expr2List)
            console.log(pred2List)
        });
    })

    $("#chooseBox li").each(function(){
        value = $(this).attr("data-item")
        if(option == "expr1"){
            if($.inArray(value, expr1List) != -1){
                $(this).addClass("selected")
            }
        }else if(option == "pred1"){
            if($.inArray(value, pred1List) != -1){
                $(this).addClass("selected")
            }
        }else if(option == "expr2"){
            if($.inArray(value, expr2List) != -1){
                $(this).addClass("selected")
            }
        }else{
            if($.inArray(value, pred2List) != -1){
                $(this).addClass("selected")
            }
        }
        
    })

    return li
}

// main entrance here
$(document).ready(function(){

    $("#customize").click(function(){
        // update expr
        var expr_attr = $("#expr .attribute")
        expr["attr"] = updateProduction(expr_attr)
        var expr_const = $("#expr .const")
        expr["const"] = updateProduction(expr_const)
        var expr_func = $("#expr .function")
        expr["func"] = updateProduction(expr_func)

        // update pred
        var pred_attr = $("#pred .attribute")
        pred["attr"] = updateProduction(pred_attr)
        var pred_const = $("#pred .const")
        pred["const"] = updateProduction(pred_const)
        var pred_func = $("#pred .function")
        pred["func"] = updateProduction(pred_func)

        // sent to backend
        httpPostAsync("http://localhost:6969/users", 
                    [expr, pred],
                    sendGrammarCallback)
        
        
    })

    $("#component").change(function(){
        var value = $("#component option:selected").text()
        if(value == "expr1" || value == "expr2"){
            console.log(exprList)
            li = showChooseBox(exprList, value)
        }else if(value == "pred1" || value == "pred2"){
            li = showChooseBox(predList, value)
        }
    })

    $("#generateHypo").click(function(){
        // sent to backend
        httpPostAsync("http://localhost:6969/hypo", 
                    [expr1List, pred1List, expr2List, pred2List, hypoGrammar],
                    sendComponentsCallback)
    })
});



