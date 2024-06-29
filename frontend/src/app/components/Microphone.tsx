"use client";

import React, { useState, useRef } from "react";

interface MicrophoneParams {
  setAudio: (text: Blob) => void;
}

const Microphone: React.FC<MicrophoneParams> = ({ setAudio }) => {
  const [isRecording, setIsRecording] = useState(false);
  // const [recordedAudio, setRecordedAudio] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const startRecording = () => {
    setIsRecording(true);
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        let chunks: Blob[] = [];

        mediaRecorder.addEventListener("dataavailable", (event) => {
          chunks.push(event.data);
        });

        mediaRecorder.addEventListener("stop", () => {
          const recordedBlob = new Blob(chunks, { type: "audio/webm" });
          // setRecordedAudio(recordedBlob); // Ensure this line is executed
          setAudio(recordedBlob);
          chunks = []; // Clear chunks after setting the recorded audio
        });

        mediaRecorder.start();
      })
      .catch((error) => {
        console.error("Error accessing microphone:", error);
      });
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop(); // This triggers the 'stop' event listener
      setIsRecording(false);
    }
  };

  return (
    <button onClick={isRecording ? stopRecording : startRecording}>
      <img
        src={isRecording ? "stop-recording.svg" : "start-recording.svg"}
        alt={isRecording ? "Stop Recording" : "Start Recording"}
        style={{ width: "24px", height: "24px" }}
      />
    </button>
  );
};

export default Microphone;
