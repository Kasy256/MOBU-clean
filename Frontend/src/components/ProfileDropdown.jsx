"use client"

import { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import "../styles/ProfileDropdown.css"

export default function ProfileDropdown({ user, onLogout }) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const toggleDropdown = () => {
    setIsOpen(!isOpen)
  }

  const handleMenuClick = (action) => {
    setIsOpen(false)

    switch (action) {
      case "profile":
        navigate("/profile")
        break
      case "projects":
        navigate("/projects")
        break
      case "settings":
        navigate("/settings")
        break
      case "billing":
        navigate("/billing")
        break
      case "help":
        navigate("/help")
        break
      case "logout":
        onLogout()
        break
      default:
        break
    }
  }

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const getAvatarColor = (name) => {
    const colors = [
      "#FF6B6B",
      "#4ECDC4",
      "#45B7D1",
      "#96CEB4",
      "#FFEAA7",
      "#DDA0DD",
      "#98D8C8",
      "#F7DC6F",
      "#BB8FCE",
      "#85C1E9",
    ]
    const index = name.charCodeAt(0) % colors.length
    return colors[index]
  }

  return (
    <div className="Header-profile-dropdown" ref={dropdownRef}>
      <button className="Header-profile-trigger" onClick={toggleDropdown}>
        <div className="Header-profile-info">
          <span className="Header-profile-name">{user.name}</span>
          <span className="Header-profile-email">{user.email}</span>
        </div>
        <div className="Header-profile-avatar" style={{ backgroundColor: getAvatarColor(user.name) }}>
          {user.avatar ? (
            <img src={user.avatar || "/placeholder.svg"} alt={user.name} className="Header-avatar-image" />
          ) : (
            <span className="Header-avatar-initials">{getInitials(user.name)}</span>
          )}
        </div>
        <svg
          className={`Header-dropdown-arrow ${isOpen ? "open" : ""}`}
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <polyline points="6,9 12,15 18,9"></polyline>
        </svg>
      </button>

      {isOpen && (
        <div className="Header-dropdown-menu">
          <div className="Header-dropdown-header">
            <div className="Header-dropdown-avatar" style={{ backgroundColor: getAvatarColor(user.name) }}>
              {user.avatar ? (
                <img src={user.avatar || "/placeholder.svg"} alt={user.name} className="Header-avatar-image" />
              ) : (
                <span className="Header-avatar-initials">{getInitials(user.name)}</span>
              )}
            </div>
            <div className="Header-dropdown-user-info">
              <div className="Header-dropdown-name">{user.name}</div>
              <div className="Header-dropdown-email">{user.email}</div>
            </div>
          </div>

          <div className="Header-dropdown-divider"></div>

          <div className="Header-dropdown-section">
            <button className="Header-dropdown-item" onClick={() => handleMenuClick("profile")}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              <span>Profile</span>
            </button>

            <button className="Header-dropdown-item" onClick={() => handleMenuClick("projects")}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
              </svg>
              <span>My Projects</span>
            </button>

            <button className="Header-dropdown-item" onClick={() => handleMenuClick("settings")}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1m17-4a4 4 0 0 1-8 0 4 4 0 0 1 8 0zM7 17a4 4 0 0 1-8 0 4 4 0 0 1 8 0z"></path>
              </svg>
              <span>Settings</span>
            </button>
          </div>

          <div className="Header-dropdown-divider"></div>

          <div className="Header-dropdown-section">
            <button className="Header-dropdown-item" onClick={() => handleMenuClick("billing")}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                <line x1="1" y1="10" x2="23" y2="10"></line>
              </svg>
              <span>Billing</span>
            </button>

            <button className="Header-dropdown-item" onClick={() => handleMenuClick("help")}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
              <span>Help & Support</span>
            </button>
          </div>

          <div className="Header-dropdown-divider"></div>

          <div className="Header-dropdown-section">
            <button className="Header-dropdown-item Header-logout-item" onClick={() => handleMenuClick("logout")}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16,17 21,12 16,7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
