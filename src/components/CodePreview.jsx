"use client"

import { useState } from "react"
import "../styles/CodePreview.css"
import { downloadZip } from "../api"

const CodePreview = ({ generatedCode, framework }) => {
  const [activeTab, setActiveTab] = useState("preview")

  if (!generatedCode) {
    return null
  }

  const handleDownload = async (code, projectName) => {
    const blob = await downloadZip(code, projectName)
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${projectName}.zip`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="code-preview">
      <div className="preview-header">
        <div className="preview-tabs">
          <button className={`tab ${activeTab === "preview" ? "active" : ""}`} onClick={() => setActiveTab("preview")}>
            Preview
          </button>
          <button className={`tab ${activeTab === "code" ? "active" : ""}`} onClick={() => setActiveTab("code")}>
            Code
          </button>
        </div>
        <div className="preview-actions">
          <button className="btn btn-secondary">Copy Code</button>
          <button className="btn btn-primary">Download Project</button>
        </div>
      </div>

      <div className="preview-content">
        {activeTab === "preview" ? (
          <div className="mobile-preview">
            <div className="phone-frame">
              <div className="phone-screen">
                <div className="preview-placeholder">
                  <h3>Mobile App Preview</h3>
                  <p>Framework: {framework}</p>
                  <div className="mock-ui">
                    <div className="mock-header"></div>
                    <div className="mock-content">
                      <div className="mock-element"></div>
                      <div className="mock-element"></div>
                      <div className="mock-element"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="code-display">
            <pre className="code-block">
              <code>{generatedCode}</code>
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}

export default CodePreview
