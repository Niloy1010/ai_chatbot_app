// src/app/layout.js
import '../styles/globals.css';

export const metadata = {
  title: 'Chatbot App',
  description: 'Chatbot frontend built with Next.js',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
