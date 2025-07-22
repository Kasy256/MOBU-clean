"use client"

import { useState, useEffect } from "react"
import { useLocation } from "react-router-dom"
import Prism from "prismjs"
import "prismjs/themes/prism-tomorrow.css"
import "prismjs/components/prism-javascript"
import "prismjs/components/prism-jsx"
import "prismjs/components/prism-typescript"
import "prismjs/components/prism-tsx"
import "prismjs/components/prism-css"
import "prismjs/components/prism-scss"
import "prismjs/components/prism-json"
import "prismjs/components/prism-yaml"
import "prismjs/components/prism-dart"
import "prismjs/components/prism-markup"
import PromptInput from "../components/PromptInput"
import "../styles/GeneratorPage.css"
import { generate, saveProject, getPreview } from "../api"
import { auth } from "../firebaseConfig"

export default function GeneratorPage() {
  const location = useLocation()
  const [generatedCode, setGeneratedCode] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [framework, setFramework] = useState("react-native")
  const [projectFiles, setProjectFiles] = useState([])
  const [selectedFile, setSelectedFile] = useState("")
  const [projectId, setProjectId] = useState(null)
  const [expoUrl, setExpoUrl] = useState(null)
  const user = auth.currentUser

  useEffect(() => {
    if (location.state?.prompt) {
      handleGenerate(location.state.prompt, location.state.framework || "react-native")
    }
  }, [location.state])

  useEffect(() => {
    if (generatedCode) {
      Prism.highlightAll()
    }
  }, [generatedCode])

  const handleGenerate = async (prompt, framework) => {
    setIsGenerating(true)
    setFramework(framework)
    const res = await generate(prompt, framework)
    setGeneratedCode(res.code)
    setProjectId(res.project_id)
    setExpoUrl(res.expo_url)
    setIsGenerating(false)
  }

  const handleSave = async () => {
    if (!user) return
    await saveProject(prompt, generatedCode, "react-native", expoUrl)
    // Optionally show a success message
  }

  const handlePreview = async () => {
    if (!projectId) return
    const res = await getPreview(projectId)
    setExpoUrl(res.expo_url)
    // Optionally open in new tab: window.open(res.expo_url, "_blank")
  }

  const generateProjectFiles = (prompt, framework) => {
    const baseFiles = {
      "react-native": [
        {
          name: "App.js",
          type: "file",
          icon: "⚛️",
          content: `import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  SafeAreaView,
} from 'react-native';

const App = () => {
  const [inputValue, setInputValue] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Generated Mobile App</Text>
          <Text style={styles.subtitle}>Based on: "${prompt}"</Text>
        </View>

        <View style={styles.content}>
          <TextInput
            style={styles.input}
            placeholder="Enter some text..."
            value={inputValue}
            onChangeText={setInputValue}
          />
          
          <TouchableOpacity style={styles.primaryButton}>
            <Text style={styles.buttonText}>Primary Action</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>Secondary Action</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Generated with m0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: 'white',
  },
  primaryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#007AFF',
    width: '100%',
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    marginTop: 40,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#999',
  },
});

export default App;`,
        },
        {
          name: "package.json",
          type: "file",
          icon: "📦",
          content: `{
  "name": "generated-mobile-app",
  "version": "1.0.0",
  "main": "node_modules/expo/AppEntry.js",
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web"
  },
  "dependencies": {
    "expo": "~49.0.0",
    "react": "18.2.0",
    "react-native": "0.72.6",
    "react-native-screens": "~3.22.0",
    "react-native-safe-area-context": "4.6.3"
  },
  "devDependencies": {
    "@babel/core": "^7.20.0"
  }
}`,
        },
        {
          name: "components/",
          type: "folder",
          icon: "📁",
          children: [
            {
              name: "Button.js",
              type: "file",
              icon: "⚛️",
              content: `import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const Button = ({ title, onPress, variant = 'primary' }) => {
  return (
    <TouchableOpacity 
      style={[styles.button, styles[variant]]} 
      onPress={onPress}
    >
      <Text style={[styles.text, styles[\`\${variant}Text\`]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
  },
  primary: {
    backgroundColor: '#007AFF',
  },
  secondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
  primaryText: {
    color: 'white',
  },
  secondaryText: {
    color: '#007AFF',
  },
});

export default Button;`,
            },
            {
              name: "Input.js",
              type: "file",
              icon: "⚛️",
              content: `import React from 'react';
import { TextInput, StyleSheet } from 'react-native';

const Input = ({ placeholder, value, onChangeText, ...props }) => {
  return (
    <TextInput
      style={styles.input}
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: 'white',
  },
});

export default Input;`,
            },
          ],
        },
        {
          name: "app.json",
          type: "file",
          icon: "⚙️",
          content: `{
  "expo": {
    "name": "Generated Mobile App",
    "slug": "generated-mobile-app",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#FFFFFF"
      }
    },
    "web": {
      "favicon": "./assets/favicon.png"
    }
  }
}`,
        },
      ],
      flutter: [
        {
          name: "lib/",
          type: "folder",
          icon: "📁",
          children: [
            {
              name: "main.dart",
              type: "file",
              icon: "🐦",
              content: `import 'package:flutter/material.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Generated App',
      theme: ThemeData(
        primarySwatch: Colors.blue,
        visualDensity: VisualDensity.adaptivePlatformDensity,
      ),
      home: HomePage(),
    );
  }
}

class HomePage extends StatefulWidget {
  @override
  _HomePageState createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  final TextEditingController _controller = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Generated Mobile App'),
        elevation: 0,
      ),
      body: SingleChildScrollView(
        padding: EdgeInsets.all(20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            SizedBox(height: 20),
            Text(
              'Based on: "${prompt}"',
              style: TextStyle(
                fontSize: 18,
                color: Colors.grey[600],
              ),
              textAlign: TextAlign.center,
            ),
            SizedBox(height: 40),
            TextField(
              controller: _controller,
              decoration: InputDecoration(
                labelText: 'Enter some text',
                border: OutlineInputBorder(),
                filled: true,
                fillColor: Colors.grey[50],
              ),
            ),
            SizedBox(height: 20),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: () {},
                child: Text('Primary Action'),
                style: ElevatedButton.styleFrom(
                  padding: EdgeInsets.symmetric(vertical: 15),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}`,
            },
          ],
        },
        {
          name: "pubspec.yaml",
          type: "file",
          icon: "📄",
          content: `name: generated_mobile_app
description: A generated Flutter application.
version: 1.0.0+1

environment:
  sdk: '>=2.19.0 <4.0.0'

dependencies:
  flutter:
    sdk: flutter
  cupertino_icons: ^1.0.2

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^2.0.0

flutter:
  uses-material-design: true`,
        },
      ],
    }

    return baseFiles[framework] || baseFiles["react-native"]
  }

  const handleFileSelect = (file) => {
    setSelectedFile(file.name)
    setGeneratedCode(file.content)
  }

  const renderFileTree = (files, level = 0) => {
    return files.map((file, index) => {
      const fileExtension = file.type === "file" ? file.name.split(".").pop().toLowerCase() : ""
      const fileTypeClass = file.type === "file" ? `file-type ${fileExtension}` : ""
      
      return (
        <div key={index} className="file-tree-item">
          <div
            className={`file-item ${selectedFile === file.name ? "selected" : ""}`}
            style={{ paddingLeft: `${level * 20 + 12}px` }}
            onClick={() => file.type === "file" && handleFileSelect(file)}
          >
            <span className="file-icon">{file.icon}</span>
            <span className="file-name">{file.name}</span>
            {file.type === "file" && <span className={fileTypeClass}>{fileExtension}</span>}
          </div>
          {file.children && <div className="file-children">{renderFileTree(file.children, level + 1)}</div>}
        </div>
      )
    })
  }

  const getLanguageClass = (fileName) => {
    if (!fileName) return "language-javascript"
    const extension = fileName.split(".").pop().toLowerCase()
    const languageMap = {
      js: "language-javascript",
      jsx: "language-jsx",
      ts: "language-typescript",
      tsx: "language-tsx",
      css: "language-css",
      scss: "language-scss",
      json: "language-json",
      yaml: "language-yaml",
      yml: "language-yaml",
      dart: "language-dart",
      html: "language-markup",
      xml: "language-markup"
    }
    return languageMap[extension] || "language-javascript"
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedCode)
  }

  const downloadProject = () => {
    const element = document.createElement("a")
    const file = new Blob([generatedCode], { type: "text/plain" })
    element.href = URL.createObjectURL(file)
    element.download = `${selectedFile || "app"}`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  return (
    <div className="generator-page">
      

      {/* Main Content Area */}
      <div className="generator-content">
        {/* Top Input Section */}
      <div className="generator-header">
        <div className="header-content">
          <h1 className="page-title">Mobile App Generator</h1>
          <div className="prompt-section">
            <PromptInput onGenerate={handleGenerate} />
          </div>
        </div>
         {/* Middle - File Structure */}
        <div className="files-section">
          <div className="files-header">
            <h3 className="section-title">Project Files</h3>
            <div className="files-count">
              {projectFiles.length > 0 && (
                <span className="count-badge">
                  {projectFiles.reduce((count, file) => {
                    return count + (file.children ? file.children.length : 1)
                  }, 0)}{" "}
                  files
                </span>
              )}
            </div>
          </div>

          <div className="files-content">
            {isGenerating ? (
              <div className="files-loading">
                <div className="loading-spinner"></div>
                <p>Creating project files...</p>
              </div>
            ) : projectFiles.length > 0 ? (
              <div className="file-tree">{renderFileTree(projectFiles)}</div>
            ) : (
              <div className="empty-files">
                <div className="empty-icon">📁</div>
                <p>No files generated yet</p>
                <p>Generate an app to see the project structure</p>
              </div>
            )}
          </div>
        </div>
      </div>
        {/* Left Side - Mobile Preview */}
        <div className="preview-section">
          <div className="preview-header">
            <h3 className="section-title">App Preview</h3>
            <div className="framework-badge">{framework}</div>
          </div>

          <div className="mobile-preview-container">
            {isGenerating ? (
              <div className="generating-preview">
                <div className="phone-frame">
                  <div className="phone-screen">
                    <div className="loading-content">
                      <div className="loading-spinner"></div>
                      <p>Generating your app...</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : generatedCode ? (
              <div className="phone-frame">
                <div className="phone-screen">
                  <div className="app-preview">
                    <div className="preview-header-bar">
                      <div className="status-bar">
                        <span className="time">9:41</span>
                        <div className="status-icons">
                          <span className="signal">●●●</span>
                          <span className="battery">100%</span>
                        </div>
                      </div>
                    </div>
                    <div className="preview-content">
                      <div className="app-header">
                        <h2>Generated App</h2>
                        <p>Framework: {framework}</p>
                      </div>
                      <div className="app-body">
                        <div className="input-field"></div>
                        <div className="primary-button">Primary Action</div>
                        <div className="secondary-button">Secondary Action</div>
                      </div>
                      <div className="app-footer">
                        <small>Generated with m0</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="empty-preview">
                <div className="phone-frame">
                  <div className="phone-screen">
                    <div className="empty-content">
                      <h3>No Preview Available</h3>
                      <p>Generate an app to see the preview</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side - Code Section */}
        <div className="code-section">
          <div className="code-header">
            <div className="code-title">
              <h3 className="section-title">{selectedFile || "Generated Code"}</h3>
              {selectedFile && <span className="file-path">{selectedFile}</span>}
            </div>
            <div className="code-actions">
              <button className="btn btn-secondary" onClick={copyToClipboard} disabled={!generatedCode}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
                Copy Code
              </button>
              <button className="btn btn-primary" onClick={downloadProject} disabled={!generatedCode}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7,10 12,15 17,10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                Download
              </button>
            </div>
          </div>

          <div className="code-display">
            {isGenerating ? (
              <div className="code-loading">
                <div className="loading-spinner"></div>
                <p>Generating code...</p>
              </div>
            ) : generatedCode ? (
              <pre className={getLanguageClass(selectedFile)}>
                <code>{generatedCode}</code>
              </pre>
            ) : (
              <div className="empty-code">
                <p>No code generated yet</p>
                <p>Enter a prompt above to generate mobile app code</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
