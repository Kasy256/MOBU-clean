"use client"

import { useState, useEffect } from "react"
import "../styles/ProfilePage.css"
import { auth } from "../firebaseConfig"
import { getUserProfile, updateUserProfile, deleteUser } from "../api"

export default function ProfilePage() {
  const [userProfile, setUserProfile] = useState(null)
  const [editData, setEditData] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [error, setError] = useState(null)
  const user = auth.currentUser

  useEffect(() => {
    if (!user) return
    getUserProfile(user.uid)
      .then(profile => {
        console.log("Profile API response:", profile)
        if (!profile || Object.keys(profile).length === 0) {
          const defaultProfile = {
            name: user.displayName || "",
            email: user.email,
            bio: "",
            location: "",
            website: "",
            joinDate: new Date().toLocaleDateString(),
            totalProjects: 0,
            publicProjects: 0,
          }
          setUserProfile(defaultProfile)
          setEditData(defaultProfile)
          setIsEditing(true)
        } else {
          setUserProfile(profile)
          setEditData(profile)
        }
      })
      .catch((err) => {
        setError("Could not load profile. Please try again later.")
      })
  }, [user])

  const handleEdit = () => {
    setIsEditing(true)
    setEditData({ ...userProfile })
  }

  const handleSave = async () => {
    try {
      await updateUserProfile(user.uid, editData)
      setUserProfile({ ...userProfile, ...editData })
      setIsEditing(false)
    } catch (err) {
      setError("Failed to update profile")
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setEditData(prev => ({
      ...prev,
      [name]: value
    }))
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
      "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7",
      "#DDA0DD", "#98D8C8", "#F7DC6F", "#BB8FCE", "#85C1E9"
    ]
    const index = name.charCodeAt(0) % colors.length
    return colors[index]
  }

  const handleDelete = async () => {
    try {
      await deleteUser(user.uid)
      // Optionally sign out and redirect
    } catch (err) {
      setError("Failed to delete profile")
    }
  }

  if (error) {
    return <div className="profile-page"><div className="profile-container"><p>{error}</p></div></div>
  }

  if (!userProfile || !editData) {
    return <div className="profile-page"><div className="profile-container"><p>Loading profile...</p></div></div>
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <h1 className="page-title">Profile</h1>
          <p className="page-subtitle">Manage your account information and preferences</p>
        </div>

        <div className="profile-content">
          {/* Profile Card */}
          <div className="profile-card">
            <div className="profile-card-header">
              <h2>Personal Information</h2>
              {!isEditing ? (
                <button className="btn btn-secondary" onClick={handleEdit}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                  Edit
                </button>
              ) : (
                <div className="edit-actions">
                  <button className="btn btn-ghost" onClick={() => setIsEditing(false)}>Cancel</button>
                  <button className="btn btn-primary" onClick={handleSave}>Save</button>
                </div>
              )}
            </div>

            <div className="profile-info">
              <div className="avatar-section">
                <div className="profile-avatar-large" style={{ backgroundColor: getAvatarColor(userProfile.name) }}>
                  {userProfile.avatar ? (
                    <img src={userProfile.avatar || "/placeholder.svg"} alt={userProfile.name} className="avatar-image" />
                  ) : (
                    <span className="avatar-initials">{getInitials(userProfile.name)}</span>
                  )}
                </div>
                <button className="avatar-upload-btn">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14.828 14.828a4 4 0 0 1-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"></path>
                  </svg>
                  Change Photo
                </button>
              </div>

              <div className="profile-fields">
                {isEditing ? (
                  <>
                    <div className="form-group">
                      <label className="form-label">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        value={editData.name}
                        onChange={handleInputChange}
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={editData.email}
                        onChange={handleInputChange}
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Bio</label>
                      <textarea
                        name="bio"
                        value={editData.bio}
                        onChange={handleInputChange}
                        className="form-textarea"
                        rows="3"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Location</label>
                      <input
                        type="text"
                        name="location"
                        value={editData.location}
                        onChange={handleInputChange}
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Website</label>
                      <input
                        type="url"
                        name="website"
                        value={editData.website}
                        onChange={handleInputChange}
                        className="form-input"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="field-item">
                      <label className="field-label">Full Name</label>
                      <span className="field-value">{userProfile.name}</span>
                    </div>
                    <div className="field-item">
                      <label className="field-label">Email</label>
                      <span className="field-value">{userProfile.email}</span>
                    </div>
                    <div className="field-item">
                      <label className="field-label">Bio</label>
                      <span className="field-value">{userProfile.bio}</span>
                    </div>
                    <div className="field-item">
                      <label className="field-label">Location</label>
                      <span className="field-value">{userProfile.location}</span>
                    </div>
                    <div className="field-item">
                      <label className="field-label">Website</label>
                      {userProfile.website ? (
                        <a
                          href={userProfile.website.startsWith('http') ? userProfile.website : `https://${userProfile.website}`}
                          className="field-link"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {userProfile.website}
                        </a>
                      ) : (
                        <span className="field-value">—</span>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Stats Card */}
          <div className="stats-card">
            <h2>Account Statistics</h2>
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-value">{userProfile.totalProjects}</div>
                <div className="stat-label">Total Projects</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">{userProfile.publicProjects}</div>
                <div className="stat-label">Public Projects</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">{userProfile.joinDate}</div>
                <div className="stat-label">Member Since</div>
              </div>
            </div>
          </div>

          {/* Account Actions */}
          <div className="actions-card">
            <h2>Account Actions</h2>
            <div className="action-buttons">
              <button className="action-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
                Export Data
              </button>
              <button className="action-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 12l2 2 4-4"></path>
                  <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3"></path>
                  <path d="M3 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3"></path>
                </svg>
                Two-Factor Auth
              </button>
              <button className="action-btn danger" onClick={handleDelete}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 6h18l-2 13H5L3 6z"></path>
                  <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
