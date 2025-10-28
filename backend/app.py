from flask import Flask, request, jsonify
import requests
from flask_cors import CORS
import os
from dotenv import load_dotenv




load_dotenv()

app = Flask(__name__)
CORS(app)  # This will enable CORS for all routes
@app.route("/")
def home():
    return "Hello, Flask!"

GROQ_API_KEY = os.getenv("GROQ_API_KEY")


@app.route("/prompt", methods=["POST"])
def prompt_llama():
    try:
        # Get request data
        request_data = request.json
        user_input = request_data.get("prompt")
        params_list = request_data.get("params", [])
        
        # Print incoming request for debugging
       
        if not user_input:
            return jsonify({"error": "Prompt is required"}), 400
        
        if not params_list or len(params_list) != 3:
            return jsonify({"error": "Exactly 3 parameter objects are required"}), 400

        headers = {
            "Authorization": f"Bearer {GROQ_API_KEY}",
            "Content-Type": "application/json"
        }
        
        responses = []
        
        # Make a request for each parameter set
        for i, params in enumerate(params_list):
            # Validate parameter structure
            if not all(key in params for key in ["temperature", "top_p", "max_tokens"]):
                return jsonify({"error": f"Invalid parameter structure in item {i+1}"}), 400
            
            data = {
                "model": "llama-3.1-8b-instant",
                "messages": [
                    {"role": "user", "content": user_input}
                ],
                "temperature": params["temperature"],
                "top_p": params["top_p"],
                "max_tokens": params["max_tokens"]
            }

            try:
                print(f"Sending request {i+1} to GROQ API...")
                response = requests.post(
                    "https://api.groq.com/openai/v1/chat/completions",
                    headers=headers,
                    json=data
                )
                
                result = response.json()
                
                # Print formatted response
              
                responses.append({
                    "request_index": i + 1,
                    "parameters": params,
                    "response": result["choices"][0]["message"]["content"]
                })
                
            except Exception as e:
                print(f"\n❌ Error in request {i+1}: {str(e)}\n")
                responses.append({
                    "request_index": i + 1,
                    "parameters": params,
                    "error": str(e)
                })
        

        for i, res in enumerate(responses):
            if "error" in res:
                print(f"Request {i+1}: ❌ Failed - {res['error']}")
            else:
                print(f"Request {i+1}: ✅ Success")
        
        return jsonify({
            "prompt": user_input,
            "total_requests": len(responses),
            "responses": responses
        })
        
    except Exception as e:
        print(f"\n❌ Fatal error: {str(e)}\n")
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
