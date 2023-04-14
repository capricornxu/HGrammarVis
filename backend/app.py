from funcs import *

app = Flask(__name__)
CORS(app)

@app.route('/users', methods=["GET", "POST"])
def users():
    print("users endpoint reached...")

    if request.method == "GET":
        with open("sentence.json", "r") as f:
            data = json.load(f)
            return flask.jsonify(data)
    
    if request.method == "POST":
        received_data = request.get_json()
        # expr
        exprDict = received_data[0]
        exprString = dictTostring(exprDict)
        exprGrammar = CFG.fromstring(exprString)
        expr_list = Iterator(exprGrammar, "expr")
        # evaluation(exprGrammar,"Cars.db", "Cars_id.csv", "expr")

        #pred
        predDict = received_data[1]
        predString = dictTostring(predDict)
        predGrammar = CFG.fromstring(predString)
        pred_list = Iterator(predGrammar, "pred")

        output = [expr_list, pred_list]

        return flask.Response(response=json.dumps(output, indent = 2), status=201)


@app.route('/hypo', methods=["GET", "POST"])
def hypo():
    if request.method == "POST":
        received_data = request.get_json()
        expr1 = received_data[0]
        pred1 = received_data[1]
        expr2 = received_data[2]
        pred2 = received_data[3]
        hypoString = dictTostring(received_data[4])
        hypoGrammar = CFG.fromstring(hypoString)
        # print(hypoGrammar)

        op = ["<", "="]
        sentArray = []
        for e1 in expr1:
            for p1 in pred1:
                for e2 in expr2:
                    for p2 in pred2:
                        sent1 = e1 + " [ " + p1 + " ] " + " < " + e2 + " [ " + p2 + " ] "
                        sent2 = e1 + " [ " + p1 + " ] " + " = " + e2 + " [ " + p2 + " ] "
                        # eval1 = evaluation(sent1, hypoGrammar)
                        # sentArray.append([sent1, eval1])
                        sentArray.append(sent1)

                        # eval2 = evaluation(sent2, hypoGrammar)
                        # sentArray.append([sent2, eval2])
                        sentArray.append(sent2)
        
        return flask.Response(response=json.dumps(sentArray, indent = 2), status=201)

if __name__ == "__main__":
    app.debug = True
    app.run("localhost", 6969)
    