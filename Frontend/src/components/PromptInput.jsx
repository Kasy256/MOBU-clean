"use client"

import { useState } from "react"
import "../styles/PromptInput.css"

const PromptInput = ({ onGenerate }) => {
  const [prompt, setPrompt] = useState("")
  const [selectedFramework, setSelectedFramework] = useState("react-native")

  const handleSubmit = (e) => {
    e.preventDefault()
    if (prompt.trim()) {
      onGenerate(prompt, selectedFramework)
    }
  }

  return (
    <div className="prompt-input-container">
      <form onSubmit={handleSubmit} className="prompt-form">
        <div className="input-wrapper">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ask MoBu to build a mobile app..."
            className="prompt-textarea"
            rows="3"
          />
          <div className="input-controls">
            <select
              value={selectedFramework}
              onChange={(e) => setSelectedFramework(e.target.value)}
              className="framework-select"
            >
              <option value="react-native">React Native</option>
              <option value="flutter">Flutter</option>
              <option value="ionic">Ionic</option>
              <option value="xamarin">Xamarin</option>
            </select>
            <button type="submit" className="generate-btn">
              <span>Generate</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default PromptInput
