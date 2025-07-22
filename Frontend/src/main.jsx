import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { auth, ensureUserProfile } from "./firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

window.firebaseAuth = auth;

onAuthStateChanged(auth, async (user) => {
  if (user) {
    await ensureUserProfile(user);
  }
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
