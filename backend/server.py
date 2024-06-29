from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from speech_to_text import SpeechToText
from pydub import AudioSegment
import io

app = Flask(__name__)
CORS(app)


@app.route("/")
def root():
  return "Welcome to my text to audio api!"


@app.route('/upload_audio', methods=['POST'])
def upload_audio():
  # Check if the post request has the file part
  if 'audioFile' not in request.files:
    return jsonify({'error': 'request.files does not contain \'audioFile\''}), 400
  file = request.files['audioFile']
  # If the user does not select a file, the browser submits an
  # empty file without a filename.
  if file.filename == '':
    return jsonify({'error': 'No selected file'}), 400

  if file:
    speech_to_text = SpeechToText()

    try:
      # Load the webm file
      audio = AudioSegment.from_file(io.BytesIO(file.read()), codec="opus")

      # Delete output.wav if it exists
      if os.path.exists("output.wav"):
        os.remove("output.wav")

      # Convert audio to wav
      audio.export("output.wav", format="wav")

      # Text to speech
      text = speech_to_text.recognize_from_file("output.wav")

      filename = file.filename
      return jsonify({'message': text, 'filename': filename}), 200
    except Exception as e:
      # Log the error for debugging purposes
      print(f"Error processing the audio file: {e}")

      # Return a JSON response with the error message
      return jsonify({'error': 'Failed to process the audio file'}), 500


if __name__ == '__main__':
  app.run(host="localhost", port=5000, debug=True)
