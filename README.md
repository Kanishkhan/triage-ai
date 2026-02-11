# TRIAGE.AI 🏥

**AI-Powered Real-Time Patient Prioritization & Hospital Navigation System**

TRIAGE.AI is an intelligent healthcare management system designed to optimize emergency room workflows. By leveraging AI to analyze patient symptoms in real-time, it automatically prioritizes critical cases, assigns appropriate departments, and manages patient flow efficiently.

---

## 🚀 Key Features

*   **⚡ AI-Driven Triage**: Automatically classifies patient urgency (Emergency, Urgent, Normal) based on symptom analysis.
*   **🏥 Smart Department Routing**: Directs patients to the correct specialty (Cardiology, Orthopedics, etc.) based on keywords.
*   **📊 Real-Time Dashboard**: Live queue updates for hospital staff with color-coded urgency indicators.
*   **🔴 Emergency Alerts**: Immediate visual alerts for high-risk patients requiring instant attention.
*   **🔢 Auto-Token System**: Generates and manages patient tokens for organized queuing.

---

## 🛠️ Tech Stack

*   **Frontend**: React (Vite), Tailwind CSS, Axios
*   **Backend**: Node.js, Express.js
*   **Database**: MongoDB (Mongoose)
*   **AI Logic**: Keyword-based Natural Language Processing (Hackathon Optimized)

---

## 📂 Project Structure

```bash
triage-ai/
├── backend/            # Express Server & API
│   ├── config/         # Database Configuration
│   ├── controllers/    # Request Handlers
│   ├── models/         # Mongoose Schemas
│   ├── routes/         # API Endpoints
│   ├── services/       # Business Logic (AI & Queue)
│   └── utils/          # Helper Functions
│
└── frontend/           # React Application
    ├── src/
    │   ├── api/        # Axios Configuration
    │   ├── components/ # Reusable UI Components
    │   └── pages/      # Patient & Dashboard Views
```

---

## ⚙️ Setup & Installation

Follow these steps to get TRIAGE.AI running locally.

### Prerequisites

*   Node.js (v14+)
*   MongoDB (Local or Atlas URL)

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/triage-ai.git
cd triage-ai
```

### 2. Backend Setup

Navigate to the backend directory, install dependencies, and start the server.

```bash
cd backend
npm install
```

**Configure Environment:**
Create a `.env` file in the `backend` folder:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/triage-ai
NODE_ENV=development
```

**Start Server:**

```bash
npm run dev
```
*Server will run on `http://localhost:5000`*

### 3. Frontend Setup

Open a new terminal, navigate to the frontend directory, and start the React app.

```bash
cd frontend
npm install
npm run dev
```
*App will run on `http://localhost:5173`*

---

## 📖 Usage Guide

1.  **Patient Check-In**:
    *   Open `http://localhost:5173`.
    *   Enter symptoms (e.g., "severe chest pain") and submit.
    *   Receive a token, department assignment, and urgency status.

2.  **Staff Dashboard**:
    *   Navigate to `http://localhost:5173/dashboard`.
    *   View the live queue of patients.
    *   **Red Rows**: Emergency active cases (Top Priority).
    *   **Orange Rows**: Urgent cases.
    *   **Green Rows**: Normal cases.
    *   *Dashboard auto-refreshes every 5 seconds.*

---

## 🛡️ License

This project is open-source and available under the MIT License.
