'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function Login() {
  const [name, setName] = useState('');
  const router = useRouter();

  // If a username is already stored, redirect to chat page immediately
  useEffect(() => {
    const storedName = sessionStorage.getItem('username');
    if (storedName) {
      router.push('/chat');
    }
  }, [router]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      sessionStorage.setItem('username', name.trim());
      router.push('/chat');
    }
  };

  return (
    <div className="login-container">
      {/* Whimsical mushroom house image with a bounce animation */}
      <div className="image-container">
        <Image
          src="/favicon.png" // <-- ensure this matches your file name
          alt="Mushroom House"
          width={200}
          height={220}
          priority
        />
      </div>

      {/* Login form */}
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Welcome to Mushroom Chat</h2>
        <p>Enter your name to step into the magical world!</p>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
        />
        <button type="submit">Enter</button>
      </form>

      {/* Page Styles */}
      <style jsx>{`
        .login-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          padding: 20px;
          /* Soft whimsical gradient background */
          background: linear-gradient(120deg, #fcd1dc 0%, #fde2b6 100%);
        }

        .image-container {
          margin-bottom: 40px;
          animation: bounce 3s infinite;
        }

        /* Bouncy animation */
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-30px);
          }
          60% {
            transform: translateY(-15px);
          }
        }

        .login-form {
          background: rgba(255, 255, 255, 0.9);
          padding: 30px;
          border-radius: 15px;
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
          text-align: center;
          width: 300px;
        }

        .login-form h2 {
          margin-bottom: 10px;
          font-size: 24px;
          color: #333;
          font-weight: 700;
        }

        .login-form p {
          margin-bottom: 20px;
          color: #555;
        }

        .login-form input {
          width: 100%;
          padding: 12px;
          margin-bottom: 20px;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          outline: none;
          background: #fff8f2;
        }

        .login-form button {
          width: 100%;
          padding: 12px;
          border: none;
          border-radius: 8px;
          background: #ff7f8b;
          color: #fff;
          font-size: 16px;
          cursor: pointer;
          transition: background 0.3s ease;
        }

        .login-form button:hover {
          background: #ff6f7b;
        }
      `}</style>
    </div>
  );
}
