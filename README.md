# 💰 SaveMate Frontend

A modern React-based web application for discovering and managing local deals and discounts in Poland. Built with React, Vite, and Tailwind CSS.

## 🎯 Project Overview

SaveMate is a local deals platform connecting Polish consumers with businesses offering discounts and promotions. This repository contains the frontend application that provides an intuitive interface for users to browse deals, manage favorites, and interact with local businesses.


## ✨ Features Implemented

### Phase 6 - Authentication (Current)

- ✅ **User Login**
  - Email or username authentication
  - Password visibility toggle
  - "Remember me" functionality
  - Form validation and error handling
  - JWT token management
  
- ✅ **Protected Routes**
  - Authentication-based route protection
  - Automatic redirect to login for unauthorized access
  - Token persistence across sessions
  
- ✅ **User Dashboard**
  - Personalized welcome message
  - Quick access to deals, favorites, and reviews
  - Secure logout functionality

## 🛠️ Tech Stack

- **Framework:** React 18.2.0
- **Build Tool:** Vite 5.4.21
- **Styling:** Tailwind CSS 3.3.6
- **Routing:** React Router DOM 6.20.1
- **HTTP Client:** Axios 1.6.2
- **Language:** JavaScript (ES6+)

## 📦 Installation

### Prerequisites

- Node.js (v16 or higher)
- npm (v8 or higher)
- SaveMate Backend running on `http://localhost:8000`

### Setup Steps

1. **Clone the repository:**
   ```bash
   git clone https://github.com/jenfranx30/savemate-frontend.git
   cd savemate-frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment:**
   - Backend API URL is set to `http://localhost:8000/api/v1` in `src/services/authService.js`
   - Update if your backend runs on a different port

4. **Run development server:**
   ```bash
   npm run dev
   ```

5. **Open in browser:**
   ```
   http://localhost:5173
   ```

## 🚀 Available Scripts

- `npm run dev` - Start development server (port 5173)
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 📁 Project Structure

```
savemate-frontend/
├── src/
│   ├── components/
│   │   ├── auth/
│   │   │   └── LoginPage.jsx       # Login form component
│   │   └── HomePage.jsx             # Dashboard/home page
│   ├── context/
│   │   └── AuthContext.jsx          # Global authentication state
│   ├── services/
│   │   └── authService.js           # API calls and token management
│   ├── App.jsx                      # Main app with routing
│   ├── index.css                    # Tailwind CSS imports
│   └── main.jsx                     # React entry point
├── public/                          # Static assets
├── index.html                       # HTML template
├── package.json                     # Dependencies and scripts
├── postcss.config.js                # PostCSS configuration
├── tailwind.config.js               # Tailwind CSS configuration
└── vite.config.js                   # Vite configuration
```

## 🔐 Authentication Flow

1. User navigates to `/login`
2. Enters email/username and password
3. Frontend sends credentials to backend API
4. Backend validates and returns JWT tokens
5. Tokens stored in localStorage
6. User redirected to dashboard
7. Protected routes check token validity
8. Axios interceptor adds token to all API requests

## 🎨 Design System

### Color Palette

- **Primary Blue:** #0ea5e9 (various shades from 50-900)
- **Background Gradient:** Blue-50 to Indigo-100
- **Error Red:** #ef4444
- **Success Green:** #10b981

### Components

- Responsive mobile-first design
- Consistent spacing and typography
- Smooth transitions and hover effects
- Accessible form inputs with ARIA labels

## 🔌 API Integration

### Base URL
```
http://localhost:8000/api/v1
```

### Endpoints Used

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/login` | User login |
| POST | `/auth/register` | User registration |
| POST | `/auth/refresh` | Refresh access token |

### Request Example
```javascript
POST /api/v1/auth/login
Content-Type: application/json

{
  "email_or_username": "testuser",
  "password": "Test1234"
}
```

### Response Example
```javascript
{
  "access_token": "eyJhbGc...",
  "refresh_token": "eyJhbGc...",
  "token_type": "bearer",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "test@savemate.com",
    "username": "testuser",
    "full_name": "Test User"
  }
}
```

## 🧪 Testing

### Manual Testing Checklist

- [x] Login with valid credentials
- [x] Login with invalid credentials shows error
- [x] Empty form shows validation error
- [x] Password visibility toggle works
- [x] Remember me checkbox functionality
- [x] Successful login redirects to dashboard
- [x] Tokens stored in localStorage
- [x] Protected routes redirect to login when not authenticated
- [x] Logout clears tokens and redirects to login
- [x] Mobile responsive design (tested at 375px width)

### Test Credentials

```
Username: testuser
Password: Test1234
```

## 📱 Responsive Design

The application is fully responsive and tested on:

- Desktop (1920x1080)
- Laptop (1366x768)
- Tablet (768x1024)
- Mobile (375x667)

## 🔒 Security Features

- JWT token-based authentication
- Secure token storage in localStorage
- Automatic token refresh mechanism
- Protected routes with authentication checks
- HTTPS ready (use HTTPS in production)
- Password input masking with toggle

## 🚧 Upcoming Features (Phase 7+)

- [ ] User registration page
- [ ] Password reset functionality
- [ ] Deals browsing interface
- [ ] Deal details page
- [ ] Favorites management
- [ ] User reviews and ratings
- [ ] User profile management
- [ ] Search and filter deals
- [ ] Business owner dashboard

## 📊 Development Progress

**Phase 5:** Backend API - ✅ Complete  
**Phase 6:** Frontend Authentication - ✅ Complete  
**Phase 7:** Registration & Deals Browsing - 🔄 In Progress

## 🤝 Contributing

This is an academic project for WSB University. Team members:

- **Jenefer Yago** 
- **Mahammad Rustamov** 
- **Rustam Islamov** 
- **Rustam Yariyev**
- **Sadig Shikhaliyev**

## 📄 License

This project is created for educational purposes as part of the Agile Project Management course at WSB University.

## 🔗 Related Repositories

- [SaveMate Backend](https://github.com/jenfranx30/savemate-backend) - FastAPI backend with MongoDB

## 📧 Contact

For questions or issues, please contact the development team through GitHub issues.
