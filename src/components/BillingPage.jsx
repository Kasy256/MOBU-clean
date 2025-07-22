"use client"

import { useState, useEffect } from "react"
import "../styles/BillingPage.css"
import { billingInitiate, billingVerify, getBillingHistory } from "../api"
import { auth } from "../firebaseConfig"

export default function BillingPage() {
  const [currentPlan] = useState({
    name: "Pro",
    price: 29,
    interval: "month",
    features: [
      "Unlimited projects",
      "Advanced AI models",
      "Priority support",
      "Export to multiple formats",
      "Team collaboration",
    ],
  })

  const [billingHistory, setBillingHistory] = useState([])
  const user = auth.currentUser

  useEffect(() => {
    if (!user) return
    getBillingHistory(user.uid).then(res => setBillingHistory(res.history || []))
  }, [user])

  const [paymentMethod] = useState({
    type: "card",
    last4: "4242",
    brand: "Visa",
    expiry: "12/26",
  })

  const plans = [
    {
      name: "Free",
      price: 0,
      interval: "month",
      description: "Perfect for getting started",
      features: [
        "3 projects per month",
        "Basic AI models",
        "Community support",
        "Code export",
      ],
      current: false,
    },
    {
      name: "Pro",
      price: 29,
      interval: "month",
      description: "For serious developers",
      features: [
        "Unlimited projects",
        "Advanced AI models",
        "Priority support",
        "Export to multiple formats",
        "Team collaboration",
      ],
      current: true,
      popular: true,
    },
    {
      name: "Team",
      price: 99,
      interval: "month",
      description: "For growing teams",
      features: [
        "Everything in Pro",
        "10 team members",
        "Advanced analytics",
        "Custom branding",
        "SLA guarantee",
      ],
      current: false,
    },
  ]

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const handlePlanChange = (planName) => {
    console.log("Changing to plan:", planName)
  }

  const handleCancelSubscription = () => {
    if (window.confirm("Are you sure you want to cancel your subscription?")) {
      console.log("Cancelling subscription")
    }
  }

  const handleUpdatePayment = () => {
    console.log("Updating payment method")
  }

  const handleDownloadInvoice = (invoice) => {
    console.log("Downloading invoice:", invoice)
  }

  const handleUpgrade = async (plan) => {
    if (!user) return
    const res = await billingInitiate(user.email, plan.price)
    window.location.href = res.data.authorization_url
  }

  return (
    <div className="billing-page">
      <div className="billing-container">
        <div className="billing-header">
          <h1 className="page-title">Billing & Subscription</h1>
          <p className="page-subtitle">Manage your subscription and payment information</p>
        </div>

        <div className="billing-content">
          {/* Current Plan */}
          <div className="billing-section">
            <h2 className="section-title">Current Plan</h2>
            <div className="current-plan-card">
              <div className="plan-info">
                <div className="plan-header">
                  <h3 className="plan-name">{currentPlan.name}</h3>
                  <div className="plan-price">
                    <span className="price-amount">${currentPlan.price}</span>
                    <span className="price-interval">/{currentPlan.interval}</span>
                  </div>
                </div>
                <div className="plan-features">
                  {currentPlan.features.map((feature, index) => (
                    <div key={index} className="feature-item">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="20,6 9,17 4,12"></polyline>
                      </svg>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="plan-actions">
                <button className="btn btn-secondary" onClick={handleCancelSubscription}>
                  Cancel Subscription
                </button>
              </div>
            </div>
          </div>

          {/* Available Plans */}
          <div className="billing-section">
            <h2 className="section-title">Available Plans</h2>
            <div className="plans-grid">
              {plans.map((plan, index) => (
                <div key={index} className={`plan-card ${plan.current ? 'current' : ''} ${plan.popular ? 'popular' : ''}`}>
                  {plan.popular && <div className="popular-badge">Most Popular</div>}
                  <div className="plan-card-header">
                    <h3 className="plan-card-name">{plan.name}</h3>
                    <div className="plan-card-price">
                      <span className="price-amount">${plan.price}</span>
                      <span className="price-interval">/{plan.interval}</span>
                    </div>
                    <p className="plan-description">{plan.description}</p>
                  </div>
                  <div className="plan-card-features">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="feature-item">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="20,6 9,17 4,12"></polyline>
                        </svg>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                  <div className="plan-card-action">
                    {plan.current ? (
                      <button className="btn btn-ghost" disabled>
                        Current Plan
                      </button>
                    ) : (
                      <button 
                        className="btn btn-primary" 
                        onClick={() => handleUpgrade(plan)}
                      >
                        {plan.price === 0 ? 'Downgrade' : 'Upgrade'}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Method */}
          <div className="billing-section">
            <h2 className="section-title">Payment Method</h2>
            <div className="payment-card">
              <div className="payment-info">
                <div className="payment-method">
                  <div className="card-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                      <line x1="1" y1="10" x2="23" y2="10"></line>
                    </svg>
                  </div>
                  <div className="card-details">
                    <div className="card-brand">{paymentMethod.brand} ending in {paymentMethod.last4}</div>
                    <div className="card-expiry">Expires {paymentMethod.expiry}</div>
                  </div>
                </div>
              </div>
              <div className="payment-actions">
                <button className="btn btn-secondary" onClick={handleUpdatePayment}>
                  Update Payment Method
                </button>
              </div>
            </div>
          </div>

          {/* Billing History */}
          <div className="billing-section">
            <h2 className="section-title">Billing History</h2>
            <div className="billing-history">
              <div className="history-header">
                <div className="history-column">Date</div>
                <div className="history-column">Description</div>
                <div className="history-column">Amount</div>
                <div className="history-column">Status</div>
                <div className="history-column">Actions</div>
              </div>
              {billingHistory.map((item) => (
                <div key={item.id} className="history-row">
                  <div className="history-cell">{formatDate(item.date)}</div>
                  <div className="history-cell">{item.description}</div>
                  <div className="history-cell">${item.amount.toFixed(2)}</div>
                  <div className="history-cell">
                    <span className={`status-badge ${item.status}`}>
                      {item.status}
                    </span>
                  </div>
                  <div className="history-cell">
                    <button 
                      className="btn btn-ghost btn-sm" 
                      onClick={() => handleDownloadInvoice(item.invoice)}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="7,10 12,15 17,10"></polyline>
                        <line x1="12" y1="15" x2="12" y2="3"></line>
                      </svg>
                      Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Usage Stats */}
          <div className="billing-section">
            <h2 className="section-title">Usage This Month</h2>
            <div className="usage-stats">
              <div className="usage-item">
                <div className="usage-metric">
                  <div className="metric-value">24</div>
                  <div className="metric-label">Projects Generated</div>
                </div>
                <div className="usage-bar">
                  <div className="usage-progress" style={{ width: '80%' }}></div>
                </div>
                <div className="usage-limit">24 / 30 limit</div>
              </div>
              <div className="usage-item">
                <div className="usage-metric">
                  <div className="metric-value">156</div>
                  <div className="metric-label">AI Generations</div>
                </div>
                <div className="usage-bar">
                  <div className="usage-progress" style={{ width: '62%' }}></div>
                </div>
                <div className="usage-limit">156 / 250 limit</div>
              </div>
              <div className="usage-item">
                <div className="usage-metric">
                  <div className="metric-value">3.2 GB</div>
                  <div className="metric-label">Storage Used</div>
                </div>
                <div className="usage-bar">
                  <div className="usage-progress" style={{ width: '32%' }}></div>
                </div>
                <div className="usage-limit">3.2 / 10 GB limit</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
