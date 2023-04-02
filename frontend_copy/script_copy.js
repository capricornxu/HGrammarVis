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
    console.log(JSON.parse(responseText))
}

// main entrance here
$(document).ready(function(){
    // initialize xhr to null
    sentences = null

    $('#send').click(function(){
        // DataToSend = document.getElementById('tgrm').value;
        expr1 = document.getElementById('expr1').value
        pred1 = document.getElementById('pred1').value
        expr2 = document.getElementById('expr2').value
        pred2 = document.getElementById('pred2').value

        const hypo_dict = {
            "expr1": expr1,
            "pred1": pred1,
            "expr2": expr2,
            "pred2":pred2
        }

        httpPostAsync("http://localhost:6969/users", 
                    hypo_dict,
                    sendGrammarCallback)
    })
});

