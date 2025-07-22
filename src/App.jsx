"use client"

import { BrowserRouter, Routes, Route } from "react-router-dom"
import Header from "./components/Header"
import HomePage from "./pages/HomePage"
import GeneratorPage from "./pages/GeneratorPage"
import ProfilePage from "./components/ProfilePage"
import ProjectsPage from "./components/ProjectsPage"
import SettingsPage from "./components/SettingsPage"
import BillingPage from "./components/BillingPage"
import HelpPage from "./components/HelpPage"
import "./App.css"

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/generate" element={<GeneratorPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/billing" element={<BillingPage />} />
        <Route path="/help" element={<HelpPage />} />
      </Routes>
    </BrowserRouter>
  )
}
