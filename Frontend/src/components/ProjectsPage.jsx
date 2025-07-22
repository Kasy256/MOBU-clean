"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import "../styles/ProjectsPage.css"
import { getProjects, deleteProject, updateProject, getPreview } from "../api"
import { auth } from "../firebaseConfig"

export default function ProjectsPage() {
  const [projects, setProjects] = useState([])
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState("all")
  const [sortBy, setSortBy] = useState("recent")
  const user = auth.currentUser

  useEffect(() => {
    if (!user) return
    getProjects(user.uid)
      .then(res => {
        console.log("Projects API response:", res)
        if (res && Array.isArray(res.projects)) {
          setProjects(res.projects)
        } else {
          setProjects([])
        }
      })
      .catch((err) => {
        setError("Could not load projects. Please try again later.")
        setProjects([])
      })
  }, [user])

  const handleDelete = async (project_id) => {
    await deleteProject(project_id)
    setProjects(projects.filter(p => p.project_id !== project_id))
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "#10B981"
      case "in-progress":
        return "#F59E0B"
      case "draft":
        return "#6B7280"
      default:
        return "#6B7280"
    }
  }

  const getFrameworkIcon = (framework) => {
    switch (framework) {
      case "react-native":
        return "⚛️"
      case "flutter":
        return "🐦"
      case "ionic":
        return "⚡"
      case "xamarin":
        return "🔷"
      default:
        return "📱"
    }
  }

  const filteredProjects = projects.filter(project => {
    if (filter === "all") return true
    if (filter === "public") return project.isPublic
    if (filter === "private") return !project.isPublic
    return project.status === filter
  })

  const sortedProjects = [...filteredProjects].sort((a, b) => {
    if (sortBy === "recent") {
      return new Date(b.lastModified) - new Date(a.lastModified)
    }
    if (sortBy === "name") {
      return a.name.localeCompare(b.name)
    }
    if (sortBy === "created") {
      return new Date(b.createdAt) - new Date(a.createdAt)
    }
    return 0
  })

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    })
  }

  const handlePreview = async (projectId) => {
    const res = await getPreview(projectId);
    if (res.expo_url) window.open(res.expo_url, "_blank");
  };

  if (error) {
    return <div className="projects-page"><div className="projects-container"><p>{error}</p></div></div>;
  }

  return (
    <div className="projects-page">
      <div className="projects-container">
        <div className="projects-header">
          <div className="header-content">
            <h1 className="page-title">My Projects</h1>
            <p className="page-subtitle">Manage and organize your mobile app projects</p>
          </div>
          <Link to="/generate" className="btn btn-primary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            New Project
          </Link>
        </div>

        <div className="projects-controls">
          <div className="filters">
            <button
              className={`filter-btn ${filter === "all" ? "active" : ""}`}
              onClick={() => setFilter("all")}
            >
              All Projects
            </button>
            <button
              className={`filter-btn ${filter === "completed" ? "active" : ""}`}
              onClick={() => setFilter("completed")}
            >
              Completed
            </button>
            <button
              className={`filter-btn ${filter === "in-progress" ? "active" : ""}`}
              onClick={() => setFilter("in-progress")}
            >
              In Progress
            </button>
            <button
              className={`filter-btn ${filter === "draft" ? "active" : ""}`}
              onClick={() => setFilter("draft")}
            >
              Drafts
            </button>
            <button
              className={`filter-btn ${filter === "public" ? "active" : ""}`}
              onClick={() => setFilter("public")}
            >
              Public
            </button>
            <button
              className={`filter-btn ${filter === "private" ? "active" : ""}`}
              onClick={() => setFilter("private")}
            >
              Private
            </button>
          </div>

          <div className="sort-controls">
            <label className="sort-label">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="recent">Last Modified</option>
              <option value="name">Name</option>
              <option value="created">Date Created</option>
            </select>
          </div>
        </div>

        <div className="projects-grid">
          {sortedProjects.map((project) => (
            <div key={project.id} className="project-card">
              <div className="project-thumbnail">
                <div className="thumbnail-placeholder">
                  <div className="framework-icon">
                    {getFrameworkIcon(project.framework)}
                  </div>
                </div>
                <div className="project-status">
                  <span
                    className="status-indicator"
                    style={{ backgroundColor: getStatusColor(project.status) }}
                  ></span>
                  <span className="status-text">{project.status.replace("-", " ")}</span>
                </div>
              </div>

              <div className="project-content">
                <div className="project-header">
                  <h3 className="project-name">{project.name}</h3>
                  <div className="project-actions">
                    <button className="action-btn">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="1"></circle>
                        <circle cx="19" cy="12" r="1"></circle>
                        <circle cx="5" cy="12" r="1"></circle>
                      </svg>
                    </button>
                  </div>
                </div>

                <p className="project-description">{project.description}</p>

                <div className="project-meta">
                  <div className="meta-item">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    <span>Modified {formatDate(project.lastModified)}</span>
                  </div>
                  <div className="meta-item">
                    <span className="framework-badge">{project.framework}</span>
                  </div>
                  <div className="meta-item">
                    {project.isPublic ? (
                      <div className="visibility-badge public">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10"></circle>
                          <circle cx="12" cy="12" r="4"></circle>
                          <path d="M12 2v20M2 12h20"></path>
                        </svg>
                        Public
                      </div>
                    ) : (
                      <div className="visibility-badge private">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                          <circle cx="12" cy="16" r="1"></circle>
                          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                        </svg>
                        Private
                      </div>
                    )}
                  </div>
                </div>

                <div className="project-actions-row">
                  <Link to={`/generate?project=${project.id}`} className="btn btn-secondary">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                    View
                  </Link>
                  <button className="btn btn-secondary">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                    Edit
                  </button>
                  <button className="btn btn-ghost">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="7,10 12,15 17,10"></polyline>
                      <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                    Export
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {sortedProjects.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">📱</div>
            <h3>No projects found</h3>
            <p>Try adjusting your filters or create a new project to get started.</p>
            <Link to="/generate" className="btn btn-primary">Create Your First Project</Link>
          </div>
        )}
      </div>
    </div>
  )
}
