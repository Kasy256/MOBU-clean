"use client"
import "../styles/QuickActions.css"

const QuickActions = ({ onActionClick }) => {
  const actions = [
    { id: "login-screen", icon: "📱", text: "Login Screen" },
    { id: "dashboard", icon: "📊", text: "Dashboard" },
    { id: "profile-page", icon: "👤", text: "Profile Page" },
    { id: "chat-interface", icon: "💬", text: "Chat Interface" },
    { id: "e-commerce", icon: "🛒", text: "E-commerce App" },
    { id: "social-feed", icon: "📸", text: "Social Feed" },
  ]

  return (
    <div className="quick-actions">
      {actions.map((action) => (
        <button key={action.id} className="quick-action-btn" onClick={() => onActionClick(action.id)}>
          <span className="action-icon">{action.icon}</span>
          <span className="action-text">{action.text}</span>
        </button>
      ))}
    </div>
  )
}

export default QuickActions
