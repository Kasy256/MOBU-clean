import { useNavigate } from "react-router-dom"
import PromptInput from "../components/PromptInput"
import QuickActions from "../components/QuickActions"
import StarterTemplates from "../components/StarterTemplates"
import "../styles/HomePage.css"

const HomePage = () => {
  const navigate = useNavigate()

  const handleGenerate = (prompt, framework) => {
    navigate("/generate", { state: { prompt, framework } })
  }

  const handleQuickAction = (actionId) => {
    const actionPrompts = {
      "login-screen": "Create a modern login screen with email and password fields",
      dashboard: "Build a dashboard with charts and statistics",
      "profile-page": "Design a user profile page with avatar and settings",
      "chat-interface": "Create a chat interface with message bubbles",
      "e-commerce": "Build an e-commerce app with product listings",
      "social-feed": "Design a social media feed with posts and interactions",
    }

    const prompt = actionPrompts[actionId]
    if (prompt) {
      navigate("/generate", { state: { prompt, framework: "react-native" } })
    }
  }

  return (
    <div className="home-page">
      <div className="hero-section">
        <div className="hero-content">
          {/* <div className="announcement-banner">
            <span className="banner-label">New</span>
            <span className="banner-text">Edit faster with Design Mode</span>
            <span className="banner-link">Try it now →</span>
          </div> */}

          <h1 className="hero-title">What mobile app can I help you build?</h1>

          <PromptInput onGenerate={handleGenerate} />

          <QuickActions onActionClick={handleQuickAction} />
        </div>
      </div>

      <div className="templates-section">
        <StarterTemplates />
      </div>

      <div className="community-section">
        <h3 className="section-title">From the Community</h3>
        <p className="section-subtitle">Explore what the community is building with m0.</p>
        <div className="community-grid">
          <div className="community-card">
            <div className="card-preview">
              <div className="preview-placeholder">Food Delivery App</div>
            </div>
            <h4 className="card-title">Food Delivery</h4>
            <p className="card-description">Complete food ordering experience</p>
          </div>
          <div className="community-card">
            <div className="card-preview">
              <div className="preview-placeholder">Fitness Tracker</div>
            </div>
            <h4 className="card-title">Fitness Tracker</h4>
            <p className="card-description">Track workouts and progress</p>
          </div>
          <div className="community-card">
            <div className="card-preview">
              <div className="preview-placeholder">Music Player</div>
            </div>
            <h4 className="card-title">Music Player</h4>
            <p className="card-description">Beautiful music streaming interface</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage
