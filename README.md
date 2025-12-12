# ⚡ GeminiSight — Multimodal AI Defense & Analysis Engine (React + TypeScript)
Problem - [https://youtu.be/FSsMaYLAyHY](url)
Solution - [https://youtu.be/xgFHrbV98Xs](url)
Login & Use - [https://ai.studio/apps/drive/1wgM3T3coQxzhcpC5QQARxDK89gVnqCBl?fullscreenApplet=true*
](url)

An advanced **AI-powered multimodal analysis platform** built with **React, TypeScript, and Vite**, capable of real-time:

* 🏗 **Infrastructure defect detection**
* 🔍 **Forensics & CCTV accident analysis**
* 🎭 **Deepfake / spoof detection**
* 🌍 **Environmental hazard & wildfire monitoring**

Powered by **Gemini 3.0 Pro Vision**.

This repository contains the **full frontend application** for interacting with the GeminiSight engine.

---

## 🚀 Features

### 🔹 Multimodal AI Modes

Choose from four intelligence modes:

| Mode                    | Purpose                                                |
| ----------------------- | ------------------------------------------------------ |
| **InfrastructureSight** | Crack detection, corrosion analysis, structural safety |
| **ForensicSight**       | Accident analysis, object extraction, motion reasoning |
| **TruthGuard**          | Deepfake detection, frame anomaly analysis             |
| **EcoSentinel**         | Wildfire, smoke, and environmental hazard detection    |

---

## 📦 Tech Stack

* ⚛ **React (TypeScript)**
* ⚡ **Vite**
* 🎨 **Custom UI Components**
* 🔥 **Gemini 3.0 Pro Vision API**
* 📁 Modular components & services

---

## 📁 Project Structure

```
GeminiSight/
│
├── components/              # UI components (upload box, result cards, UI widgets)
├── services/                # API calls (Gemini API integration)
│
├── App.tsx                  # Main application logic
├── index.tsx                # Entry point
├── index.html               # Root HTML
│
├── package.json             # Dependencies
├── metadata.json            # App metadata
├── tsconfig.json            # TypeScript config
├── vite.config.ts           # Vite config
│
└── README.md                # Project documentation
```

---

## 🛠 Installation & Setup

### 1️⃣ Clone the repository

```bash
git clone https://github.com/kamalk2004/GeminiSight.git
cd GeminiSight
```

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Add your Gemini API key

Create a file:

```
services/apiKey.ts
```

Add:

```ts
export const GEMINI_API_KEY = "YOUR_API_KEY_HERE";
```

(You can switch later to environment variables.)

### 4️⃣ Start the development server

```bash
npm run dev
```

The app will run at:

```
http://localhost:5173/
```

---

## 🔧 How It Works

### 🖼 Upload Image

User uploads an image using the **AI Upload Component**.

### 🤖 Choose AI Mode

Frontend sends:

* selected mode
* prompt
* image file
  → to **services/geminiService.ts**

### 📤 Gemini API Call

The Gemini model returns:

* JSON analysis
* severity ratings
* visual tags
* AI insights per mode

### 📊 Client-side Rendering

The results appear in clean UI cards & visual containers.

---

## 📤 Example API Response (Deepfake)

```json
{
  "authenticity_score": 0.12,
  "detected_artifacts": ["mismatched lighting", "frame warping"],
  "risk_level": "High",
  "explanation": "Multiple facial inconsistencies detected."
}
```

---



## 🛡 License

This project is licensed under the **MIT License**.

---

## ❤️ Support the Project

If this project helps you, please leave a ⭐ on the repository!
