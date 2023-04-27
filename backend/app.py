from funcs import *

app = Flask(__name__)
CORS(app)

@app.route('/users', methods=["GET", "POST"])
def users():
    print("users endpoint reached...")

    if request.method == "GET":
        # Replace 'file_path' with the path to your file
        df = pd.read_csv('Cars.csv')
        data = df.to_dict(orient='records')

        # Return the file to the frontend
        return jsonify(data)
    
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

        # print(TwochainPL)
        ThreechainPL = []
        for i in range(len(pred_list)):
            for j in range(i+1, len(pred_list)):
                for k in range(i + 2, len(pred_list)):
                    if (pred_list[i][:2] != pred_list[j][:2]) & ( pred_list[i][:2] != pred_list[k][:2] ) & (pred_list[j][:2] != pred_list[k][:2]):
                        ThreechainPL.append(pred_list[i] + " & " + pred_list[j] + " & " + pred_list[k])

        output = OnechainPL + TwochainPL + ThreechainPL

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

        hypoText = gptTranslation()
        print(hypoText)

        return flask.Response(response=json.dumps([newhypo_list, hypoText], indent = 2), status=201)


def gptTranslation():
    openai.api_key = os.getenv("OPENAI_API_KEY")
    model_id = 'gpt-3.5-turbo'
    hypo_path = './hypoList.json'

    with open(hypo_path, 'r') as file:
        hypo_list = json.load(file)

    GPT_message = [
        {'role': 'system', 'content': ''},
        {'role': 'user', 'content': 'Translate these hypothesis to natural language, only reply with the translation results seperated with comma please: divide ( count() [ horsepower > 75 & horsepower < 125], count() ) > 0.75, corr ( acceleration, displacement) < -0.9, max ( horsepower ) [ model = pontiac ]  = max ( horsepower )'},
        {'role': 'assistant', 'content': 'Most values for Horsepower are in the range 75-125, Acceleration and Displacement have a strong inverse correlation, Pontiac Grand Prix has highest value for Horsepower'},
        {'role': 'user', 'content': 'Translate these hypothesis to natural language, only reply with the translation results seperated with comma please:' + ', '.join(hypo_list)}
    ]

    GPT_response = response = openai.ChatCompletion.create(
        model=model_id,
        messages=GPT_message
    )

    # print(GPT_response)
    # print(GPT_response.choices[0].message.content)

    hypoText = GPT_response.choices[0].message.content
    splitText = hypoText.split(",")

    return splitText

if __name__ == "__main__":
    app.debug = True
    app.run("localhost", 6969)
    