'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ClipLoader from 'react-spinners/ClipLoader';

import Image from 'next/image';
import styles from '@/styles/Login.module.css';

export default function Login() {
  const [name, setName] = useState('');
  const [checkingAuth, setCheckingAuth] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedName = sessionStorage.getItem('username');
      if (storedName) {
        // If a username is stored, redirect immediately
        router.push('/chat');
      } else {
        // Otherwise, show the login form
        setCheckingAuth(false);
      }
    }
  }, [router]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      sessionStorage.setItem('username', name.trim());
      router.push('/chat');
    }
  };

  if (checkingAuth) {
    // Show a loading indicator while checking
    return (
      <div className={styles.loginContainer}>
         <h2>Loading...</h2>
         <ClipLoader color="#2196f3" loading={true} size={50} />
      </div>
    );
  }

  // If we're not checkingAuth, show the login form
  return (
    <div className={styles.loginContainer}>
      <div className={styles.imageContainer}>
        <Image
          src="/favicon.png"
          alt="Mushroom House"
          width={200}
          height={220}
          priority
        />
      </div>
      <form onSubmit={handleSubmit} className={styles.loginForm}>
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
    </div>
  );
}
