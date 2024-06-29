import speech_recognition as sr


class SpeechToText:
  def __init__(self):
    self.recognizer = sr.Recognizer()

  def recognize_from_file(self, audio_file):
    with sr.AudioFile(audio_file) as source:
      audio = self.recognizer.record(source)
      return self.recognizer.recognize_google(audio)

  def listen_and_recognize(self):
    with sr.Microphone() as source:
      print("Listening...")
      try:
        self.recognizer.adjust_for_ambient_noise(source, duration=0.2)
        audio = self.recognizer.listen(source)
        text = self.recognizer.recognize_google(audio)
        text = text.lower()
        print("Did you say: ", text)
      except sr.RequestError as e:
        print("Could not request results; {0}".format(e))
      except sr.UnknownValueError:
        pass


if __name__ == "__main__":
  speech_to_text = SpeechToText()
  while True:
    speech_to_text.listen_and_recognize()
