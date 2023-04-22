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
        #pred
        predDict = received_data
        print(predDict)
        predString = dictTostring(predDict)
        predGrammar = CFG.fromstring(predString)
        pred_list = Iterator(predGrammar, "pred")
        print(pred_list[0])
        print(pred_list[0][:2])

        OnechainPL = pred_list
        TwochainPL = []
        for i in range(len(pred_list)):
            for j in range(i+1, len(pred_list)):
                if pred_list[i][:2] != pred_list[j][:2]:
                    TwochainPL.append(pred_list[i] + " & " + pred_list[j])
                    

        print(TwochainPL)
        output = OnechainPL + TwochainPL

        return flask.Response(response=json.dumps(output, indent = 2), status=201)


@app.route('/hypo', methods=["GET", "POST"])
def hypo():
    if request.method == "POST":
        received_data = request.get_json()
        hypoString = dictTostring(received_data)
        hypoGrammar = CFG.fromstring(hypoString)
        print(hypoGrammar)
        hypo_list = Iterator(hypoGrammar, "hypo")
        newhypo_list = []
        for hypo in hypo_list:
           new_hypo = hypo.replace(' [ ]', '')
           newhypo_list.append(new_hypo)

        # Open a file for writing
        with open('hypoList.json', 'w') as f:
            # Convert the array to JSON data and write it to the file
            json.dump(newhypo_list, f)


        return flask.Response(response=json.dumps(newhypo_list, indent = 2), status=201)

if __name__ == "__main__":
    app.debug = True
    app.run("localhost", 6969)
    