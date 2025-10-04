# IdeaBoard - Full-Stack Web Application

A modern, responsive web application featuring a marketing landing page and an interactive idea board where users can submit and upvote ideas anonymously.

## 🚀 Features

### Landing Page
- Responsive marketing page with hero section
- Feature highlights section
- Call-to-action leading to the idea board

### Idea Board Mini-App
- Submit ideas (max 280 characters)
- Real-time idea display
- Upvoting system with live counters
- Anonymous submissions
- Persistent data storage

## 🛠 Tech Stack

### Frontend
- **React 18** with **Vite** for fast development
- **Material-UI (MUI)** for modern, responsive UI components
- **JavaScript ES6+** with modern syntax
- **React Router** for navigation

### Backend
- **Node.js** with **Express.js** REST API
- **JavaScript ES6+** with ES modules
- **PostgreSQL** database with **Prisma ORM**
- **CORS** enabled for cross-origin requests

### DevOps & Deployment
- **Docker** containerization for all services
- **Docker Compose** for local development
- **PostgreSQL** database container
- Production-ready configuration

## 🐳 Quick Start with Docker

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ideaboard-app
   ```

2. **Start the application**
   ```bash
   docker-compose up --build
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - PostgreSQL: localhost:5432

## 📋 API Endpoints

### Ideas
- `GET /api/ideas` - Fetch all ideas
- `POST /api/ideas` - Create a new idea
- `PUT /api/ideas/:id/upvote` - Upvote an idea

## 🏗 Project Structure

```
ideaboard-app/
├── frontend/              # React + Vite frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   └── types/         # Type definitions and constants
│   ├── Dockerfile
│   └── package.json
├── backend/               # Node.js + Express backend
│   ├── src/
│   │   ├── routes/        # API route handlers
│   │   ├── models/        # Database models
│   │   └── middleware/    # Express middleware
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml     # Multi-service orchestration
└── README.md
```

## 🚀 Development

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- Git

### Local Development Setup

1. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   npm run dev
   ```

3. **Database Setup**
   ```bash
   docker run --name postgres-dev -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres:15
   ```

## 🎯 Development Philosophy

This project demonstrates:
- **Clean Architecture**: Separation of concerns between frontend and backend
- **Modern Tooling**: Latest versions of React, Node.js, and containerization
- **Modern JavaScript**: ES6+ features with clean, readable code
- **Responsive Design**: Mobile-first approach with MUI
- **Professional Standards**: Comprehensive documentation and Git practices

## 🚀 Future Enhancements

- Real-time updates with WebSocket connections
- User authentication and profiles
- Idea categories and filtering
- Advanced upvoting algorithms
- Kubernetes deployment manifests
- CI/CD pipeline integration

---

**Built with ❤️ using modern web technologies**