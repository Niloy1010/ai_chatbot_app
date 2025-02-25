// src/app/page.js
import { redirect } from 'next/navigation';

export default function Home() {
  // This will redirect users from the root ("/") to "/login"
  redirect('/login');
  return null;
}
