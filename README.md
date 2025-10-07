# IdeaBoard - Full-Stack Web Application

A modern, responsive web application featuring a marketing landing page and an interactive idea board where users can submit and upvote ideas anonymously. This project demonstrates modern full-stack development with professional Git workflow and comprehensive feature implementation.

## 🚀 Features Implemented

### Landing Page ✅

- Responsive marketing page with hero section
- Feature highlights section
- Call-to-action leading to the idea board
- Professional design with Material-UI styling
- Navigation to both idea board and Kanban demo

### Idea Board Mini-App ✅

- **Complete Dashboard Interface**: Professional statistics dashboard with live counters
- **Full CRUD Operations**: Submit, view, edit, and delete ideas
- **Advanced Search & Filtering**: Real-time search with multiple filter options
- **Sorting Capabilities**: Sort by newest, oldest, or most popular
- **Upvoting System**: Interactive upvoting with live counter updates
- **Form Validation**: 280-character limit with real-time validation
- **Responsive Design**: Mobile-first approach with card-based layout
- **Error Handling**: Comprehensive error states with fallback UI
- **Loading States**: Professional loading indicators and snackbar notifications
- **Time Formatting**: Human-readable "time ago" formatting
- **Anonymous Submissions**: No authentication required

### Bonus: Kanban Board Demo ✅

- Drag-and-drop task management system
- Task creation, editing, and deletion
- Team avatars and search functionality
- Fully functional example implementation

## 🛠 Tech Stack

### Frontend

- **React 19.1.1** with **Vite** for lightning-fast development
- **Material-UI (MUI) 7.3.4** for professional UI components
- **@hello-pangea/dnd** for drag-and-drop functionality
- **Axios** for API communication
- **React Router 7.9.3** for navigation
- **date-fns** for date formatting

### Backend

- **Node.js** with **Express.js 5.1.0** REST API
- **PostgreSQL 15** database with **Prisma ORM 6.16.3**
- **CORS** enabled for cross-origin requests
- **ES6+ modules** with modern JavaScript

### DevOps & Development

- **Docker & Docker Compose** for containerization
- **Git** with professional branching workflow
- **ESLint** for code quality
- **Nodemon** for development hot reloading

## 🚀 How to Run the Project

### Option 1: Docker Production Setup (Recommended)

**Full-stack containerized deployment with PostgreSQL**

1. **Prerequisites**
   - Docker Desktop installed and running
   - Git installed

2. **Quick Start - Production**
   ```bash
   git clone <repository-url>
   cd ideaboard-app
   
   # Windows
   .\docker-setup.ps1 prod
   
   # Linux/Mac
   ./docker-setup.sh prod
   ```

3. **Manual Docker Commands**
   ```bash
   # Build and start all services
   docker-compose up --build -d
   
   # View logs
   docker-compose logs -f
   
   # Stop all services
   docker-compose down
   ```

4. **Access the Application**
   - 🌐 **Frontend**: http://localhost:3000
   - 🔧 **Backend API**: http://localhost:5000
   - 🗄️ **Database**: PostgreSQL on localhost:5432

### Option 2: Docker Development Setup

**Database in container, manual backend/frontend for development**

```bash
# Start only PostgreSQL database
.\docker-setup.ps1 dev  # Windows
./docker-setup.sh dev   # Linux/Mac

# Or manually:
docker-compose -f docker-compose.dev.yml up -d
```

Then run backend and frontend manually (see Option 3).

### Option 3: Manual Development Setup

1. **Prerequisites**

   - Node.js 18+ installed
   - PostgreSQL 15+ running locally or via Docker

2. **Database Setup**

   ```bash
   # Start PostgreSQL with Docker
   docker run --name postgres-dev -e POSTGRES_PASSWORD=password -e POSTGRES_DB=ideaboard -p 5432:5432 -d postgres:15
   ```

3. **Backend Setup**

   ```bash
   cd backend
   npm install

   # Setup environment variables
   echo "DATABASE_URL=postgresql://postgres:password@localhost:5432/ideaboard" > .env

   # Generate Prisma client and push schema
   npm run db:generate
   npm run db:push

   # Start development server
   npm run dev
   ```

4. **Frontend Setup**

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

5. **Access the Application**
   - Frontend: http://localhost:5173 (Vite dev server)
   - Backend API: http://localhost:5000

## 📋 API Documentation

### Ideas Endpoints

- `GET /api/ideas` - Fetch all ideas with upvote counts
  - Returns: Array of idea objects with id, content, upvotes, createdAt
- `POST /api/ideas` - Create a new idea
  - Body: `{ "content": "Your idea here (max 280 chars)" }`
  - Returns: Created idea object
- `PUT /api/ideas/:id/upvote` - Upvote an idea
  - Returns: Updated idea object with new upvote count

### Example API Usage

```javascript
// Fetch all ideas
const response = await fetch("http://localhost:5000/api/ideas");
const ideas = await response.json();

// Create new idea
await fetch("http://localhost:5000/api/ideas", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ content: "My brilliant idea!" }),
});

// Upvote an idea
await fetch(`http://localhost:5000/api/ideas/${ideaId}/upvote`, {
  method: "PUT",
});
```

## 🏗 Project Structure

```
ideaboard-app/
├── frontend/                    # React + Vite frontend
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   └── KanbanBoard.jsx # Drag-and-drop Kanban demo
│   │   ├── pages/              # Page components
│   │   │   ├── LandingPage.jsx # Marketing homepage
│   │   │   ├── IdeaBoardPage.jsx # Main idea management app
│   │   │   └── KanbanPage.jsx   # Kanban demo page
│   │   ├── App.jsx             # Main app component with routing
│   │   └── main.jsx            # React entry point
│   ├── package.json            # Frontend dependencies
│   └── vite.config.js          # Vite configuration
├── backend/                     # Node.js + Express backend
│   ├── src/
│   │   ├── routes/             # API route handlers
│   │   │   └── ideas.js        # Ideas CRUD endpoints
│   │   ├── prisma/             # Database schema and migrations
│   │   │   └── schema.prisma   # Prisma database schema
│   │   └── index.js            # Express server entry point
│   ├── package.json            # Backend dependencies
│   └── .env                    # Environment variables (create manually)
├── docker-compose.yml          # Multi-service orchestration
├── docker-compose.dev.yml      # Development environment
└── README.md                   # This file
```

## 🎯 Development History & Git Workflow

This project was developed using professional Git branching with feature-wise commits:

### Completed Features (Git Log)

- ✅ **Initial Setup**: Project structure, README, and gitignore
- ✅ **Backend Foundation**: Express server with Prisma ORM setup
- ✅ **Landing Page**: Responsive marketing page with Material-UI
- ✅ **REST API**: Complete ideas CRUD endpoints with PostgreSQL
- ✅ **Idea Board Components**: Frontend components and API integration
- ✅ **Kanban Demo**: Drag-and-drop task management example
- ✅ **Full Idea Board**: Complete rewrite as functional dashboard

### Git Branch Strategy Used

- `master` - Main production branch
- `feature/idea-board-components` - Idea board development
- `feature/kanban-board` - Kanban demo implementation
- All features merged back to master with descriptive commits

## 🚀 What's Completed ✅

### Core Functionality

- [x] Full-stack architecture with React frontend and Node.js backend
- [x] PostgreSQL database with Prisma ORM for data persistence
- [x] RESTful API with comprehensive error handling
- [x] Professional UI/UX with Material-UI design system
- [x] Responsive design that works on all devices
- [x] Docker containerization for easy deployment

### Frontend Features

- [x] Professional landing page with marketing content
- [x] Fully functional idea board with dashboard interface
- [x] Real-time search and filtering capabilities
- [x] Multiple sorting options (newest, oldest, popular)
- [x] Form validation and error handling
- [x] Loading states and user feedback
- [x] Professional card-based layout
- [x] Drag-and-drop Kanban board demo

### Backend Features

- [x] Express.js REST API server
- [x] PostgreSQL database schema design
- [x] Prisma ORM for type-safe database operations
- [x] CORS configuration for frontend integration
- [x] Error handling and validation middleware
- [x] Environment configuration setup

### DevOps & Quality

- [x] Docker Compose for multi-service deployment
- [x] Professional Git workflow with feature branches
- [x] ESLint configuration for code quality
- [x] Modern JavaScript (ES6+) throughout
- [x] Comprehensive project documentation

## 🔄 What Needs to be Done (Handover Tasks)

### Immediate Tasks (Production Ready)

- [ ] **Production Environment Variables**: Create `.env.production` files with secure credentials
- [ ] **Database Migration**: Set up production PostgreSQL database and run migrations
- [ ] **Production Build**: Test `npm run build` for frontend and ensure static files serve correctly
- [ ] **HTTPS Configuration**: Set up SSL certificates and HTTPS redirect
- [ ] **Domain Setup**: Configure custom domain and DNS settings

### Testing & Quality Assurance

- [ ] **End-to-End Testing**: Add Cypress or Playwright tests for critical user flows
- [ ] **Unit Tests**: Add Jest tests for API endpoints and React components
- [ ] **Performance Testing**: Test with large datasets (1000+ ideas)
- [ ] **Cross-browser Testing**: Verify compatibility across browsers
- [ ] **Mobile Testing**: Thorough testing on actual mobile devices

### Security & Performance

- [ ] **Rate Limiting**: Add express-rate-limit to prevent API abuse
- [ ] **Input Sanitization**: Add validation/sanitization for user inputs
- [ ] **Database Indexing**: Add database indexes for better query performance
- [ ] **Caching**: Implement Redis caching for frequently accessed data
- [ ] **Security Headers**: Add helmet.js for security headers

### Deployment & Infrastructure

- [ ] **CI/CD Pipeline**: Set up GitHub Actions or similar for automated deployment
- [ ] **Production Hosting**: Deploy to AWS, Vercel, Heroku, or similar platform
- [ ] **Database Backup**: Set up automated database backups
- [ ] **Monitoring**: Add logging and monitoring (Winston, Sentry, etc.)
- [ ] **Environment Management**: Separate staging and production environments

### Future Enhancements (Optional)

- [ ] **Real-time Updates**: WebSocket integration for live idea updates
- [ ] **User Authentication**: Add user accounts with JWT authentication
- [ ] **Idea Categories**: Add tagging and categorization system
- [ ] **Advanced Search**: Full-text search with ElasticSearch
- [ ] **Analytics**: Add user analytics and idea performance metrics
- [ ] **Admin Panel**: Administrative interface for content moderation

## 🔧 Troubleshooting Guide

### Common Issues

**Database Connection Issues**

```bash
# Check if PostgreSQL is running
docker ps | grep postgres

# Reset database if needed
docker-compose down -v
docker-compose up --build
```

**Frontend Build Issues**

```bash
# Clear npm cache and reinstall
cd frontend
rm -rf node_modules package-lock.json
npm install
```

**API Endpoint Not Working**

```bash
# Check backend logs
docker-compose logs backend

# Verify database schema
cd backend
npm run db:push
```

### Environment Variables

Create `.env` file in backend directory:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/ideaboard"
PORT=5000
NODE_ENV=development
```

## 🤝 Project Handover Checklist

For the person taking over this project:

### Understanding the Codebase

- [ ] Clone repository and run locally using Docker
- [ ] Review Git commit history to understand development progression
- [ ] Test all functionality: landing page, idea submission, upvoting, search
- [ ] Examine API endpoints using Postman or similar tool
- [ ] Review database schema in `backend/src/prisma/schema.prisma`

### Technical Setup

- [ ] Verify Node.js 18+ and Docker are installed
- [ ] Confirm project runs successfully with `docker-compose up --build`
- [ ] Test both development and production configurations
- [ ] Set up IDE/editor with ESLint and Prettier extensions

### Next Steps Planning

- [ ] Prioritize remaining tasks based on deployment timeline
- [ ] Set up staging environment for testing
- [ ] Plan production deployment strategy
- [ ] Consider additional features based on user requirements

## 📞 Support & Documentation

### Key Files to Understand

- `frontend/src/pages/IdeaBoardPage.jsx` - Main application logic
- `backend/src/routes/ideas.js` - API endpoint definitions
- `backend/src/prisma/schema.prisma` - Database schema
- `docker-compose.yml` - Service orchestration

### Development Commands

```bash
# Frontend development
cd frontend && npm run dev

# Backend development
cd backend && npm run dev

# Database operations
cd backend && npm run db:push
cd backend && npm run db:generate

# Production builds
cd frontend && npm run build
cd backend && npm start
```

---

**Project Status**: 🟢 **Core Complete, Ready for Production Deployment**

**Built with ❤️ using modern web technologies**
