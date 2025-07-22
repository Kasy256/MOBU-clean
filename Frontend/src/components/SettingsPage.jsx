"use client"

import { useState, useEffect } from "react"
import "../styles/SettingsPage.css"

const defaultSettings = {
  language: "en",
  timezone: "America/New_York",
  dateFormat: "MM/DD/YYYY",
  defaultFramework: "react-native",
  autoSave: true,
  codeFormatting: true,
  darkMode: false,
  emailNotifications: true,
  projectUpdates: true,
  marketingEmails: false,
  weeklyDigest: true,
  profileVisibility: "public",
  projectDefaultVisibility: "private",
  allowIndexing: true,
  betaFeatures: false,
  analyticsOptOut: false,
  apiAccess: false,
}

export default function SettingsPage() {
  const [settings, setSettings] = useState(defaultSettings)

  useEffect(() => {
    const saved = localStorage.getItem("userSettings")
    if (saved) setSettings(JSON.parse(saved))
  }, [])

  useEffect(() => {
    document.body.classList.toggle("dark-mode", settings.darkMode)
  }, [settings.darkMode])

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleSaveSettings = () => {
    localStorage.setItem("userSettings", JSON.stringify(settings))
    alert("Settings saved!")
  }

  const handleResetSettings = () => {
    if (window.confirm("Are you sure you want to reset all settings to default?")) {
      setSettings(defaultSettings)
      localStorage.removeItem("userSettings")
    }
  }

  return (
    <div className="settings-page">
      <div className="settings-container">
        <div className="settings-header">
          <h1 className="page-title">Settings</h1>
          <p className="page-subtitle">Customize your m0 experience</p>
        </div>

        <div className="settings-content">
          {/* General Settings */}
          <div className="settings-section">
            <h2 className="section-title">General</h2>
            <div className="settings-grid">
              <div className="setting-item">
                <label className="setting-label">Language</label>
                <select
                  value={settings.language}
                  onChange={(e) => handleSettingChange("language", e.target.value)}
                  className="setting-select"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                  <option value="ja">Japanese</option>
                </select>
              </div>

              <div className="setting-item">
                <label className="setting-label">Timezone</label>
                <select
                  value={settings.timezone}
                  onChange={(e) => handleSettingChange("timezone", e.target.value)}
                  className="setting-select"
                >
                  <option value="America/New_York">Eastern Time</option>
                  <option value="America/Chicago">Central Time</option>
                  <option value="America/Denver">Mountain Time</option>
                  <option value="America/Los_Angeles">Pacific Time</option>
                  <option value="UTC">UTC</option>
                </select>
              </div>

              <div className="setting-item">
                <label className="setting-label">Date Format</label>
                <select
                  value={settings.dateFormat}
                  onChange={(e) => handleSettingChange("dateFormat", e.target.value)}
                  className="setting-select"
                >
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </select>
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="settings-section">
            <h2 className="section-title">Preferences</h2>
            <div className="settings-grid">
              <div className="setting-item">
                <label className="setting-label">Default Framework</label>
                <select
                  value={settings.defaultFramework}
                  onChange={(e) => handleSettingChange("defaultFramework", e.target.value)}
                  className="setting-select"
                >
                  <option value="react-native">React Native</option>
                  <option value="flutter">Flutter</option>
                  <option value="ionic">Ionic</option>
                  <option value="xamarin">Xamarin</option>
                </select>
              </div>

              <div className="setting-item toggle-item">
                <div className="toggle-content">
                  <label className="setting-label">Auto-save projects</label>
                  <p className="setting-description">Automatically save your work as you build</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={settings.autoSave}
                    onChange={(e) => handleSettingChange("autoSave", e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="setting-item toggle-item">
                <div className="toggle-content">
                  <label className="setting-label">Code formatting</label>
                  <p className="setting-description">Automatically format generated code</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={settings.codeFormatting}
                    onChange={(e) => handleSettingChange("codeFormatting", e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="setting-item toggle-item">
                <div className="toggle-content">
                  <label className="setting-label">Dark mode</label>
                  <p className="setting-description">Use dark theme across the interface</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={settings.darkMode}
                    onChange={(e) => handleSettingChange("darkMode", e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="settings-section">
            <h2 className="section-title">Notifications</h2>
            <div className="settings-grid">
              <div className="setting-item toggle-item">
                <div className="toggle-content">
                  <label className="setting-label">Email notifications</label>
                  <p className="setting-description">Receive important updates via email</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={settings.emailNotifications}
                    onChange={(e) => handleSettingChange("emailNotifications", e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="setting-item toggle-item">
                <div className="toggle-content">
                  <label className="setting-label">Project updates</label>
                  <p className="setting-description">Get notified about project changes and sharing</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={settings.projectUpdates}
                    onChange={(e) => handleSettingChange("projectUpdates", e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="setting-item toggle-item">
                <div className="toggle-content">
                  <label className="setting-label">Marketing emails</label>
                  <p className="setting-description">Receive product updates and tips</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={settings.marketingEmails}
                    onChange={(e) => handleSettingChange("marketingEmails", e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="setting-item toggle-item">
                <div className="toggle-content">
                  <label className="setting-label">Weekly digest</label>
                  <p className="setting-description">Get a summary of your activity and trending projects</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={settings.weeklyDigest}
                    onChange={(e) => handleSettingChange("weeklyDigest", e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>

          {/* Privacy */}
          <div className="settings-section">
            <h2 className="section-title">Privacy</h2>
            <div className="settings-grid">
              <div className="setting-item">
                <label className="setting-label">Profile visibility</label>
                <select
                  value={settings.profileVisibility}
                  onChange={(e) => handleSettingChange("profileVisibility", e.target.value)}
                  className="setting-select"
                >
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                  <option value="friends">Friends only</option>
                </select>
              </div>

              <div className="setting-item">
                <label className="setting-label">Default project visibility</label>
                <select
                  value={settings.projectDefaultVisibility}
                  onChange={(e) => handleSettingChange("projectDefaultVisibility", e.target.value)}
                  className="setting-select"
                >
                  <option value="private">Private</option>
                  <option value="public">Public</option>
                </select>
              </div>

              <div className="setting-item toggle-item">
                <div className="toggle-content">
                  <label className="setting-label">Allow search engine indexing</label>
                  <p className="setting-description">Let search engines index your public profile and projects</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={settings.allowIndexing}
                    onChange={(e) => handleSettingChange("allowIndexing", e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>

          {/* Advanced */}
          <div className="settings-section">
            <h2 className="section-title">Advanced</h2>
            <div className="settings-grid">
              <div className="setting-item toggle-item">
                <div className="toggle-content">
                  <label className="setting-label">Beta features</label>
                  <p className="setting-description">Get early access to experimental features</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={settings.betaFeatures}
                    onChange={(e) => handleSettingChange("betaFeatures", e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="setting-item toggle-item">
                <div className="toggle-content">
                  <label className="setting-label">Opt out of analytics</label>
                  <p className="setting-description">Disable usage analytics and crash reporting</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={settings.analyticsOptOut}
                    onChange={(e) => handleSettingChange("analyticsOptOut", e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="setting-item toggle-item">
                <div className="toggle-content">
                  <label className="setting-label">API access</label>
                  <p className="setting-description">Enable API access for third-party integrations</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={settings.apiAccess}
                    onChange={(e) => handleSettingChange("apiAccess", e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>

          {/* Save Actions */}
          <div className="settings-actions">
            <button className="btn btn-ghost" onClick={handleResetSettings}>
              Reset to Default
            </button>
            <button className="btn btn-primary" onClick={handleSaveSettings}>
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
