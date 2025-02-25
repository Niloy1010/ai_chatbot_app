// src/app/chat/page.js
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function Chat() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [inputMessage, setInputMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const chatEndRef = useRef(null);

  // On mount, check for stored username
  useEffect(() => {
    const storedName = sessionStorage.getItem('username');
    if (!storedName) {
      router.push('/login');
    } else {
      setUsername(storedName);
    }
  }, [router]);

  // Scroll to the bottom of the chat when chatHistory updates
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  function speakResponse(responseText) {
    const utterance = new SpeechSynthesisUtterance(responseText);
    let voices = window.speechSynthesis.getVoices();
    
    if (!voices.length) {
      console.log('Voices array is empty. Waiting for voiceschanged event...');
      // If voices array is empty, wait for the voiceschanged event
      window.speechSynthesis.onvoiceschanged = () => {
        console.log('Voices array is empty. Waiting for voiceschanged event 2...');
        voices = window.speechSynthesis.getVoices();
        setVoiceAndSpeak(utterance, voices);
      };
    } else {
      setVoiceAndSpeak(utterance, voices);
    }
  }


  function setVoiceAndSpeak(utterance, voices) {
    if (voices.length > 10) {
      utterance.voice = voices[10];
    } else if (voices.length > 0) {
      utterance.voice = voices[0];
    }
    utterance.pitch = 1.8;
    window.speechSynthesis.speak(utterance);
  }

  const handleSend = async () => {
    if (!inputMessage.trim()) return;

    // Append user message to chat history
    const userMessage = { sender: 'user', text: inputMessage.trim() };
    setChatHistory((prev) => [...prev, userMessage]);

    const currentMessage = inputMessage.trim();
    setInputMessage('');

    try {
      const res = await fetch('http://localhost:8000/api/chat/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // <-- This ensures cookies are sent
        body: JSON.stringify({ message: currentMessage }),
      });
      
      const data = await res.json();
      const botMessage = { sender: 'bot', text: data.response };
      setChatHistory((prev) => [...prev, botMessage]);

      speakResponse(data.response);
      
    } catch (error) {
      console.error('Error communicating with the backend:', error);
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Left Column: Floating Talking Head */}
      <div
        style={{
          width: '33%',
          backgroundColor: '#f0f0f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        <img
          src="/floating-head.png"
          alt="Talking Head"
          style={{
            width: '200px',
            animation: 'float 3s ease-in-out infinite',
          }}
        />
        <style jsx>{`
          @keyframes float {
            0%,
            100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-10px);
            }
          }
        `}</style>
      </div>

      {/* Right Column: Chat Area */}
      <div style={{ width: '67%', display: 'flex', flexDirection: 'column' }}>
        {/* Chat Messages */}
        <div style={{ flexGrow: 1, overflowY: 'auto', padding: '20px', borderLeft: '1px solid #ccc' }}>
          {chatHistory.map((msg, index) => (
            <div key={index} style={{ marginBottom: '10px', textAlign: msg.sender === 'user' ? 'right' : 'left' }}>
              <p
                style={{
                  display: 'inline-block',
                  padding: '10px',
                  borderRadius: '8px',
                  backgroundColor: msg.sender === 'user' ? '#dcf8c6' : '#f1f0f0',
                }}
              >
                {msg.text}
              </p>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* Chat Input */}
        <div style={{ display: 'flex', padding: '10px', borderTop: '1px solid #ccc' }}>
          <input
            type="text"
            placeholder="Type a message..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            style={{ flexGrow: 1, padding: '10px', fontSize: '16px' }}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <button onClick={handleSend} style={{ marginLeft: '10px', padding: '10px 20px', fontSize: '16px' }}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
