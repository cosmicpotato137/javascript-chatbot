from gtts import gTTS
import pygame
import io


class TextToSpeech:
  def __init__(self, language='en', slow=False):
    self.language = language
    self.slow = slow

  def convert_and_play(self, text):
    tts = gTTS(text=text, lang=self.language, slow=self.slow)
    mp3_fp = io.BytesIO()
    tts.write_to_fp(mp3_fp)
    mp3_fp.seek(0)
    pygame.mixer.init()
    pygame.mixer.music.load(mp3_fp)
    pygame.mixer.music.play()
    while pygame.mixer.music.get_busy():
      pygame.time.Clock().tick(10)


if __name__ == "__main__":
  text = 'Welcome to geeksforgeeks!'
  tts = TextToSpeech()
  tts.convert_and_play(text)
