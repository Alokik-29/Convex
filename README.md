# 💬 Convex

A production-ready real-time chat application built with FastAPI, WebSockets, and React.

![Python](https://img.shields.io/badge/Python-3.11-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-latest-green)
![React](https://img.shields.io/badge/React-Vite-61DAFB?logo=react)
![WebSockets](https://img.shields.io/badge/WebSockets-enabled-orange)
![Docker](https://img.shields.io/badge/Docker-ready-blue)
![Live](https://img.shields.io/badge/Live-Demo-brightgreen)

## 🌐 Live Demo

**[convex-alokik.vercel.app](https://convex-alokik.vercel.app)**

## 🎥 Demo Video

[![Watch Demo](https://img.shields.io/badge/▶%20Watch%20Demo-FF0000?style=for-the-badge&logo=youtube&logoColor=white)](https://youtu.be/no_46axnxgA)

## 🚀 Features

- **Real-time messaging** via WebSockets
- **JWT Authentication** with secure password hashing (bcrypt)
- **Public & Private rooms** with password protection
- **Typing indicators** — see when someone is typing
- **Message history** — loads previous messages on join
- **Emoji picker** for messages
- **Rate limiting** middleware (30 requests/minute)
- **Docker support** with PostgreSQL & Redis
- **Beautiful Discord-like UI built with React**

## 🔒 Room System

### Public Rooms
- Visible to all users in the sidebar
- Join instantly with one click
- Great for open communities

### Private Rooms
- Hidden from the public rooms list
- Protected with a password
- Share the **room name + password** with friends to let them join
- Join via the **🔒 Join Private** button in the sidebar
- Perfect for small groups or teams

## 🛠️ Tech Stack

**Backend:**
- FastAPI + Uvicorn
- WebSockets for real-time communication
- SQLAlchemy + SQLite (swappable to PostgreSQL)
- JWT Authentication (python-jose)
- bcrypt password hashing
- Rate limiting middleware

**Frontend:**
- React + Vite
- React Router for navigation
- Axios for API calls
- WebSocket client for real-time messaging
- Responsive Discord-inspired UI

**DevOps:**
- Docker + Docker Compose
- PostgreSQL + Redis ready
- Deployed on Render (backend) + Vercel (frontend)

## 📁 Project Structure

```
Convex/
├── backend/
│   ├── models/          # Database models
│   ├── schemas/         # Pydantic schemas
│   ├── routers/         # API endpoints
│   ├── services/        # Business logic
│   ├── middleware/      # Rate limiting
│   ├── main.py          # App entry point
│   ├── database.py      # DB connection
│   ├── config.py        # Settings
│   ├── Dockerfile
│   └── requirements.txt
├── client/              # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Chat.jsx
│   │   │   ├── ChatArea.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Message.jsx
│   │   │   ├── CreateRoomModal.jsx
│   │   │   └── JoinPrivateModal.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
└── docker-compose.yml
```

## ⚙️ Setup & Installation

### Backend

1. Clone the repository:
```bash
git clone https://github.com/Alokik-29/Convex.git
cd Convex
```

2. Create virtual environment:
```bash
cd backend
python -m venv venv
venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create `.env` file in `backend/`:
```
SECRET_KEY=yoursecretkey
ACCESS_TOKEN_EXPIRE_MINUTES=30
DATABASE_URL=sqlite+aiosqlite:///./chatsphere.db
```

5. Run the server:
```bash
uvicorn main:app --reload
```

### Frontend

```bash
cd client
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

### With Docker

```bash
docker-compose up --build
```

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | Login & get JWT token |
| GET | `/rooms/` | Get all public rooms |
| POST | `/rooms/` | Create a room |
| POST | `/rooms/join-private` | Join private room |
| DELETE | `/rooms/messages/{id}` | Delete a message |
| WS | `/ws/{room_id}` | WebSocket connection |

## 🔌 WebSocket Events

| Event | Direction | Description |
|-------|-----------|-------------|
| `message` | Send/Receive | Chat message |
| `typing` | Send/Receive | Typing indicator |
| `reaction` | Send/Receive | Emoji reaction |
| `delete_message` | Send/Receive | Delete message |
| `system` | Receive | Join/leave notifications |

## 🐳 Docker Setup

The `docker-compose.yml` includes:
- **Backend** — FastAPI app
- **PostgreSQL** — Production database
- **Redis** — For scaling WebSocket broadcasts

## 👨‍💻 Author

Alokik Gour — [GitHub](https://github.com/Alokik-29) | [LinkedIn](https://linkedin.com/in/alokik29)
