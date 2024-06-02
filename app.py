import os
from flask import Flask, render_template, request, jsonify
from openai import AzureOpenAI
from dotenv import load_dotenv
import base64
import requests
from mimetypes import guess_type

load_dotenv()

app = Flask(__name__)
UPLOAD_FOLDER = 'uploads'

# Set the OpenAI API key and endpoint from environment variables
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/translate', methods=['POST'])
def translate():
   
    sImageData = None

    # Retrieve input image file and encode the image to base64
    file = request.files.get('file')
    if file:
        sLongImageFn = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
        file.save(sLongImageFn)
        print(f'File uploaded and saved at: {sLongImageFn}')
        sImageData = base64.b64encode(open(sLongImageFn, 'rb').read()).decode('ascii')

    # Retrieve target language
    target_language = request.form.get('target_language')
    
    # Retrieve additional query
    query = request.form.get('query')

    print(f'Target language: {target_language}')
    print(f'User query: {query}')
    
    sEndpoint = os.getenv("OPENAI_API_ENDPOINT")
    sKey = os.getenv("OPENAI_API_KEY")
    sDeployment='real-estate-translator-openai-llm-4o'

    # Initialize messages with the system prompt
    dData = {
        "messages": [
            {
                "role": "system",
                "content": """
                You are an expert multilingual assistant.
                You can read and comprehend content in multiple languages and respond accurately to queries in a language {target_language}. 
                You can interpret input files in various formats and provide precise answers in {target_language} based on the content of these files.
                You can also answer to any query if asked in {target_language}
                """
            }
        ],
        "max_tokens": 100,
        "stream": False,
    }

    
    # Construct the content for the user message
    user_content = None
    if sImageData:
        user_content = f"Describe the content on the image in {target_language} language and provide detailed information."
        if query:
            user_content += f" and answer the following question in {target_language}: {query}"

    # Add the image message if an image was uploaded
    if sImageData:
        image_message = {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": f"{user_content}"
                },
                {
                    "type": "image_url",
                    "image_url": {
                        "url": f"data:image/jpeg;base64,{sImageData}",
                    }
                }
            ]
        }
        dData["messages"].append(image_message)
    
    # Check if a query was provided by the user and append it to the messages
    if not sImageData and query:
        if query:
            user_content = f"Answer the following question in {target_language}: {query}"

        dData["messages"].append({
            "role": "user",
            "content": f"{user_content}"
        })

    
    # Make the API request
    response = requests.post(
        f'{sEndpoint}openai/deployments/{sDeployment}/chat/completions?api-version=2024-02-01',
        headers={'api-key': sKey, 'Content-Type': 'application/json'},
        json=dData
    )

    response_json = response.json()
    print(response_json)

    # Extract the response from the LLM output
    response_text = response_json.get('choices', [{}])[0].get('message', {}).get('content', 'An error occurred.')

    # Return the response as JSON
    return jsonify({'response_text': response_text})

if __name__ == '__main__':
    app.run(debug=True)


