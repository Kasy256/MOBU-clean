"use client"

import { useState, useEffect } from "react"
import "../styles/AuthModal.css"
import { auth } from "../firebaseConfig"
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
  updateProfile,
} from "firebase/auth"

export default function AuthModal({ isOpen, onClose, initialMode = "signin", onAuthSuccess }) {
  const [mode, setMode] = useState(initialMode)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})

  // Update mode when initialMode prop changes
  useEffect(() => {
    setMode(initialMode)
  }, [initialMode])

  // Reset form when modal opens/closes or mode changes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        email: "",
        password: "",
        confirmPassword: "",
        name: "",
      })
      setErrors({})
    }
  }, [isOpen, mode])

  if (!isOpen) return null

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.email) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    if (mode === "signup") {
      if (!formData.name) {
        newErrors.name = "Name is required"
      }
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Please confirm your password"
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords don't match"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)
    setErrors({})

    try {
      let userCredential
      if (mode === "signin") {
        userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password)
      } else {
        userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password)
        if (formData.name) {
          await updateProfile(userCredential.user, { displayName: formData.name })
        }
      }
      setIsLoading(false)
      if (onAuthSuccess) {
        const user = userCredential.user
        onAuthSuccess({
          name: user.displayName || formData.name || user.email.split("@")[0],
          email: user.email,
          avatar: user.photoURL || null,
        })
      }
      onClose()
      setFormData({
        email: "",
        password: "",
        confirmPassword: "",
        name: "",
      })
      setErrors({})
    } catch (error) {
      setIsLoading(false)
      let newErrors = {}
      // Firebase error handling
      switch (error.code) {
        case "auth/user-not-found":
        case "auth/wrong-password":
          newErrors.email = "Invalid email or password"
          break
        case "auth/email-already-in-use":
          newErrors.email = "Email is already in use"
          break
        case "auth/invalid-email":
          newErrors.email = "Invalid email address"
          break
        case "auth/weak-password":
          newErrors.password = "Password is too weak"
          break
        default:
          newErrors.general = error.message
      }
      setErrors(newErrors)
    }
  }

  const handleSocialAuth = async (provider) => {
    setIsLoading(true)
    setErrors({})
    try {
      let prov
      if (provider === "google") {
        prov = new GoogleAuthProvider()
      } else if (provider === "github") {
        prov = new GithubAuthProvider()
      } else {
        throw new Error("Unsupported provider")
      }
      const result = await signInWithPopup(auth, prov)
      setIsLoading(false)
      if (onAuthSuccess) {
        const user = result.user
        onAuthSuccess({
          name: user.displayName || user.email.split("@")[0],
          email: user.email,
          avatar: user.photoURL || null,
        })
      }
      onClose()
      setFormData({
        email: "",
        password: "",
        confirmPassword: "",
        name: "",
      })
      setErrors({})
    } catch (error) {
      setIsLoading(false)
      let newErrors = {}
      if (error.code === "auth/account-exists-with-different-credential") {
        newErrors.general = "An account already exists with the same email address. Try another sign-in method."
      } else {
        newErrors.general = error.message
      }
      setErrors(newErrors)
    }
  }

  const switchMode = () => {
    setMode(mode === "signin" ? "signup" : "signin")
    setErrors({})
  }

  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <div className="auth-modal-header">
          <h2 className="auth-title">{mode === "signin" ? "Welcome back" : "Create your account"}</h2>
          <p className="auth-subtitle">
            {mode === "signin"
              ? "Sign in to continue building amazing mobile apps"
              : "Join thousands of developers building with m0"}
          </p>
          <button className="close-button" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className="auth-modal-content">
          {/* Social Authentication */}
          <div className="social-auth">
            <button className="social-button google-button" onClick={() => handleSocialAuth("google")}>
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </button>

            <button className="social-button github-button" onClick={() => handleSocialAuth("github")}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              Continue with GitHub
            </button>
          </div>

          <div className="divider">
            <span>or</span>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="auth-form">
            {mode === "signup" && (
              <div className="form-group">
                <label htmlFor="name" className="form-label">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`form-input ${errors.name ? "error" : ""}`}
                  placeholder="Enter your full name"
                />
                {errors.name && <span className="error-message">{errors.name}</span>}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`form-input ${errors.email ? "error" : ""}`}
                placeholder="Enter your email"
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`form-input ${errors.password ? "error" : ""}`}
                placeholder="Enter your password"
              />
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>

            {mode === "signup" && (
              <div className="form-group">
                <label htmlFor="confirmPassword" className="form-label">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`form-input ${errors.confirmPassword ? "error" : ""}`}
                  placeholder="Confirm your password"
                />
                {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
              </div>
            )}

            <button type="submit" className="submit-button" disabled={isLoading}>
              {isLoading ? (
                <>
                  <div className="loading-spinner"></div>
                  {mode === "signin" ? "Signing in..." : "Creating account..."}
                </>
              ) : mode === "signin" ? (
                "Sign In"
              ) : (
                "Create Account"
              )}
            </button>
            {errors.general && <div className="error-message" style={{ textAlign: 'center', marginTop: 8 }}>{errors.general}</div>}
          </form>

          {mode === "signin" && (
            <div className="forgot-password">
              <a href="#" className="forgot-link">
                Forgot your password?
              </a>
            </div>
          )}

          <div className="auth-switch">
            <p>
              {mode === "signin" ? "Don't have an account? " : "Already have an account? "}
              <button type="button" onClick={switchMode} className="switch-button">
                {mode === "signin" ? "Sign up" : "Sign in"}
              </button>
            </p>
          </div>

          {mode === "signup" && (
            <div className="terms">
              <p>
                By creating an account, you agree to our{" "}
                <a href="#" className="terms-link">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="terms-link">
                  Privacy Policy
                </a>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
