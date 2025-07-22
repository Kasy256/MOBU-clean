# MoBu – Mobile App Generator

[Live Demo: mobu-app.web.app](https://mobu-app.web.app)

MoBu is an AI-powered platform that lets you generate, preview, and download production-ready React Native mobile app screens in seconds. Describe your app idea or UI in natural language, and MoBu uses OpenAI to generate clean, functional React Native code styled with Tailwind CSS (via nativewind). You can save your projects, manage your code, and download a ready-to-run Expo project zip.

## Features

- **AI Code Generation:** Instantly generate React Native screens from text prompts.
- **Expo-Ready Downloads:** Download your generated code as a ready-to-run Expo project.
- **Project Management:** Save, edit, and delete your generated projects.
- **User Authentication:** Secure login with Firebase Authentication.
- **Billing Integration:** Paystack integration for premium features.
- **Cloud Storage:** All your projects are securely stored in Firebase Firestore.

## Tech Stack

- **Frontend:** React, Vite, React Router, Firebase JS SDK, PrismJS (for code highlighting)
- **Backend:** Python, Flask, Firebase Admin SDK, OpenAI API, Paystack API
- **Cloud:** Firebase Hosting, Firestore, Firebase Authentication

## Getting Started

1. **Clone the repository**
2. **Install dependencies**
   ```sh
   cd Frontend
   npm install
   ```
3. **Run the development server**
   ```sh
   npm run dev
   ```
4. **Visit the app:** [http://localhost:5173](http://localhost:5173) or [mobu-app.web.app](https://mobu-app.web.app)

## Project Structure

- `Frontend/` – React app (Vite, Firebase, UI)
- `Backend/` – Flask API (OpenAI, Firestore, Paystack)

## License

This project is for educational and demonstration
