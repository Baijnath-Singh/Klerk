import os
from flask import Flask, render_template, request, jsonify
from dotenv import load_dotenv
import base64
import requests
from pymongo import MongoClient
from datetime import datetime, timezone
import openai

load_dotenv()

app = Flask(__name__)
UPLOAD_FOLDER = 'uploads'

# Set the OpenAI API key and endpoint from environment variables
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Initialize MongoDB client
client = MongoClient(os.getenv('DB_CONNECTION_STRING'))
db = client['karnatakaLegalBook']
collection = db['KarnatakaLegalBook']

# Initialize OpenAI API
openai_api_key = os.getenv("OPENAI_API_KEY")
openai_api_endpoint = os.getenv("OPENAI_API_ENDPOINT")
openai_deployment = os.getenv("OPENAI_LLM_4_O")
openai_embedding = os.getenv("OPENAI_LLM_EMBEDDING")

def generate_embeddings(text, engine):
    """
    Generate embeddings for a given text using the specified Azure OpenAI embedding model.

    Args:
        text (str): The input text to generate embeddings for.
        engine (str): The Azure OpenAI embedding model to use.

    Returns:
        list: A list of embedding vectors.
    """
    response = requests.post(
        f'{openai_api_endpoint}/openai/deployments/{engine}/embeddings?api-version=2023-06-01-preview',
        headers={
            'api-key': openai_api_key,
            'Content-Type': 'application/json'
        },
        json={
            "input": text,
        }
    )

    response_json = response.json()
    embeddings = response_json['data'][0]['embedding']
    return embeddings

def vector_search(collection_name, query_embedding, num_results=1):
    """
    Perform a vector search on the specified collection by vectorizing
    the query and searching the vector index for the most similar documents.

    returns a list of the top num_results most similar documents
    """
    collection = db[collection_name]    
    pipeline = [
        {
            '$search': {
                "cosmosSearch": {
                    "vector": query_embedding,
                    "path": "contentVector",
                    "k": num_results
                },
                "returnStoredSource": True }},
        {'$project': { 'similarityScore': { '$meta': 'searchScore' }, 'document' : '$$ROOT' } }
    ]
    results = collection.aggregate(pipeline)
    return results


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
    
    # Step 1: Create embeddings on input prompt
    query_embedding = generate_embeddings(query, engine=openai_embedding)  # Example embedding model 
    #print("query_embedding: ", query_embedding)

    # Step 2: Perform vector search in Cosmos DB
    response = vector_search("KarnatakaLegalBook", query_embedding, 1)  # Assuming your collection supports vector search
    print("vector_search response", response)

    # Step 3: Augment the input prompt with retrieved text
    results = list(response)
    if results:
        for doc in response:
            print("Question", doc['document']['question'])
            print("Answer", doc['document']['answer'])
            query += f"\n\n{doc['document']['question']}\n{doc['document']['answer']}"
    
    print("augmented query:", query)

    sEndpoint = openai_api_endpoint
    sKey = openai_api_key
    sDeployment = openai_deployment

    # Initialize messages with the system prompt
    dData = {
        "messages": [
            {
                "role": "system",
                "content": """
                Your name is Klerk
                You are an expert Multilingual Clerk with vast knowledge of government rules, policies, regulations, scheme, offers etc.
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

#if __name__ == '__main__':
    #app.run(debug=True)


