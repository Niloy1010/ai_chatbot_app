# AI Chatbot Frontend

This is the frontend for the AI Chatbot application. Built with Next.js and React, it features:
- **Chat Interface:** A responsive chat UI with a floating talking head animation.
- **Text-to-Speech:** Uses the Web Speech API to speak the chatbot’s responses.
- **Tone Selector:** Users can select the tone (e.g., Mood Swing, Angry, Depressed, Happy, Sarcastic) that influences the chatbot’s personality.
- **Session Handling:** Stores the username in sessionStorage so that returning users are automatically redirected to the chat page.
- **Markdown Rendering:** Uses `react-markdown` and `react-syntax-highlighter` to display code snippets with syntax highlighting.

## Features

- **Responsive Design:** Works well on desktop and mobile devices.
- **Real-Time Chat:** Interacts with the backend API to generate chatbot responses.
- **Custom Tone Selector:** Allows the user to choose the chatbot’s response tone.
- **Logout Functionality:** Users can log out, which clears the session.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or later recommended)
- [Git](https://git-scm.com/)

### Installation

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/Niloy1010/ai_chatbot_app.git
   cd ai_chatbot_app
2. **Install Dependencies:**:

```bash
npm install
```

3. **Environment Variables:**

Create a .env.local file in the root of the project with the following variables:

```env
NEXT_PUBLIC_BACKEND_API=https://<YOUR_BACKEND_URL>/api
```
Replace <YOUR_BACKEND_URL> with the URL of your deployed backend (e.g., your Heroku app URL). For local development, you can use:

```env
NEXT_PUBLIC_BACKEND_API=http://localhost:8000/api
```

4. **Run the Development Server:**

```bash
npm run dev
```
Open http://localhost:3000 to view it in the browser.
