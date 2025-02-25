// src/app/login/page.js
'use client'; // using a client component for interactive features

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [name, setName] = useState('');
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      // Store username in sessionStorage (persists until the browser is closed)
      sessionStorage.setItem('username', name.trim());
      router.push('/chat');
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>
      <form onSubmit={handleSubmit} style={{ textAlign: 'center' }}>
        <h2>Welcome to the Chatbot</h2>
        <p>Please enter your name to continue</p>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          style={{ padding: '8px', fontSize: '16px', width: '200px' }}
        />
        <br />
        <button type="submit" style={{ padding: '8px 16px', marginTop: '10px', fontSize: '16px' }}>
          Enter
        </button>
      </form>
    </div>
  );
}
