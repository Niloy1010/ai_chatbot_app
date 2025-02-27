'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import styles from '@/styles/Chat.module.css';

export default function Chat() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [inputMessage, setInputMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [chatTone, setChatTone] = useState('Random');
  const chatEndRef = useRef(null);
  const selectedVoice = useRef(null);

  useEffect(() => {
    const storedName = sessionStorage.getItem('username');
    if (!storedName) {
      router.push('/login');
    } else {
      setUsername(storedName);
    }
  }, [router]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  function getRandomVoice(voices) {
    const randomIndex = Math.floor(Math.random() * 4);
    return voices[randomIndex];
  }

  function speakResponse(responseText) {
    const utterance = new SpeechSynthesisUtterance(responseText);
    if (selectedVoice.current) {
      utterance.voice = selectedVoice.current;
      window.speechSynthesis.speak(utterance);
    } else {
      let voices = window.speechSynthesis.getVoices();
      if (!voices.length) {
        window.speechSynthesis.onvoiceschanged = () => {
          voices = window.speechSynthesis.getVoices();
          selectedVoice.current = getRandomVoice(voices);
          utterance.voice = selectedVoice.current;
          window.speechSynthesis.speak(utterance);
        };
      } else {
        selectedVoice.current = getRandomVoice(voices);
        utterance.voice = selectedVoice.current;
        window.speechSynthesis.speak(utterance);
      }
    }
  }

  const handleSend = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = { sender: 'user', text: inputMessage.trim() };
    setChatHistory((prev) => [...prev, userMessage]);

    const currentMessage = inputMessage.trim();
    setInputMessage('');

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/chat/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        // Include username along with message and tone
        body: JSON.stringify({ message: currentMessage, tone: chatTone, username: username }),
      });
      
      const data = await res.json();
      const botMessage = { sender: 'bot', text: data.response };
      setChatHistory((prev) => [...prev, botMessage]);

      speakResponse(data.response);
    } catch (error) {
      console.error('Error communicating with the backend:', error);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('username');
    router.push('/login');
  };

  return (
    <div className={styles.chatPage}>
      <div className={styles.logoutContainer}>
        <button className={styles.logoutButton} onClick={handleLogout}>
          Log out as {username}
        </button>
      </div>

      <div className={styles.leftColumn}>
        <div className={styles.imageContainer}>
          <img
            className={styles.floatingHead}
            src="/floating-head.png"
            alt="Floating Mushroom Chat"
          />
        </div>
        <h2>Select Chat Tone:</h2>
        <p>Choose the tone of the bot's responses:</p>
        <select
          className={styles.toneSelect}
          value={chatTone}
          onChange={(e) => setChatTone(e.target.value)}
        >
          <option value="Random">Mood Swing (default)</option>
          <option value="Angry">Angry</option>
          <option value="Depressed">Depressed</option>
          <option value="Happy">Happy</option>
          <option value="Sarcastic">Sarcastic</option>
        </select>
      </div>

      <div className={styles.rightColumn}>
        <div className={styles.messagesContainer}>
          {chatHistory.map((msg, index) => (
            <div
              key={index}
              className={`${styles.bubble} ${
                msg.sender === 'user' ? styles.bubbleUser : styles.bubbleBot
              }`}
            >
              <ReactMarkdown
                children={msg.text}
                components={{
                  p({ node, children }) {
                    if (
                      children.length === 1 &&
                      children[0].props &&
                      children[0].props.className &&
                      children[0].props.className.includes('language-')
                    ) {
                      return <>{children}</>;
                    }
                    return <p>{children}</p>;
                  },
                  code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '');
                    return !inline ? (
                      <SyntaxHighlighter
                        style={oneDark}
                        language={match ? match[1] : 'text'}
                        PreTag="div"
                        {...props}
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    ) : (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    );
                  },
                }}
              />
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        <div className={styles.inputContainer}>
          <input
            className={styles.chatInput}
            type="text"
            placeholder="Type a message..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            style={{ color: inputMessage ? 'black' : 'gray' }}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <button className={styles.sendButton} onClick={handleSend}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
