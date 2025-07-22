"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import AuthModal from "./AuthModal"
import "../styles/Header.css"
import ProfileDropdown from "./ProfileDropdown"
import { auth } from "../firebaseConfig"
import { signOut } from "firebase/auth"

const Header = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [authMode, setAuthMode] = useState("signin")
  const [user, setUser] = useState(null)

  const handleSignIn = () => {
    setAuthMode("signin")
    setIsAuthModalOpen(true)
  }

  const handleSignUp = () => {
    setAuthMode("signup")
    setIsAuthModalOpen(true)
  }

  const closeAuthModal = () => {
    setIsAuthModalOpen(false)
  }

  const handleAuthSuccess = (userData) => {
    setUser(userData)
    setIsAuthModalOpen(false)
  }

  const handleLogout = async () => {
    await signOut(auth)
    setUser(null)
  }

  return (
    <>
      <header className="header">
        <div className="header-container">
          <Link to="/" className="logo">
            <img src="/MO.png" alt="Logo" className="logo-image" />
          </Link>

          <nav className="nav">
            <Link to="/" className="nav-link">
              Home
            </Link>
            <Link to="/generate" className="nav-link">
              Generate
            </Link>
          </nav>

          <div className="auth-section">
            {user ? (
              <ProfileDropdown user={user} onLogout={handleLogout} />
            ) : (
              <div className="auth-buttons">
                <button className="btn btn-ghost" onClick={handleSignIn}>
                  Sign In
                </button>
                <button className="btn btn-primary" onClick={handleSignUp}>
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
        initialMode={authMode}
        onAuthSuccess={handleAuthSuccess}
      />
    </>
  )
}

export default Header
