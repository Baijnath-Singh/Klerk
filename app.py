import os
import time
from flask import Flask, render_template, request, jsonify
from dotenv import load_dotenv
import requests
from pymongo import MongoClient
from azure.core.credentials import AzureKeyCredential
from azure.ai.formrecognizer import DocumentAnalysisClient
import azure.cognitiveservices.speech as speech_sdk
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
collection = db['document_registration']

# Initialize OpenAI API
openai_api_key = os.getenv("OPENAI_API_KEY")
openai_api_endpoint = os.getenv("OPENAI_API_ENDPOINT")
openai_deployment = os.getenv("OPENAI_LLM_4_O")
openai_embedding = os.getenv("OPENAI_LLM_EMBEDDING")

# Initialize Azure Form Recognizer Client
form_recognizer_endpoint = os.getenv("DOCUMENT_ANALYSIS_ENDPOINT")
form_recognizer_key = os.getenv("DOCUMENT_ANALYSIS_KEY")
document_analysis_client = DocumentAnalysisClient(
    endpoint=form_recognizer_endpoint,
    credential=AzureKeyCredential(form_recognizer_key)
)

# Initialize Azure Speech Services
speech_api_key = os.getenv('SPEECH_KEY')
speech_api_region = os.getenv('SPEECH_REGION')
speech_config = speech_sdk.SpeechConfig(speech_api_key, speech_api_region)

"""
languageToSpeechCode will return speech code and speech synthesis voice name based on the language
"""
def languageToSpeechCode(language):
    speechCode = 'en-US'
    speechSynthesisVoiceName = "en-GB-RyanNeural"
    if language == 'hi':
        speechCode = 'hi-IN'
        speechSynthesisVoiceName = "hi-IN-SwaraNeural"
    elif language == 'kn':
        speechCode = 'kn-IN'
        speechSynthesisVoiceName = "kn-IN-VinayNeural"
    elif language == 'ta':
        speechCode = 'ta-IN'
        speechSynthesisVoiceName = "ta-IN-ValluvarNeural"
    elif language == 'te':
        speechCode = 'te-IN'
        speechSynthesisVoiceName = "te-IN-MohanaNeural"
    elif language == 'mr':
        speechCode = 'mr-IN'
        speechSynthesisVoiceName = "mr-IN-AarohiNeural"
    elif language == 'gu':
        speechCode = 'gu-IN'
        speechSynthesisVoiceName = "gu-IN-DhvaniNeural"
    elif language == 'ml':
        speechCode = 'ml-IN'
        speechSynthesisVoiceName = "ml-IN-AadhyaNeural"
    elif language == 'or':
        speechCode = 'or-IN'
        speechSynthesisVoiceName = "or-IN-LekhaNeural"
    elif language == 'ur':
        speechCode = 'ur-PK'
        speechSynthesisVoiceName = "ur-PK-AsadNeural"
    elif language == 'as':
        speechCode = 'as-IN'
        speechSynthesisVoiceName = "as-IN-AhirbhudnyaNeural"
    elif language == 'bn':
        speechCode = 'bn-IN'
        speechSynthesisVoiceName = "bn-IN-ArunNeural"
    elif language == 'pa':
        speechCode = 'pa-IN'
        speechSynthesisVoiceName = "pa-IN-AkalNeural"
    elif language == 'zh':
        speechCode = 'zh-CN'
        speechSynthesisVoiceName = "zh-CN-XiaoxiaoNeural"
    elif language == 'es':
        speechCode = 'es-ES'
        speechSynthesisVoiceName = "es-ES-ElviraNeural"
    elif language == 'fr':
        speechCode = 'fr-FR'
        speechSynthesisVoiceName = "fr-FR-DeniseNeural"
    elif language == 'ar':
        speechCode = 'ar-SA'
        speechSynthesisVoiceName = "ar-SA-ZubaydaNeural"
    elif language == 'pt':  
        speechCode = 'pt-BR'
        speechSynthesisVoiceName = "pt-BR-FranciscaNeural"
    elif language == 'ru':
        speechCode = 'ru-RU'
        speechSynthesisVoiceName = "ru-RU-SvetlanaNeural"
    elif language == 'de':
        speechCode = 'de-DE'
        speechSynthesisVoiceName = "de-DE-KatjaNeural"
    elif language == 'ja':
        speechCode = 'ja-JP'
        speechSynthesisVoiceName = "ja-JP-AyumiNeural"
    elif language == 'ko':
        speechCode = 'ko-KR'
        speechSynthesisVoiceName = "ko-KR-SunHiNeural"
    elif language == 'vi':
        speechCode = 'vi-VN'
        speechSynthesisVoiceName = "vi-VN-HoaiMyNeural"
    elif language == 'it':
        speechCode = 'it-IT'
        speechSynthesisVoiceName = "it-IT-ElsaNeural"
    elif language == 'tr':
        speechCode = 'tr-TR'
        speechSynthesisVoiceName = "tr-TR-EmelNeural"
    elif language == 'ms':
        speechCode = 'ms-MY'
        speechSynthesisVoiceName = "ms-MY-YasminNeural"
    elif language == 'fa':
        speechCode = 'fa-IR'
        speechSynthesisVoiceName = "fa-IR-ParisaNeural"
    elif language == 'th':
        speechCode = 'th-TH'
        speechSynthesisVoiceName = "th-TH-AcharaNeural"
    elif language == 'nl':
        speechCode = 'nl-NL'
        speechSynthesisVoiceName = "nl-NL-ColetteNeural"
    elif language == 'el':  
        speechCode = 'el-GR'
        speechSynthesisVoiceName = "el-GR-AthinaNeural"
    elif language == 'he':
        speechCode = 'he-IL'
        speechSynthesisVoiceName = "he-IL-HilaNeural"
    elif language == 'sv':
        speechCode = 'sv-SE'
        speechSynthesisVoiceName = "sv-SE-HilleviNeural"
    elif language == 'da':
        speechCode = 'da-DK'
        speechSynthesisVoiceName = "da-DK-HelleNeural"
    # Return both speechCode and speechSynthesisVoiceName
    return speechCode, speechSynthesisVoiceName

def generate_text_to_speech(response_text, language='en-US'):
    """
    Generate text-to-speech audio from a given text using Azure Speech Services.
    """
    # Set the speech synthesis language and voice
    speechCode, speechSynthesisVoiceName = languageToSpeechCode(language)
    speech_config.speech_synthesis_voice_name = speechSynthesisVoiceName
    speech_config.speech_synthesis_language = speechCode
    speech_synthesizer = speech_sdk.SpeechSynthesizer(speech_config)

    speak = speech_synthesizer.speak_text_async(response_text).get()
    print(f"Speech synthesis status: {speak.reason}")
    if speak.reason != speech_sdk.ResultReason.SynthesizingAudioCompleted:
        print(speak.reason)
    
    # Print the response
    print(response_text)

def generate_speech_to_text(audio_file_path, language='en-US'):
    """
    Generate speech-to-text transcription from an audio file using Azure Speech Services.
    """
    command = ''

    audio_config = speech_sdk.AudioConfig(use_default_microphone=True)
    speech_recognizer = speech_sdk.SpeechRecognizer(speech_config, audio_config)
    print('Speak now...')

    # Process speech input
    speech = speech_recognizer.recognize_once_async().get()
    if speech.reason == speech_sdk.ResultReason.RecognizedSpeech:
        command = speech.text
        print(command)
    else:
        print(speech.reason)
        if speech.reason == speech_sdk.ResultReason.Canceled:
            cancellation = speech.cancellation_details
            print(cancellation.reason)
            print(cancellation.error_details)

    # Return the command
    return command

    
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

def extract_text_from_file(file_path):
    """
    Extract text from a file using Azure Form Recognizer's Read model.

    Args:
        file_path (str): The path to the file to be analyzed.

    Returns:
        str: The extracted text from the file.
    """
    with open(file_path, "rb") as file:
        poller = document_analysis_client.begin_analyze_document("prebuilt-read", file)
        result = poller.result()

    # Extract text content from lines
    extracted_text = " ".join([line.content for page in result.pages for line in page.lines])
    return extracted_text

def retry_request(url, headers, json_data, max_retries=12, delay=5):
    attempts = 0
    while attempts < max_retries:
        response = requests.post(url, headers=headers, json=json_data)
        if response.status_code == 429:
            attempts += 1
            print(f"Rate limit exceeded. Retrying in {delay} seconds... (Attempt {attempts}/{max_retries})")
            time.sleep(delay)
        else:
            return response
    response.raise_for_status()


@app.route('/')
def index():
    return render_template('index.html')

@app.route('/translate', methods=['POST'])
def translate():
    sLongImageFn = None

    # Retrieve input image file
    file = request.files.get('file')
    if file:
        sLongImageFn = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
        file.save(sLongImageFn)
        print(f'File uploaded and saved at: {sLongImageFn}')
        
    try:
        # Extract text from file using Document Intelligence Read model
        extracted_text = extract_text_from_file(sLongImageFn) if sLongImageFn else ""

        # Retrieve target language
        target_language = request.form.get('target_language', 'english')
    
        # Retrieve additional query
        query = request.form.get('query', '')

        print(f'Target language: {target_language}')
        print(f'User query: {query}')
        print(f'Extracted text from file: {extracted_text}')
    
        # Combine query and extracted text for embedding generation
        combined_query = query if query else extracted_text
        print("combined_query:", combined_query)

        # Step 1: Create embeddings on input prompt
        query_embedding = generate_embeddings(combined_query, engine=openai_embedding)

        # Step 2: Perform vector search in Cosmos DB only if there is a query
        if query:
            response = vector_search("document_registration", query_embedding, 1)
            print("vector_search response", response)

            # Step 3: Augment the input prompt with retrieved text
            #results = list(response)
            #if results:
            for doc in response:
                print("Question", doc['document']['question'])
                print("Answer", doc['document']['answer'])
                combined_query += f"\n\n{doc['document']['question']}\n{doc['document']['answer']}"
        
        print("augmented query:", combined_query)

        sEndpoint = openai_api_endpoint
        sKey = openai_api_key
        sDeployment = openai_deployment

        # Initialize messages with the system prompt
        dData = {
            "messages": [
                {
                    "role": "system",
                    "content": f"""
                    Your name is Klerk.
                    You are an expert Multilingual Clerk with vast knowledge of government rules, policies, regulations, schemes, offers, etc.
                    You can read and comprehend content in multiple languages and respond accurately to queries in {target_language}. 
                    You can interpret input files in various formats and provide detail answers in {target_language} based on the content of these files.
                    You can also answer any query if asked in {target_language}.
                    You can make sure to capture:
                    1.Any section numbers, clauses, obligations, conditions, Act
                    2.Dates including effective dates, expiration dates, titles, and any other relevant time frames.
                    """
                }
            ],
            "max_tokens": 1000,
            "stream": False,
        }

        # Construct the content for the user message
        user_content = f"Answer the following question in {target_language}: {query}\n\nContent extracted from the input file:\n{extracted_text}"

        # Add the user message
        dData["messages"].append({
            "role": "user",
            "content": f"{user_content}"
        })

        # Make the API request
        response = retry_request(
            f'{sEndpoint}openai/deployments/{sDeployment}/chat/completions?api-version=2024-02-01',
            headers={'api-key': sKey, 'Content-Type': 'application/json'},
            json_data=dData
        )

        response_json = response.json()
        print(response_json)

        # Extract the response from the LLM output
        response_text = response_json.get('choices', [{}])[0].get('message', {}).get('content', 'An error occurred.')

        # Generate text-to-speech audio from the response
        generate_text_to_speech(response_text, language=target_language)

        # Return the response as JSON
        return jsonify({'response_text': response_text})
    finally:
        # Delete the file after processing
        if sLongImageFn and os.path.exists(sLongImageFn):
            os.remove(sLongImageFn)
            print(f'File {sLongImageFn} has been deleted.')

#if __name__ == '__main__':
    #app.run(debug=True)



