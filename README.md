# 🎯 Feedback Management System

A comprehensive feedback management application built with Django REST Framework and React that helps businesses effectively gather, prioritize, and act on customer feedback. This system enables customers to submit, vote on, comment on, and track feedback progress while providing product teams with powerful tools to manage the feedback lifecycle.

![HappyFox Feedback Management](./frontend/screenshots/dashboard.png)

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn

### Setup Instructions

1. **Backend Setup** (Django)
```bash
cd backend/feedback_mgmt
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r ../requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

2. **Frontend Setup** (React)
```bash
cd frontend
npm install
npm run dev
```

### Access Points
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000/api/
- **API Documentation**: http://localhost:8000/swagger/
- **Admin Panel**: http://localhost:8000/admin/

## 📋 Project Overview

This project implements a complete feedback management system with:

### ✅ **CRUD Operations for:**
- **Boards**: Containers for organizing feedback
- **Feedback**: Feature requests, bug reports, suggestions
- **Comments**: Discussion threads on feedback items

### ✅ **Role-Based Access Control:**
- **Admin**: Full system access and management
- **Moderator**: Content management and moderation
- **Contributor**: Submit feedback and participate in discussions

### ✅ **Multiple Data Views:**
- **Table View**: Sortable, filterable, paginated feedback list
- **Kanban Board**: Drag-and-drop status management
- **Dashboard**: Analytics and insights

### ✅ **Advanced Features:**
- Upvoting system for prioritization
- Tag-based organization
- Real-time status updates
- Comprehensive analytics
- Mobile-responsive design

## 🛠️ Tech Stack

### Backend
- **Django 4.2.23** + **Django REST Framework 3.16.0**
- **JWT Authentication** with Simple JWT 5.5.1
- **SQLite** (development) / PostgreSQL ready
- **Swagger/OpenAPI** documentation
- **CORS** support for frontend integration

### Frontend
- **React 18.2.0** with **Vite 5.0.8**
- **Tailwind CSS 3.4.0** with custom HappyFox theme
- **Chart.js 4.4.0** for analytics visualization
- **@dnd-kit** for drag-and-drop functionality
- **Axios 1.6.0** for API communication
- **React Router DOM 6.8.0** for navigation

## 🎨 Unique Features

### HappyFox Branding Integration
- Custom orange color palette throughout the application
- HappyFox logo integration in login, navigation, and splash screens
- Consistent design language matching HappyFox brand guidelines

### Advanced Permission System
- Granular permissions for different user roles
- Board-level access controls (public/private)
- Content ownership validation

### Real-time Drag & Drop
- Intuitive Kanban board interface
- Optimistic UI updates with server synchronization
- Smooth animations and visual feedback

### Comprehensive Analytics
- Interactive charts with Chart.js
- Multi-timeframe analysis (7, 30, 90 days)
- Tag distribution and trend analysis
- Top-voted feedback tracking

### Mobile-First Design
- Fully responsive across all device sizes
- Touch-optimized interactions
- Collapsible navigation for mobile
- Progressive Web App capabilities

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - User login
- `GET /api/auth/me/` - Current user profile

### Boards
- `GET /api/boards/` - List accessible boards
- `POST /api/boards/` - Create new board (Admin only)
- `PATCH /api/boards/{id}/` - Update board

### Feedback
- `GET /api/feedback/` - List feedback with filtering
- `POST /api/feedback/` - Create new feedback
- `POST /api/feedback/{id}/upvote/` - Toggle upvote
- `GET /api/feedback/summary/` - Analytics data

### Comments
- `GET /api/comments/` - List comments for feedback
- `POST /api/comments/` - Add new comment
- `PATCH /api/comments/{id}/` - Edit comment

## 📁 Project Structure

```
feedback-management/
├── backend/
│   └── feedback_mgmt/
│       ├── core/                 # Main Django app
│       │   ├── models.py         # User, Board, Feedback, Comment models
│       │   ├── views.py          # API ViewSets
│       │   ├── serializers.py    # DRF serializers
│       │   ├── permissions.py    # Custom permission classes
│       │   └── urls.py           # API routing
│       ├── feedback_mgmt/        # Django project settings
│       ├── manage.py
│       └── db.sqlite3
├── frontend/
│   ├── src/
│   │   ├── components/           # Reusable React components
│   │   ├── views/                # Page components
│   │   ├── api/                  # API service layer
│   │   ├── context/              # React Context providers
│   │   └── utils/                # Helper functions
│   ├── public/                   # Static assets
│   └── screenshots/              # Application screenshots
├── requirements.txt              # Python dependencies
└── README.md                     # This file
```

## 🎯 Implementation Highlights

### Custom Django Models
- Extended AbstractUser with role-based permissions
- Flexible board membership system
- Optimized database queries with select_related and prefetch_related

### React Architecture
- Context API for global state management
- Custom hooks for reusable logic
- Component composition for maintainable UI

### Security & Performance
- JWT-based authentication with automatic refresh
- SQL query optimization
- Rate limiting and input validation
- CORS configuration for secure cross-origin requests

## 📸 Screenshots

The application includes comprehensive screenshots showcasing:
- Login and authentication flow
- Dashboard with interactive analytics
- Board management interface
- Feedback table and Kanban views
- Mobile responsive design
- Comment system and user interactions

See the `/frontend/screenshots/` directory for all application screenshots.

## 🚀 Deployment

### Backend Deployment
- Configure environment variables for production
- Set up PostgreSQL database
- Configure static file serving
- Set DEBUG=False in settings

### Frontend Deployment
- Build production bundle with `npm run build`
- Deploy to CDN or static hosting
- Configure API base URL for production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

**Built with ❤️ for HappyFox Evaluation Project**

*Demonstrating full-stack development skills with Django + React*
