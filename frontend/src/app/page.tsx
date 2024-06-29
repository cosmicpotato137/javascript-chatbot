"use client";

import React, { useRef, useEffect, useState } from "react";
import { useChat, CreateMessage } from "ai/react";
import Microphone from "./components/Microphone";
import { speechRecognition } from "./api/SpeechRecognition";

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit, append } =
    useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);
  const inputElement = useRef<HTMLInputElement>(null);

  const handleScroll = () => {
    const scrolledFromTop = window.scrollY;
    const viewportHeight = window.innerHeight;
    const totalPageHeight = document.documentElement.scrollHeight;

    const isAtBottom = scrolledFromTop + viewportHeight >= totalPageHeight;
    setAutoScroll(isAtBottom);
  };

  useEffect(() => {
    console.log("Adding scroll listener to document");
    document.addEventListener("scroll", handleScroll);

    return () => {
      console.log("Removing scroll listener from document");
      document.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (autoScroll) {
      messagesEndRef.current?.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [messages]);

  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      {messages.map((message) => (
        <div
          key={message.id}
          className="whitespace-pre-wrap"
          style={{ color: message.role === "user" ? "black" : "green" }}
        >
          <strong>{`${message.role}: `}</strong>
          {message.content}
          <br />
          <br />
        </div>
      ))}
      <div ref={messagesEndRef} />

      <form onSubmit={handleSubmit}>
        <div
          className="fixed bottom-0 w-full max-w-md mb-8 flex"
          style={{ alignItems: "center" }}
        >
          <input
            className="border p-2 mr-3 border-gray-300 rounded shadow-xl text-black flex-grow"
            value={input}
            ref={inputElement}
            placeholder="Say something..."
            onChange={(e) => {
              handleInputChange(e);
            }}
            style={{ flexGrow: 1 }} // Make input take as much space as possible
          />
          <Microphone
            setAudio={(audio: Blob) => {
              speechRecognition(audio)
                .then((response: any) => {
                  const message: CreateMessage = {
                    role: "user",
                    content: response.message,
                  };
                  append(message);
                })
                .catch((error: Error) => {
                  console.error("Error recognizing speech:", error);
                });
            }}
          />
        </div>
      </form>
    </div>
  );
}
