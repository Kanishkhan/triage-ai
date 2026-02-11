# TRIAGE.AI Elite (Hospital OS) 🏥

**The ultimate AI-powered clinical lifecycle management system.**

TRIAGE.AI is a premium, high-performance healthcare OS designed for top-end clinical environments. It leverages an advanced tiered-scoring AI engine to prioritize patients with absolute precision, ensuring that critical care is delivered exactly when and where it's needed most.

---

## 💎 Elite Features

*   **🧠 Advanced Triage Engine (v5.0)**: A sophisticated clinical scoring algorithm that analyzes symptoms and intensity modifiers (e.g., "excruciating", "sudden onset") to assign precise urgency levels: **Emergency**, **Urgent**, or **Normal**.
*   **🏥 High-Precision Routing**: Automatically directs patients to **10+ specialized departments** including Neurology, Cardiology, Pediatrics, and Gastrointestinal specialists.
*   **✨ Premium Glassmorphism UI**: A stunning, high-contrast interface designed for maximum legibility and professional "Elite" aesthetics in both Light and Dark modes.
*   **🎙️ Smart Voice Intake**: Integrated Speech-to-Text for rapid symptom logging, reducing administrative overhead.
*   **📊 Enterprise Dashboard**: Real-time patient lifecycle management with advanced filtering, search, and detailed clinical insights.

---

## 🛠️ Performance Tech Stack

*   **Frontend**: React 18, Vite (Fast-Refresh), Tailwind CSS (Elite System), Framer Motion
*   **Backend**: Node.js, Express (ES6 Modules)
*   **Database**: MongoDB Atlas (Global Cluster)
*   **Theming**: Class-based Dark Mode with High-Contrast Fallbacks

---

## 📂 Architecture

```bash
triage-ai/
├── backend/            # Express Service Layer
│   ├── services/       # AI Classification & Queue Logic
│   ├── controllers/    # API Resource Management
│   ├── models/         # Mongoose Data Definitions
│   └── utils/          # Clinical Rule Set
│
└── frontend/           # High-Performance UI Layer
    ├── src/
    │   ├── api/        # Axios Core
    │   ├── components/ # Elite UI Components (Navbar, Layout)
    │   └── pages/      # Smart Intake & Live Dashboard
```

---

## ⚙️ Rapid Deployment

### 1. Prerequisites
- Node.js v18+
- MongoDB Connection String

### 2. Environment Configuration
Create a `.env` file in the `/backend` folder:
```env
PORT=5000
MONGO_URI=your_mongodb_atlas_uri
NODE_ENV=production
```

### 3. Quick Start
```bash
# In Root Directory
npm run dev
```

---

## 📖 Operational Guide

1.  **Patient Intake**: Open the portal and state symptoms clearly (e.g., "Sudden onset of severe chest pain").
2.  **Live Monitoring**: Use the Dashboard to view the prioritised queue. **Emergency** cases are pinned to the top with high-intensity visual cues.
3.  **Command Center**: Filter by department or urgency to manage patient flow across the entire facility.

---
**CERTIFIED ELITE PROTOCOL V5.2**

