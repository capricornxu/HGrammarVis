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
        expr1 = received_data['expr1']
        pred1 = received_data['pred1']
        expr2 = received_data['expr2']
        pred2 = received_data['pred2']

        hypotheses = combine_prds(received_data)

        return flask.Response(response=json.dumps(hypotheses, indent = 2), status=201)

if __name__ == "__main__":
    app.debug = True
    app.run("localhost", 6969)
    