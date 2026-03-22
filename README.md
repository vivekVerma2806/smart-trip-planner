# 🌍 TravelAI – Collaborative AI Trip Planner

An AI-powered travel planning platform that enables users to generate, share, and collaboratively plan trips with an intuitive and interactive experience.

---

## 🚀 Features

* 🤖 AI-generated day-wise travel itineraries
* 🗺️ Interactive map with location visualization
* 🔐 Secure user authentication (JWT)
* 💾 Save and manage personal trips
* 🔗 Share trips via unique links
* 👥 Multi-user collaboration (join trips)
* 💬 Comment system for trip discussions
* 📄 Download itinerary as PDF
* ⚡ Fallback handling for API failures

---

## 🧠 Problem It Solves

Planning trips—especially in groups—is often fragmented across multiple tools (chat, notes, maps). TravelAI solves this by combining AI generation, persistence, and collaboration into a single platform.

---

## 🛠️ Tech Stack

**Frontend:** React, Tailwind CSS
**Backend:** Node.js, Express.js
**Database:** MongoDB Atlas
**Authentication:** JWT
**AI Integration:** Gemini API
**Maps:** OpenStreetMap (Geocoding API)

---

## ⚙️ Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/your-username/travelai-collaborative-planner.git
cd travelai-collaborative-planner
```

### 2. Install dependencies

```bash
cd client && npm install
cd ../server && npm install
```

### 3. Environment Variables

Create a `.env` file inside the `server` folder:

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
GEMINI_API_KEY=your_api_key
```

---

## ▶️ Running the App

### Backend

```bash
cd server
npm start
```

### Frontend

```bash
cd client
npm run dev
```

---

## 🌐 Deployment

* Frontend: Vercel
* Backend: Render
* Database: MongoDB Atlas

---

## 📸 Demo

(Add screenshots or demo link here)

---

## 📌 Key Highlights

* Designed with a focus on **clean architecture and modular routing**
* Handles **API failures gracefully using fallback mechanisms**
* Supports **multi-user collaboration without real-time complexity**
* Built with **scalability and user experience in mind**

---

## 🔮 Future Improvements

* Voting system for place selection
* Real-time collaboration using Socket.io
* Personalized trip recommendations

---

## 👨‍💻 Author

**Vivek Kumar Verma**

---

## ⭐ Show Your Support

If you like this project, give it a ⭐ on GitHub!
