# Lumina Market

A premium dark-themed e-commerce storefront built with React, TypeScript, Firebase, and Tailwind CSS. Features Google authentication, real-time Firestore product sync, AI-powered product recommendations via Gemini, and an elegant minimalist UI.

## Features

- Google Authentication via Firebase
- Real-time product sync with Firestore
- AI-powered product recommendations via Gemini (server-side)
- Shopping cart with quantity management
- Category filtering with smooth scroll navigation
- Elegant minimalist dark UI
- Responsive design

## Tech Stack

- React + TypeScript
- Vite
- Tailwind CSS
- Firebase (Auth + Firestore)
- Google Gemini AI
- Express (backend proxy)
- Framer Motion

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   ```
   npm install
   ```

2. Add your keys to `.env.local`:
   ```
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

3. Run the backend server (Terminal 1):
   ```
   npm run server
   ```

4. Run the frontend (Terminal 2):
   ```
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

| Variable | Description |
|----------|-------------|
| `GEMINI_API_KEY` | Your Gemini API key from [aistudio.google.com](https://aistudio.google.com/apikey) |

## Security

- Gemini API key is kept server-side only, never exposed to the client
- Firebase config is excluded from the repository via `.gitignore`
- Firebase Browser key is restricted to `localhost` only
