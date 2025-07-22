import "../styles/StarterTemplates.css"

const StarterTemplates = () => {
  const templates = [
    {
      id: "react-native",
      name: "React Native",
      description: "Build cross-platform mobile apps",
      icon: "⚛️",
      color: "#61DAFB",
    },
    {
      id: "flutter",
      name: "Flutter",
      description: "Google's UI toolkit for mobile",
      icon: "🐦",
      color: "#02569B",
    },
    {
      id: "ionic",
      name: "Ionic",
      description: "Hybrid mobile app development",
      icon: "⚡",
      color: "#3880FF",
    },
    {
      id: "expo",
      name: "Expo",
      description: "React Native with managed workflow",
      icon: "🚀",
      color: "#000020",
    },
  ]

  return (
    <div className="starter-templates">
      <h3 className="templates-title">Starter Templates</h3>
      <p className="templates-subtitle">Get started instantly with a framework or integration of your choice.</p>
      <div className="templates-grid">
        {templates.map((template) => (
          <div key={template.id} className="template-card">
            <div className="template-icon" style={{ backgroundColor: template.color }}>
              {template.icon}
            </div>
            <div className="template-content">
              <h4 className="template-name">{template.name}</h4>
              <p className="template-description">{template.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default StarterTemplates
