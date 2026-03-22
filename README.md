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

<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/16a88beb-8d8f-4c00-a07f-060a05f97612" />
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/19413cc8-e160-4d83-a4dd-2b217f75c223" />
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/c7332a29-bb72-4c85-b001-9703a6b6fba8" />
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/4d461d04-d82f-4eb2-bf37-2dc5897e6ee8" />




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
