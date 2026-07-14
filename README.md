# MeetFlow 🎥

A real-time video conferencing web application built with React, Node.js, WebRTC, and Socket.io — supporting secure meeting rooms, screen sharing, and in-meeting chat.

🔗 **Live Demo:** [meetflow-eight.vercel.app](https://meetflow-eight.vercel.app)

---

## ✨ Features

- 🎦 Real-time video & audio communication (peer-to-peer via WebRTC)
- 🔐 Create and join secure meeting rooms
- 🖥️ Screen sharing
- 💬 In-meeting chat
- 🎙️ Camera & microphone controls
- 📱 Responsive, user-friendly interface

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js |
| Backend | Node.js, Express.js |
| Real-time Communication | WebRTC, Socket.io |
| Database | MongoDB |

## 🏗️ How It Works

1. A user creates a room; the backend generates a unique room ID.
2. Socket.io handles signaling — exchanging offer/answer SDPs and ICE candidates between peers.
3. Once signaling completes, WebRTC establishes a direct peer-to-peer connection for video/audio/screen streams.
4. Chat messages are relayed through the Socket.io server for low-latency delivery.

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+)
- MongoDB instance (local or Atlas)

### Installation

```bash
# Clone the repo
git clone https://github.com/vandana-kumari4/MeetFlow.git
cd MeetFlow

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Environment Variables

Create a `.env` file in the `backend` folder:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

### Run Locally

```bash
# Start backend
cd backend
npm start

# Start frontend (in a new terminal)
cd frontend
npm start
```

The app will be available at `http://localhost:3000`.

## 📸 Screenshots

<!-- Add 2-3 screenshots or a short GIF of the app here -->

## 🎯 What I Learned

Building MeetFlow gave hands-on experience with real-time peer-to-peer communication, WebRTC signaling flows, and handling multiple concurrent connections in a full-stack environment.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

