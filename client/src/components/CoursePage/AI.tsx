import React, { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import "bootstrap/dist/css/bootstrap.min.css";

const API_KEY = "AIzaSyBGsUe0I5WUAk2d8n4EBi6JMKDhHcYnjjY"; // Replace with your actual API key
const MODEL_NAME = "gemini-pro"; // Replace with your actual model name

const AI: React.FC = () => {
  const [image, setImage] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [response, setResponse] = useState<string>("");

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files![0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setImage(reader.result as string);
    };

    reader.onerror = () => {
      alert("Error reading the image file. Please try again.");
    };

    reader.readAsDataURL(file);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(event.target.value);
  };

  const handleSubmit = async () => {
    if (!image && !message) {
      alert("Please choose an image or enter a message.");
      return;
    }

    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const generationConfig = {
      temperature: 0.9,
      topK: 1,
      topP: 1,
      maxOutputTokens: 2048,
    };

    const safetySettings = [
      // Your safety settings here
    ];

    type Part = { text: string } | { inlineData: { data: string; mimeType: string } };

    const parts: Part[] = [];
    if (message) parts.push({ text: message });
    if (image) {
      const mimeType = getImageMimeType(image);
      parts.push({ inlineData: { data: image.split(",")[1], mimeType } });
    }

    const conversationHistory = [
      {
        role: "user",
        parts: parts.length > 0 ? parts : [{ text: "Hello" }],
      },
      {
        role: "model",
        parts: [{ text: "How can I assist you today?" }], // Add a default text part
      },
      {
        role: "user",
        parts: [{ text: "How can you help me?" }],
      },
      {
        role: "model",
        parts: [{ text: "Sure, I can assist you. Ask me about your problems" }],
      },
    ];

    const chat = model.startChat({
      generationConfig,
      safetySettings,
      history: conversationHistory,
    });

    try {
      const result = await chat.sendMessage("How can you help me?");
      const response = result.response;
      console.log(response.text());
      setResponse(response.text());
      setImage(""); // Clear the image state after successful submission
    } catch (error) {
      console.error(error);
      setResponse("An error occurred. Please try again later.");
    }
  };

  const getImageMimeType = (imageData: string): string => {
    const base64Data = imageData.split(",")[1];
    const binaryData = atob(base64Data);
    const byte = binaryData.charCodeAt(0);

    switch (byte) {
      case 0xff:
        return "image/jpeg";
      case 0x89:
        return "image/png";
      default:
        return "image/png"; // Default to PNG if the type is not recognized
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">AI Assistant</h2>

      <div className="custom-file mb-4">
        <input
          type="file"
          className="custom-file-input"
          id="customFile"
          accept="image/*"
          onChange={handleImageUpload}
        />
        <label className="custom-file-label" htmlFor="customFile">
          Choose image (optional)
        </label>
      </div>

      <div className="form-group">
        <textarea
          className="form-control"
          id="message"
          value={message}
          onChange={handleInputChange}
          placeholder="Enter your message (optional)"
        />
      </div>

      <button className="btn btn-primary mb-4" onClick={handleSubmit}>
        Send
      </button>

      <div>{response}</div>
    </div>
  );
};

export default AI;