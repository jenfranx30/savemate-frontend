# 💰 SaveMate Frontend

A modern React-based web application for discovering and managing local deals and discounts in Poland. Built with React, Vite, and Tailwind CSS.

## 🎯 Project Overview

SaveMate is a local deals platform connecting Polish consumers with businesses offering discounts and promotions. This repository contains the frontend application that provides an intuitive interface for users to browse deals, manage favorites, and interact with local businesses.

**Course:** Agile Project Management  
**Institution:** WSB University, Dąbrowa Górnicza  
**Methodology:** Kanban  
**Professor:** Dawid Jurczyński

## ✨ Features Implemented

### Phase 6 - Authentication System (Complete)

#### 🔐 User Login
- Email or username authentication
- Password visibility toggle with eye icon
- "Remember me" functionality
- Client-side form validation
- Real-time error feedback
- JWT token management
- Automatic token refresh
- Session persistence across page refreshes

#### 📝 User Registration
- Complete registration form with 7 fields:
  - Full Name (required)
  - Email Address (required, validated)
  - Username (required, alphanumeric + underscore)
  - Password (required, with strength validation)
  - Confirm Password (required, must match)
  - Phone Number (optional, Polish format +48XXXXXXXXX)
  - Terms & Conditions (required checkbox)
- **Password Strength Indicator:**
  - Real-time visual feedback
  - Color-coded progress bar (Red → Yellow → Green)
  - Strength levels: Weak, Medium, Strong
  - Checks for length, uppercase, lowercase, numbers, special characters
- Password visibility toggle on both password fields
- Real-time validation feedback on blur
- Inline error messages with specific validation rules
- API integration with duplicate detection
- Success message with auto-redirect to login (2 seconds)
- Responsive mobile-first design

#### 🛡️ Protected Routes
- Authentication-based route protection
- Automatic redirect to login for unauthorized access
- Public routes redirect authenticated users to home
- Loading states during authentication checks
- Token persistence across sessions

#### 🏠 User Dashboard
- Personalized welcome message with user's name
- Quick access cards for Deals, Favorites, Reviews
- User email display
- Secure logout functionality
- Conditional rendering based on auth state

## 🛠️ Tech Stack

- **Framework:** React 18.2.0
- **Build Tool:** Vite 5.4.21
- **Styling:** Tailwind CSS 3.3.6
- **Routing:** React Router DOM 6.20.1
- **HTTP Client:** Axios 1.6.2
- **State Management:** React Context API
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

3. **Run development server:**
   ```bash
   npm run dev
   ```

4. **Open in browser:**
   ```
   http://localhost:5173
   ```

## 🚀 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 📁 Project Structure

```
savemate-frontend/
├── src/
│   ├── components/
│   │   ├── auth/
│   │   │   ├── LoginPage.jsx        # Login form (~200 lines)
│   │   │   └── SignupPage.jsx       # Registration form (~450 lines)
│   │   └── HomePage.jsx             # Dashboard (~100 lines)
│   ├── context/
│   │   └── AuthContext.jsx          # Global authentication state
│   ├── services/
│   │   └── authService.js           # API calls and token management
│   ├── App.jsx                      # Main app with routing
│   ├── index.css                    # Tailwind CSS imports
│   └── main.jsx                     # React entry point
├── public/                          # Static assets
├── index.html                       # HTML template
├── package.json                     # Dependencies
├── postcss.config.js                # PostCSS configuration
├── tailwind.config.js               # Tailwind configuration
└── vite.config.js                   # Vite configuration
```

## 🔐 Authentication Flow

### Login Flow
1. User navigates to `/login`
2. Enters email/username and password
3. Frontend sends credentials to backend
4. Backend returns JWT tokens
5. Tokens stored in localStorage
6. User redirected to dashboard
7. Axios interceptor adds token to requests

### Registration Flow
1. User navigates to `/register`
2. Fills form with real-time validation
3. Password strength calculated live
4. Client-side validation prevents invalid data
5. Backend creates account
6. Success message shown
7. Auto-redirect to login after 2 seconds

## 🎨 Design System

### Colors
- **Primary:** #0ea5e9 (Blue shades 50-900)
- **Background:** Gradient Blue-50 to Indigo-100
- **Error:** #ef4444 (Red)
- **Success:** #10b981 (Green)
- **Password Strength:** Red/Yellow/Green

### Typography
- System font stack with antialiasing
- Responsive sizing (3xl → sm)
- Medium to extrabold weights

## 🔌 API Integration

**Base URL:** `http://localhost:8000/api/v1`

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/login` | User login |
| POST | `/auth/register` | User registration |
| POST | `/auth/refresh` | Refresh token |

## 🧪 Testing

### Login Tests
- [x] Valid credentials → Success
- [x] Invalid credentials → Error
- [x] Empty form → Validation
- [x] Password toggle → Works
- [x] Remember me → Stored
- [x] Token storage → Verified
- [x] Mobile responsive → Tested

### Registration Tests
- [x] All fields render correctly
- [x] Email validation
- [x] Username validation (3+ chars, alphanumeric)
- [x] Password strength indicator (Weak/Medium/Strong)
- [x] Confirm password match
- [x] Phone validation (+48XXXXXXXXX)
- [x] Terms checkbox required
- [x] Duplicate detection
- [x] Success redirect
- [x] Mobile responsive

### Test Credentials
```
Login: testuser / Test1234
Register: Use unique email/username
```

## 📱 Responsive Design

Tested on:
- Mobile: 375px+
- Tablet: 768px+
- Desktop: 1024px+

## 🔒 Security

- JWT authentication
- localStorage token storage
- Auto token refresh
- Protected routes
- Password masking
- Input validation
- XSS protection

## 🚧 Upcoming Features

- [ ] Deals browsing interface
- [ ] Search and filters
- [ ] Deal details page
- [ ] Favorites system
- [ ] User reviews
- [ ] Profile management
- [ ] Password reset
- [ ] Business dashboard

## 📊 Progress

**Phase 5:** Backend - ✅ Complete  
**Phase 6:** Authentication - ✅ Complete  
**Phase 7:** Deals Browsing - 🔄 Next

## 🚀 Latest Updates (December 2024)
Recent Progress - Commit 582642e ✨
New Features Implemented:

✅ "My Favorites" Section - Beautiful 3-card category grid on homepage
✅ Backend API Integration - Connected to localhost:8000/api/v1/categories
✅ Modern UI Design - Gradient overlays, smooth animations, hover effects
✅ Responsive Layout - Mobile-first design with 3-column grid on desktop
✅ Loading States - Animated skeleton loaders for better UX
✅ Deal Count Badges - Real-time display of active deals per category

## Component Updates:

CategoryList.jsx - Complete redesign with new API integration

Changed from horizontal scroll to grid layout
Added gradient backgrounds (blue-to-purple theme)
Implemented hover animations and transforms
Icon containers with rounded corners
"Explore All Categories" button with arrow animation
Responsive 3-column layout (1 col mobile, 3 cols desktop)



## Technical Improvements:

✅ Fetch data from backend /api/v1/categories endpoint
✅ Handle both array and object API responses
✅ Show only first 3 categories on homepage
✅ Error handling with empty array fallback
✅ Navigate to category-specific deals on click
✅ Professional loading states with pulse animation

## Files Modified:

src/components/CategoryList.jsx (+93 / -129 lines)
src/components/HomePage.jsx (updated to use new CategoryList)
src/components/ExternalDeals.jsx (multiple iterations)
src/services/favoriteUtils.js (utility functions)


## 🎨 UI/UX Features
"My Favorites" Section (NEW)
The homepage now features a stunning "My Favorites" section with:
Visual Design:

🎨 Gradient Backgrounds - Smooth blue-to-purple gradients
🎭 Hover Effects - Scale transforms and shadow transitions
🎯 Icon Containers - Rounded squares with gradient backgrounds
🏷️ Deal Count Badges - Shows active deals with SVG icons
➡️ Arrow Navigation - Animated arrow icons on hover
🌈 Color Scheme - Professional blue/purple theme


## Component Architecture
HomePage.jsx:

Hero section with search
CategoryList component (3 featured categories)
Featured deals section
Call-to-action sections

## CategoryList.jsx:

Fetches from /api/v1/categories API
Displays first 3 categories
Loading skeleton animation
Error handling with empty state
"Explore All Categories" button
Navigation to category-specific pages

## ExternalDeals.jsx:

Integration with external deal sources
Multiple iterations showing development progress
Deal aggregation from RSS feeds


## 🛠️ Tech Stack
## Core Framework

React 18.3.1 - UI library
Vite 5.4.11 - Build tool and dev server
React Router DOM 7.0.1 - Client-side routing

## Styling

Tailwind CSS 3.4.17 - Utility-first CSS framework
PostCSS 8.4.49 - CSS transformation
Autoprefixer 10.4.20 - CSS vendor prefixing

## HTTP and Data

Axios 1.7.9 - HTTP client for API calls
React Query (planned) - Data fetching and caching

## Development Tools

ESLint - Code linting
Prettier (planned) - Code formatting
Vite HMR - Hot module replacement


## 📁 Project Structure

savemate-frontend/
├── public/
│   └── vite.svg                    # Vite logo
│
├── src/
│   ├── assets/                     # Static assets
│   │   └── react.svg
│   │
│   ├── components/                 # React components
│   │   ├── CategoryList.jsx        # Category grid component (UPDATED)
│   │   ├── CategoryCard.jsx        # Individual category card
│   │   ├── HomePage.jsx            # Homepage layout (UPDATED)
│   │   ├── ExternalDeals.jsx       # External deals integration (NEW)
│   │   ├── LoadingSpinner.jsx      # Loading indicator
│   │   ├── Navigation.jsx          # Top navigation bar
│   │   ├── Footer.jsx              # Footer component
│   │   ├── SearchBar.jsx           # Search functionality
│   │   └── DealCard.jsx            # Deal display card
│   │
│   ├── services/                   # API and utility services
│   │   ├── api.js                  # Axios instance configuration
│   │   ├── dealsApi.js             # Deal-related API calls
│   │   ├── categoryApi.js          # Category API calls (NEW)
│   │   └── favoriteUtils.js        # Favorites utilities (UPDATED)
│   │
│   ├── pages/                      # Page components
│   │   ├── Home.jsx               # Homepage
│   │   ├── Deals.jsx              # Deals listing page
│   │   ├── Categories.jsx         # All categories page
│   │   ├── DealDetail.jsx         # Single deal view
│   │   ├── Login.jsx              # Login page
│   │   ├── Register.jsx           # Registration page
│   │   └── Profile.jsx            # User profile
│   │
│   ├── hooks/                      # Custom React hooks (planned)
│   │   ├── useAuth.js             # Authentication hook
│   │   ├── useCategories.js       # Categories data hook (NEW)
│   │   └── useDeals.js            # Deals data hook
│   │
│   ├── context/                    # React Context providers (planned)
│   │   ├── AuthContext.jsx        # Authentication context
│   │   └── AppContext.jsx         # Global app state
│   │
│   ├── utils/                      # Utility functions
│   │   ├── formatters.js          # Data formatting
│   │   └── validators.js          # Form validation
│   │
│   ├── App.jsx                     # Main App component
│   ├── App.css                     # Global styles
│   ├── index.css                   # Tailwind directives
│   └── main.jsx                    # App entry point
│
├── .gitignore                      # Git ignore file
├── index.html                      # HTML template
├── package.json                    # Dependencies and scripts
├── package-lock.json               # Locked dependencies
├── vite.config.js                  # Vite configuration
├── tailwind.config.js              # Tailwind configuration
├── postcss.config.js               # PostCSS configuration
├── eslint.config.js                # ESLint configuration
└── README.md                       # This file (UPDATED)

## 🚀 Installation and Setup
Prerequisites

Node.js 18+ or higher
npm 9+ or yarn 1.22+
Git
Backend API running on localhost:8000

## Step 1: Clone the Repository
git clone https://github.com/jenfranx30/savemate-frontend.git
cd savemate-frontend

## Step 2: Install Dependencies
npm install
# or
yarn install

## Key Dependencies Installed:
{
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^7.0.1",
    "axios": "^1.7.9"
  },
  "devDependencies": {
    "vite": "^5.4.11",
    "tailwindcss": "^3.4.17",
    "postcss": "^8.4.49",
    "autoprefixer": "^10.4.20",
    "@vitejs/plugin-react": "^4.3.4",
    "eslint": "^9.17.0"
  }
}


## Step 3: Configure Environment
Create a .env file in the root directory:

# Backend API Configuration
VITE_API_BASE_URL=http://localhost:8000/api/v1
VITE_API_TIMEOUT=30000

# Feature Flags
VITE_ENABLE_EXTERNAL_DEALS=true
VITE_ENABLE_GEOLOCATION=false

# Environment
VITE_ENV=development

Note: All environment variables must start with VITE_ to be accessible in the application.

## Step 4: Start Development Server

npm run dev
# or
yarn dev

## Expected output:

VITE v5.4.11  ready in 234 ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
➜  press h + enter to show help

## Step 5: Open in Browser
Navigate to: http://localhost:5173

## Step 6: Verify Backend Connection
Check the browser console for:

✅ Successful API call to http://localhost:8000/api/v1/categories
✅ Category data loaded
✅ No CORS errors

If you see CORS errors, ensure the backend is running and configured properly.

## 🔌 API Integration
Backend Connection Configuration
API Base URL: http://localhost:8000/api/v1
Axios Configuration (src/services/api.js):

import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for auth tokens
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle token expiration
      localStorage.removeItem('access_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;


## Category API Integration (NEW)
Endpoint: GET /api/v1/categories
Component: CategoryList.jsx

const fetchCategories = async () => {
  try {
    const response = await fetch('http://localhost:8000/api/v1/categories');
    const data = await response.json();
    // Handle both array and object responses
    const categoriesArray = Array.isArray(data) ? data : (data.categories || []);
    // Show only first 3 categories on homepage
    setCategories(categoriesArray.slice(0, 3));
  } catch (error) {
    console.error('Error fetching categories:', error);
    setCategories([]); // Set empty array on error
  } finally {
    setLoading(false);
  }
};



## 🔄 In Progress

User authentication UI
Deal search and filtering
User profile page
Favorites management UI
Review submission form

## 🔜 Upcoming Features

Advanced search with filters
Geolocation-based deals
Deal comparison tool
Social media sharing
Email notification preferences
Dark mode support
Progressive Web App (PWA)
Internationalization (Polish/English)



## 🤝 Team

- **Jenefer Yago**
- **Rustam Islamov**
- **Mahammad Rustamov**
- **Rustam Yariyev**
- **Sadig Shikhaliyev**

## 🔗 Related

- [SaveMate Backend](https://github.com/jenfranx30/savemate-backend)

---

## 📄 License
This project is part of an academic course (Agile Project Management) at WSB University.
Academic Use Only - Not for commercial distribution without permission.
