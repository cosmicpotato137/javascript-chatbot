"use client";

import { useState, useEffect, useRef } from "react";

const Page = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState<Blob | null>(null);
  const [text, setText] = useState<string>("");
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
          setRecordedAudio(recordedBlob); // Ensure this line is executed
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

  useEffect(() => {
    if (!isRecording && recordedAudio) {
      sendRecording();
    }
  }, [isRecording, recordedAudio]); // This ensures sendRecording is called after recordedAudio is set

  const sendRecording = () => {
    if (recordedAudio) {
      console.log("Sending recording to server");
      const formData = new FormData();
      formData.append("audioFile", recordedAudio, "recording.webm");

      fetch("http://localhost:5000/upload_audio", {
        method: "POST",
        body: formData,
      })
        .then((response) => {
          if (response.ok) {
            console.log("Success: 200 response code");
            return response.json();
          } else {
            console.log("Error: " + response.status);
            throw new Error("Request failed with status " + response.status);
          }
        })
        .then((data) => {
          console.log(data.message);
          setText(data.message);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  };

  return (
    <div>
      <button
        onClick={isRecording ? stopRecording : startRecording}
        style={{ border: "none", background: "none" }}
      >
        <img
          src={isRecording ? "stop-recording.svg" : "start-recording.svg"}
          alt={isRecording ? "Stop Recording" : "Start Recording"}
          style={{ width: "24px", height: "24px" }}
        />
      </button>
      <p>{text}</p>
    </div>
  );
};

export default Page;
