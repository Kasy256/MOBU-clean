"use client"

import { useState } from "react"
import "../styles/HelpPage.css"

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [openFaq, setOpenFaq] = useState(null)

  const categories = [
    { id: "all", name: "All Topics", icon: "📚" },
    { id: "getting-started", name: "Getting Started", icon: "🚀" },
    { id: "generation", name: "Code Generation", icon: "⚡" },
    { id: "projects", name: "Project Management", icon: "📁" },
    { id: "billing", name: "Billing & Plans", icon: "💳" },
    { id: "account", name: "Account Settings", icon: "⚙️" },
    { id: "troubleshooting", name: "Troubleshooting", icon: "🔧" },
  ]

  const faqs = [
    {
      id: 1,
      category: "getting-started",
      question: "How do I get started with m0?",
      answer:
        "Getting started with m0 is easy! Simply sign up for an account, then use the prompt input to describe the mobile app you want to build. m0 will generate the code and provide a preview of your app.",
    },
    {
      id: 2,
      category: "getting-started",
      question: "What mobile frameworks are supported?",
      answer:
        "m0 supports React Native, Flutter, Ionic, and Xamarin. You can select your preferred framework when generating your app.",
    },
    {
      id: 3,
      category: "generation",
      question: "How accurate is the AI code generation?",
      answer:
        "Our AI models are trained on millions of lines of high-quality mobile app code. While the generated code is production-ready in most cases, we recommend reviewing and testing before deployment.",
    },
    {
      id: 4,
      category: "generation",
      question: "Can I customize the generated code?",
      answer:
        "Yes! You can edit the generated code directly in our editor, or download the project and continue development in your preferred IDE.",
    },
    {
      id: 5,
      category: "projects",
      question: "How do I save and manage my projects?",
      answer:
        "Projects are automatically saved as you work. You can access all your projects from the 'My Projects' page, where you can organize, rename, and delete projects.",
    },
    {
      id: 6,
      category: "projects",
      question: "Can I share my projects with others?",
      answer:
        "Yes! You can make your projects public to share with the community, or keep them private for personal use. Team collaboration is available on Pro and Team plans.",
    },
    {
      id: 7,
      category: "billing",
      question: "What's included in the free plan?",
      answer:
        "The free plan includes 3 projects per month, access to basic AI models, community support, and code export functionality.",
    },
    {
      id: 8,
      category: "billing",
      question: "How do I upgrade or downgrade my plan?",
      answer:
        "You can change your plan at any time from the Billing page. Upgrades take effect immediately, while downgrades take effect at the next billing cycle.",
    },
    {
      id: 9,
      category: "account",
      question: "How do I delete my account?",
      answer:
        "You can delete your account from the Profile page. This action is permanent and will remove all your projects and data.",
    },
    {
      id: 10,
      category: "troubleshooting",
      question: "Why is my code generation taking so long?",
      answer:
        "Code generation typically takes 1-3 seconds. If it's taking longer, try refreshing the page or check your internet connection. Contact support if the issue persists.",
    },
  ]

  const contactOptions = [
    {
      title: "Email Support",
      description: "Get help via email within 24 hours",
      action: "support@m0.dev",
      icon: "📧",
    },
    {
      title: "Live Chat",
      description: "Chat with our support team in real-time",
      action: "Start Chat",
      icon: "💬",
    },
    {
      title: "Community Forum",
      description: "Connect with other developers and share knowledge",
      action: "Visit Forum",
      icon: "👥",
    },
    {
      title: "Documentation",
      description: "Comprehensive guides and API documentation",
      action: "View Docs",
      icon: "📖",
    },
  ]

  const filteredFaqs = faqs.filter((faq) => {
    const matchesCategory = selectedCategory === "all" || faq.category === selectedCategory
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const toggleFaq = (id) => {
    setOpenFaq(openFaq === id ? null : id)
  }

  return (
    <div className="help-page">
      <div className="help-container">
        <div className="help-header">
          <h1 className="page-title">Help & Support</h1>
          <p className="page-subtitle">Find answers to your questions and get the help you need</p>

          <div className="help-search">
            <div className="search-input-wrapper">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
              <input
                type="text"
                placeholder="Search for help..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
          </div>
        </div>

        <div className="help-content">
          {/* Quick Help Cards */}
          <div className="help-section">
            <h2 className="section-title">Get Help</h2>
            <div className="contact-grid">
              {contactOptions.map((option, index) => (
                <div key={index} className="contact-card">
                  <div className="contact-icon">{option.icon}</div>
                  <div className="contact-content">
                    <h3 className="contact-title">{option.title}</h3>
                    <p className="contact-description">{option.description}</p>
                  </div>
                  <button className="btn btn-secondary">{option.action}</button>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ Section */}
          <div className="help-section">
            <h2 className="section-title">Frequently Asked Questions</h2>

            <div className="faq-filters">
              {categories.map((category) => (
                <button
                  key={category.id}
                  className={`filter-btn ${selectedCategory === category.id ? "active" : ""}`}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <span className="filter-icon">{category.icon}</span>
                  <span className="filter-name">{category.name}</span>
                </button>
              ))}
            </div>

            <div className="faq-list">
              {filteredFaqs.map((faq) => (
                <div key={faq.id} className="faq-item">
                  <button
                    className={`faq-question ${openFaq === faq.id ? "open" : ""}`}
                    onClick={() => toggleFaq(faq.id)}
                  >
                    <span className="question-text">{faq.question}</span>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="question-arrow"
                    >
                      <polyline points="6,9 12,15 18,9"></polyline>
                    </svg>
                  </button>
                  {openFaq === faq.id && (
                    <div className="faq-answer">
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {filteredFaqs.length === 0 && (
              <div className="no-results">
                <div className="no-results-icon">🔍</div>
                <h3>No results found</h3>
                <p>Try adjusting your search or browse different categories.</p>
              </div>
            )}
          </div>

          {/* Status Section */}
          <div className="help-section">
            <h2 className="section-title">System Status</h2>
            <div className="status-card">
              <div className="status-indicator">
                <div className="status-dot operational"></div>
                <span className="status-text">All systems operational</span>
              </div>
              <div className="status-details">
                <div className="status-item">
                  <span className="status-service">API</span>
                  <span className="status-value operational">Operational</span>
                </div>
                <div className="status-item">
                  <span className="status-service">Code Generation</span>
                  <span className="status-value operational">Operational</span>
                </div>
                <div className="status-item">
                  <span className="status-service">Project Storage</span>
                  <span className="status-value operational">Operational</span>
                </div>
                <div className="status-item">
                  <span className="status-service">Authentication</span>
                  <span className="status-value operational">Operational</span>
                </div>
              </div>
              <a href="#" className="status-link">
                View detailed status →
              </a>
            </div>
          </div>

          {/* Contact Form */}
          <div className="help-section">
            <h2 className="section-title">Still Need Help?</h2>
            <div className="contact-form-card">
              <p className="contact-form-description">
                Can't find what you're looking for? Send us a message and we'll get back to you as soon as possible.
              </p>
              <form className="contact-form">
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Name</label>
                    <input type="text" className="form-input" placeholder="Your name" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <input type="email" className="form-input" placeholder="your@email.com" />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Subject</label>
                  <select className="form-select">
                    <option value="">Select a topic</option>
                    <option value="general">General Question</option>
                    <option value="technical">Technical Issue</option>
                    <option value="billing">Billing Question</option>
                    <option value="feature">Feature Request</option>
                    <option value="bug">Bug Report</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Message</label>
                  <textarea
                    className="form-textarea"
                    rows="5"
                    placeholder="Describe your question or issue in detail..."
                  ></textarea>
                </div>
                <button type="submit" className="btn btn-primary">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
