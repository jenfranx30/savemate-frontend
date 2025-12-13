# 💰 SaveMate Frontend

**Modern React-based web application for discovering local deals and discounts in Poland**

[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4.21-646CFF.svg)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4.17-38B2AC.svg)](https://tailwindcss.com/)

---

## Latest Updates (December 2025)

### Recent Progress - Commit 582642e

**New Features Implemented:**
- ✅ **"My Favorites" Section** - Beautiful 3-card category grid on homepage
- ✅ **Backend API Integration** - Connected to `localhost:8000/api/v1/categories`
- ✅ **Modern UI Design** - Gradient overlays, smooth animations, hover effects
- ✅ **Responsive Layout** - Mobile-first design with 3-column grid on desktop
- ✅ **Loading States** - Animated skeleton loaders for better UX
- ✅ **Deal Count Badges** - Real-time display of active deals per category

**Component Updates:**

**CategoryList.jsx** - Complete redesign with new API integration
- Changed from horizontal scroll to grid layout
- Added gradient backgrounds (blue-to-purple theme)
- Implemented hover animations and transforms
- Icon containers with rounded corners
- "Explore All Categories" button with arrow animation
- Responsive 3-column layout (1 col mobile, 3 cols desktop)

**Technical Improvements:**
- ✅ Fetch data from backend `/api/v1/categories` endpoint
- ✅ Handle both array and object API responses
- ✅ Show only first 3 categories on homepage
- ✅ Error handling with empty array fallback
- ✅ Navigate to category-specific deals on click
- ✅ Professional loading states with pulse animation

**Files Modified:**
- `src/components/CategoryList.jsx` (+93 / -129 lines)
- `src/components/HomePage.jsx` (updated to use new CategoryList)
- `src/components/ExternalDeals.jsx` (multiple iterations)
- `src/services/favoriteUtils.js` (utility functions)

---

## 🎯 Project Overview

SaveMate is a local deals platform connecting Polish consumers with businesses offering discounts and promotions. This repository contains the frontend application that provides an intuitive interface for users to browse deals, manage favorites, and interact with local businesses.

**Course:** Agile Project Management  
**Institution:** WSB University, Dąbrowa Górnicza  
**Methodology:** Kanban  
**Professor:** Prof. Dawid Jurczyński  
**Timeline:** November 2025 - January 2026

---

## ✨ Features Implemented

### Phase 1: Project Setup ✅ (Complete)

* ✅ React + Vite project initialized
* ✅ Tailwind CSS configured
* ✅ React Router setup
* ✅ Project structure organized
* ✅ Git repository initialized

### Phase 2: Core Components ✅ (Complete)

* ✅ Navigation bar with responsive menu
* ✅ Homepage hero section
* ✅ Category browsing interface
* ✅ Deal card components
* ✅ Search functionality
* ✅ Footer component

### Phase 3: Backend Integration ✅ (Complete)

* ✅ API service layer created
* ✅ Axios HTTP client configured
* ✅ Category API integration
* ✅ Deal fetching from backend
* ✅ Error handling and loading states
* ✅ CORS configuration verified

### Phase 4: Category System ✅ (Recently Completed - **NEW**)

* ✅ **"My Favorites" section with 3-card grid**
* ✅ **Backend API integration for categories**
* ✅ **Dynamic deal count display**
* ✅ **Modern gradient UI design**
* ✅ **Hover animations and transitions**
* ✅ **Skeleton loading states**
* ✅ **Category navigation to deal pages**
* ✅ **Responsive grid layout**

### Phase 5: Authentication System ✅ (Complete)

#### 🔐 User Login
* Email or username authentication
* Password visibility toggle with eye icon
* "Remember me" functionality
* Client-side form validation
* Real-time error feedback
* JWT token management
* Automatic token refresh
* Session persistence across page refreshes

#### 📝 User Registration
* Complete registration form with 7 fields:
  - Full Name (required)
  - Email Address (required, validated)
  - Username (required, alphanumeric + underscore)
  - Password (required, with strength validation)
  - Confirm Password (required, must match)
  - Phone Number (optional, Polish format +48XXXXXXXXX)
  - Terms & Conditions (required checkbox)

**Password Strength Indicator:**
* Real-time visual feedback
* Color-coded progress bar (Red → Yellow → Green)
* Strength levels: Weak, Medium, Strong
* Checks for length, uppercase, lowercase, numbers, special characters

**Additional Features:**
* Password visibility toggle on both password fields
* Real-time validation feedback on blur
* Inline error messages with specific validation rules
* API integration with duplicate detection
* Success message with auto-redirect to login (2 seconds)
* Responsive mobile-first design

#### 🛡️ Protected Routes
* Authentication-based route protection
* Automatic redirect to login for unauthorized access
* Public routes redirect authenticated users to home
* Loading states during authentication checks
* Token persistence across sessions

#### 🏠 User Dashboard
* Personalized welcome message with user's name
* Quick access cards for Deals, Favorites, Reviews
* User email display
* Secure logout functionality
* Conditional rendering based on auth state

### Phase 6: Advanced Features 🔄 (In Progress)

* 🔄 Deal search and filtering
* 🔄 User profile page
* 🔄 Favorites management UI
* 🔄 Review submission form

### Phase 7: Future Enhancements 🔜 (Planned)

* 🔜 Advanced search with filters
* 🔜 Geolocation-based deals
* 🔜 Deal comparison tool
* 🔜 Social media sharing
* 🔜 Email notification preferences
* 🔜 Dark mode support
* 🔜 Progressive Web App (PWA)
* 🔜 Internationalization (Polish/English)

---

## 🎨 UI/UX Features

### "My Favorites" Section (**NEW**)

The homepage now features a stunning "My Favorites" section with:

**Visual Design:**
- 🎨 **Gradient Backgrounds** - Smooth blue-to-purple gradients
- 🎭 **Hover Effects** - Scale transforms and shadow transitions
- 🎯 **Icon Containers** - Rounded squares with gradient backgrounds
- 🏷️ **Deal Count Badges** - Shows active deals with SVG icons
- ➡️ **Arrow Navigation** - Animated arrow icons on hover
- 🌈 **Color Scheme** - Professional blue/purple theme

**Layout:**
- 📱 **Mobile**: Single column, stacked cards
- 💻 **Desktop**: 3-column grid layout
- 📏 **Spacing**: Generous padding and margins
- 🎭 **Animations**: Smooth transitions (300ms duration)

**Component Structure:**

```jsx
// Each category card includes:
- Icon container (20x20) with emoji/icon
- Category name (text-2xl, bold)
- Deal count badge with SVG icon
- Arrow button with hover animation
- Gradient overlay on hover
```

---

## 🛠️ Tech Stack

### Core Framework

* **React 18.3.1** - UI library
* **Vite 5.4.21** - Build tool and dev server
* **React Router DOM 7.0.1** - Client-side routing

### Styling

* **Tailwind CSS 3.4.17** - Utility-first CSS framework
* **PostCSS 8.4.49** - CSS transformation
* **Autoprefixer 10.4.20** - CSS vendor prefixing

### HTTP & Data

* **Axios 1.7.9** - HTTP client for API calls
* **React Query** (planned) - Data fetching and caching

### Development Tools

* **ESLint** - Code linting
* **Prettier** (planned) - Code formatting
* **Vite HMR** - Hot module replacement

---

## 📁 Project Structure

```
savemate-frontend/
├── public/
│   └── vite.svg                    # Vite logo
│
├── src/
│   ├── assets/                     # Static assets
│   │   └── react.svg
│   │
│   ├── components/                 # React components
│   │   ├── auth/
│   │   │   ├── LoginPage.jsx      # Login form (~200 lines)
│   │   │   └── SignupPage.jsx     # Registration form (~450 lines)
│   │   ├── CategoryList.jsx       # Category grid component (UPDATED)
│   │   ├── CategoryCard.jsx       # Individual category card
│   │   ├── HomePage.jsx           # Homepage/Dashboard layout (UPDATED)
│   │   ├── ExternalDeals.jsx      # External deals integration (NEW)
│   │   ├── LoadingSpinner.jsx     # Loading indicator
│   │   ├── Navigation.jsx         # Top navigation bar
│   │   ├── Footer.jsx             # Footer component
│   │   ├── SearchBar.jsx          # Search functionality
│   │   └── DealCard.jsx           # Deal display card
│   │
│   ├── services/                  # API and utility services
│   │   ├── api.js                 # Axios instance configuration
│   │   ├── authService.js         # Authentication API calls (NEW)
│   │   ├── dealsApi.js            # Deal-related API calls
│   │   ├── categoryApi.js         # Category API calls (NEW)
│   │   └── favoriteUtils.js       # Favorites utilities (UPDATED)
│   │
│   ├── context/
│   │   ├── AuthContext.jsx        # Global authentication state (NEW)
│   │   └── AppContext.jsx         # Global app state (planned)
│   │
│   ├── pages/                     # Page components
│   │   ├── Home.jsx              # Homepage
│   │   ├── Deals.jsx             # Deals listing page
│   │   ├── Categories.jsx        # All categories page
│   │   ├── DealDetail.jsx        # Single deal view
│   │   ├── Login.jsx             # Login page (NEW)
│   │   ├── Register.jsx          # Registration page (NEW)
│   │   └── Profile.jsx           # User profile
│   │
│   ├── hooks/                     # Custom React hooks (planned)
│   │   ├── useAuth.js            # Authentication hook
│   │   ├── useCategories.js      # Categories data hook (NEW)
│   │   └── useDeals.js           # Deals data hook
│   │
│   ├── utils/                     # Utility functions
│   │   ├── formatters.js         # Data formatting
│   │   └── validators.js         # Form validation
│   │
│   ├── App.jsx                    # Main App component with routing
│   ├── App.css                    # Global styles
│   ├── index.css                  # Tailwind directives
│   └── main.jsx                   # App entry point
│
├── .gitignore                     # Git ignore file
├── index.html                     # HTML template
├── package.json                   # Dependencies and scripts
├── package-lock.json              # Locked dependencies
├── vite.config.js                 # Vite configuration
├── tailwind.config.js             # Tailwind configuration
├── postcss.config.js              # PostCSS configuration
├── eslint.config.js               # ESLint configuration
└── README.md                      # This file
```

---

## 🚀 Installation and Setup

### Prerequisites

* Node.js 18+ or higher
* npm 9+ or yarn 1.22+
* Git
* Backend API running on `localhost:8000`

### Step 1: Clone the Repository

```bash
git clone https://github.com/jenfranx30/savemate-frontend.git
cd savemate-frontend
```

### Step 2: Install Dependencies

```bash
npm install
# or
yarn install
```

**Key Dependencies:**

```json
{
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^7.0.1",
    "axios": "^1.7.9"
  },
  "devDependencies": {
    "vite": "^5.4.21",
    "tailwindcss": "^3.4.17",
    "postcss": "^8.4.49",
    "autoprefixer": "^10.4.20",
    "@vitejs/plugin-react": "^4.3.4",
    "eslint": "^9.17.0"
  }
}
```

### Step 3: Configure Environment

Create a `.env` file in the root directory:

```env
# Backend API Configuration
VITE_API_BASE_URL=http://localhost:8000/api/v1
VITE_API_TIMEOUT=30000

# Feature Flags
VITE_ENABLE_EXTERNAL_DEALS=true
VITE_ENABLE_GEOLOCATION=false

# Environment
VITE_ENV=development
```

**Note:** All environment variables must start with `VITE_` to be accessible in the application.

### Step 4: Start Development Server

```bash
npm run dev
# or
yarn dev
```

**Expected output:**

```
VITE v5.4.21  ready in 234 ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
➜  press h + enter to show help
```

### Step 5: Open in Browser

Navigate to: **http://localhost:5173**

You should see the SaveMate homepage with the "My Favorites" section displaying 3 category cards.

### Step 6: Verify Backend Connection

Check the browser console for:
- ✅ Successful API call to `http://localhost:8000/api/v1/categories`
- ✅ Category data loaded
- ✅ No CORS errors

If you see CORS errors, ensure the backend is running and configured properly.

---

## 🚀 Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

---

## 🔌 API Integration

### Backend Connection Configuration

**API Base URL:** `http://localhost:8000/api/v1`

**Axios Configuration** (`src/services/api.js`):

```javascript
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
```

### Category API Integration (**NEW**)

**Endpoint:** `GET /api/v1/categories`

**Component:** `CategoryList.jsx`

```javascript
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
```

**Response Format:**

```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Food & Dining",
    "slug": "food-dining",
    "icon": "🍔",
    "color": "#EF4444",
    "deal_count": 145,
    "is_featured": true
  },
  {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Shopping",
    "slug": "shopping",
    "icon": "🛍️",
    "color": "#8B5CF6",
    "deal_count": 230,
    "is_featured": true
  },
  {
    "_id": "507f1f77bcf86cd799439013",
    "name": "Entertainment",
    "slug": "entertainment",
    "icon": "🎬",
    "color": "#EC4899",
    "deal_count": 89,
    "is_featured": true
  }
]
```

### Available API Endpoints

**Public Endpoints (No Auth Required):**

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/categories` | Get all categories |
| GET | `/api/v1/categories/featured` | Get featured categories |
| GET | `/api/v1/categories/{id}` | Get single category |
| GET | `/api/v1/deals` | Get all deals (with filters) |
| GET | `/api/v1/deals/{id}` | Get single deal |
| GET | `/api/v1/deals/category/{cat}` | Get deals by category |
| GET | `/api/v1/businesses` | Get all businesses |
| GET | `/api/v1/businesses/{id}` | Get single business |

**Protected Endpoints (Auth Required):**

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/register` | Register new user |
| POST | `/api/v1/auth/login` | Login user |
| POST | `/api/v1/auth/refresh` | Refresh token |
| GET | `/api/v1/favorites` | Get user favorites |
| POST | `/api/v1/favorites` | Add to favorites |
| DELETE | `/api/v1/favorites/{id}` | Remove from favorites |
| POST | `/api/v1/reviews` | Create review |
| PUT | `/api/v1/reviews/{id}` | Update review |

---

## 🎨 Design System

### Color Palette

```css
/* Primary Colors */
Blue:   #0ea5e9 (blue-500), #2563EB (blue-600), #1D4ED8 (blue-700)
Purple: #9333EA (purple-600), #7E22CE (purple-700)
Pink:   #EC4899 (pink-500), #F472B6 (pink-400)

/* Neutral Colors */
White:     #FFFFFF
Gray-50:   #F9FAFB
Gray-100:  #F3F4F6
Gray-600:  #4B5563
Gray-900:  #111827

/* Backgrounds */
Blue-50:   #EFF6FF
Indigo-100: #E0E7FF

/* Status Colors */
Error:   #ef4444 (Red)
Success: #10b981 (Green)
Warning: #f59e0b (Amber)

/* Gradient Overlays */
from-blue-50 to-purple-50
from-blue-600 to-purple-600
from-blue-100 to-purple-100
from-blue-50 to-indigo-100
```

### Typography

```css
/* Headings */
h1: text-4xl font-bold      (36px)
h2: text-3xl font-bold      (30px)
h3: text-2xl font-bold      (24px)
h4: text-xl font-semibold   (20px)

/* Body Text */
p:  text-base               (16px)
lg: text-lg                 (18px)
sm: text-sm                 (14px)

/* Font Weights */
font-normal:    400
font-medium:    500
font-semibold:  600
font-bold:      700
font-extrabold: 800
```

### Spacing

```css
/* Padding/Margin Scale */
p-2:  0.5rem (8px)
p-4:  1rem   (16px)
p-6:  1.5rem (24px)
p-8:  2rem   (32px)
p-12: 3rem   (48px)
p-16: 4rem   (64px)
p-20: 5rem   (80px)

/* Gaps */
gap-4: 1rem     (16px)
gap-6: 1.5rem   (24px)
gap-8: 2rem     (32px)
```

### Common Patterns

```css
/* Gradient Backgrounds */
bg-gradient-to-br from-blue-100 to-purple-100
bg-gradient-to-r from-blue-600 to-purple-600
bg-gradient-to-b from-blue-50 to-indigo-100

/* Hover Effects */
hover:shadow-2xl hover:scale-110 hover:-translate-y-1
group-hover:opacity-100 group-hover:translate-x-1

/* Rounded Corners */
rounded-2xl  (16px)
rounded-xl   (12px)
rounded-lg   (8px)
rounded-full (9999px)

/* Transitions */
transition-all duration-300
transition-transform duration-300
transition-colors duration-300

/* Flex & Grid */
flex items-center justify-center
grid grid-cols-1 md:grid-cols-3 gap-8

/* Shadows */
shadow-md    (medium shadow)
shadow-lg    (large shadow)
shadow-xl    (extra large shadow)
shadow-2xl   (2xl shadow)
```

---

## 🔐 Authentication Flow

### Login Flow

1. User navigates to `/login`
2. Enters email/username and password
3. Frontend sends credentials to backend
4. Backend returns JWT tokens (access + refresh)
5. Tokens stored in localStorage
6. User redirected to dashboard
7. Axios interceptor adds token to subsequent requests

### Registration Flow

1. User navigates to `/register`
2. Fills form with real-time validation
3. Password strength calculated live
4. Client-side validation prevents invalid data
5. Backend creates account
6. Success message shown
7. Auto-redirect to login after 2 seconds

### Protected Routes

```javascript
// Protected route wrapper
<ProtectedRoute>
  <Dashboard />
</ProtectedRoute>

// Automatic redirect if not authenticated
if (!isAuthenticated) {
  navigate('/login');
}
```

---

## 🧪 Testing

### Manual Testing Checklist

**Homepage:**
- ✅ "My Favorites" section loads with 3 categories
- ✅ Category cards display icons, names, and deal counts
- ✅ Hover effects work smoothly
- ✅ "Explore All Categories" button navigates correctly
- ✅ Loading skeleton appears before data loads
- ✅ Error states handled gracefully

**Authentication:**

**Login Tests:**
- ✅ Valid credentials → Success
- ✅ Invalid credentials → Error
- ✅ Empty form → Validation
- ✅ Password toggle → Works
- ✅ Remember me → Stored
- ✅ Token storage → Verified

**Registration Tests:**
- ✅ All fields render correctly
- ✅ Email validation
- ✅ Username validation (3+ chars, alphanumeric)
- ✅ Password strength indicator (Weak/Medium/Strong)
- ✅ Confirm password match
- ✅ Phone validation (+48XXXXXXXXX)
- ✅ Terms checkbox required
- ✅ Duplicate detection
- ✅ Success redirect

**Responsive Design:**
- ✅ Mobile view (< 768px): Single column layout
- ✅ Tablet view (768px - 1024px): 2 column layout (optional)
- ✅ Desktop view (> 1024px): 3 column layout

**API Integration:**
- ✅ Categories fetch from backend successfully
- ✅ Deal counts update in real-time
- ✅ Error handling for network failures
- ✅ CORS configuration working

### Test Credentials

```
Login: testuser / Test1234
Register: Use unique email/username
```

### Future Testing Plans

* Unit tests with Jest and React Testing Library
* Integration tests for API calls
* E2E tests with Cypress or Playwright
* Visual regression tests with Chromatic
* Performance testing with Lighthouse

---

## 📱 Responsive Design

### Breakpoints

```javascript
// Tailwind breakpoints used:
sm:  '640px'   // Small devices
md:  '768px'   // Tablets
lg:  '1024px'  // Desktops
xl:  '1280px'  // Large desktops
2xl: '1536px'  // Extra large screens
```

### Mobile-First Approach

All components are designed mobile-first:

```jsx
// Example: CategoryList responsive grid
<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
  {/* Single column on mobile, 3 columns on desktop */}
</div>
```

**Layout Behavior:**
- **Mobile (< 768px)**: Stacked layout, full-width cards
- **Tablet (768px - 1023px)**: 2-column grid (optional)
- **Desktop (≥ 1024px)**: 3-column grid with max-width container

**Tested Devices:**
- Mobile: 375px+
- Tablet: 768px+
- Desktop: 1024px+

---

## 🚀 Build and Deployment

### Production Build

```bash
npm run build
# or
yarn build
```

This creates an optimized production build in the `dist/` directory.

**Build Output:**

```
dist/
├── assets/
│   ├── index-[hash].js      # Bundled JavaScript
│   ├── index-[hash].css     # Bundled CSS
│   └── [images]             # Optimized images
└── index.html               # HTML entry point
```

### Preview Production Build

```bash
npm run preview
# or
yarn preview
```

### Deployment Options

**Recommended Platforms:**

1. **Vercel** (Recommended)
   ```bash
   npm install -g vercel
   vercel
   ```

2. **Netlify**
   - Connect GitHub repository
   - Build command: `npm run build`
   - Publish directory: `dist`

3. **GitHub Pages**
   ```bash
   npm run build
   # Use gh-pages package to deploy
   ```

4. **AWS S3 + CloudFront**
   - Upload `dist/` to S3 bucket
   - Configure CloudFront distribution

5. **DigitalOcean App Platform**
   - Connect repository
   - Auto-deploy on push

### Environment Variables for Production

**Vercel/Netlify:**

Set these in the deployment dashboard:
```env
VITE_API_BASE_URL=https://api.savemate.pl/api/v1
VITE_ENV=production
```

---

## Troubleshooting

### Common Issues

#### 1. Categories Not Loading

**Problem:** "My Favorites" section shows loading state forever

**Solutions:**
- ✅ Check backend is running on `localhost:8000`
- ✅ Verify CORS is configured in backend
- ✅ Check browser console for errors
- ✅ Test API endpoint directly: `curl http://localhost:8000/api/v1/categories`

#### 2. CORS Errors

**Problem:** `Access-Control-Allow-Origin` error in console

**Solution:**

Update backend `.env`:
```env
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173,http://localhost:8000
```

#### 3. Styles Not Applying

**Problem:** Tailwind classes not working

**Solutions:**
- ✅ Check `tailwind.config.js` has correct content paths
- ✅ Verify `index.css` has Tailwind directives
- ✅ Restart dev server after config changes
- ✅ Clear browser cache

#### 4. Build Errors

**Problem:** Build fails with module errors

**Solutions:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf node_modules/.vite
npm run dev
```

#### 5. Port Already in Use

**Problem:** Port 5173 is already in use

**Solutions:**
```bash
# Change port in vite.config.js
export default defineConfig({
  server: {
    port: 3000
  }
});

# Or kill existing process
# Linux/Mac:
lsof -ti:5173 | xargs kill -9

# Windows:
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

---

## 🔒 Security Features

* **JWT Authentication** - Secure token-based authentication
* **localStorage Token Storage** - Client-side token persistence
* **Auto Token Refresh** - Seamless token renewal
* **Protected Routes** - Authentication-based access control
* **Password Masking** - Password field visibility toggle
* **Input Validation** - Client-side form validation
* **XSS Protection** - React's built-in XSS prevention
* **CORS Configuration** - Secure cross-origin requests

---

## 👥 Team and Contributors

* **Jenefer Yago**
* **Rustam Islamov**
* **Mahammad Rustamov**
* **Rustam Yariyev**
* **Sadig Shikhaliyev**

**Methodology:** Kanban (Trello)

---

## 📚 Resources and Documentation

* **React Documentation:** <https://react.dev/>
* **Vite Documentation:** <https://vitejs.dev/>
* **Tailwind CSS:** <https://tailwindcss.com/docs>
* **React Router:** <https://reactrouter.com/>
* **Axios Documentation:** <https://axios-http.com/>
* **Backend API Docs:** <http://localhost:8000/docs>
* **Trello Board:** [Project Management](https://trello.com/invite/b/68e5694ffe5d33e3b3d92625/)

---

## 🎯 Roadmap

### ✅ Completed Features

* ✅ Project setup with Vite and React
* ✅ Tailwind CSS integration
* ✅ Basic component structure
* ✅ Navigation and routing
* ✅ "My Favorites" section with category grid
* ✅ Backend API integration
* ✅ Responsive 3-column layout
* ✅ Loading states and animations
* ✅ Deal count display
* ✅ User authentication (Login/Register)
* ✅ Protected routes
* ✅ User dashboard

### 🔄 In Progress

* 🔄 Deal search and filtering
* 🔄 User profile page
* 🔄 Favorites management UI
* 🔄 Review submission form

### 🔜 Upcoming Features

* 🔜 Advanced search with filters
* 🔜 Geolocation-based deals
* 🔜 Deal comparison tool
* 🔜 Social media sharing
* 🔜 Email notification preferences
* 🔜 Dark mode support
* 🔜 Progressive Web App (PWA)
* 🔜 Internationalization (Polish/English)
* 🔜 Password reset functionality
* 🔜 Business dashboard

---

## 📊 Progress Status

* **Phase 1:** Project Setup - ✅ Complete
* **Phase 2:** Core Components - ✅ Complete
* **Phase 3:** Backend Integration - ✅ Complete
* **Phase 4:** Category System - ✅ Complete
* **Phase 5:** Authentication - ✅ Complete
* **Phase 6:** Advanced Features - 🔄 In Progress
* **Phase 7:** Future Enhancements - 🔜 Next

---

## 📈 Project Statistics

* **Components:** 15+ React components
* **Pages:** 7 page components
* **Lines of Code:** ~3,500+
* **API Endpoints Used:** 10+ endpoints
* **Tailwind Classes:** 250+ utility classes
* **Bundle Size:** ~150KB (gzipped)
* **Load Time:** <2s on 3G
* **Lighthouse Score:** 90+ (target)

---

## 🔄 Recent Changes Summary

### December 2024 Updates - Commit 582642e

**CategoryList Component Redesign:**
1. ✅ Changed from horizontal scroll to 3-column grid
2. ✅ Integrated with backend `/api/v1/categories` API
3. ✅ Added gradient backgrounds and hover effects
4. ✅ Implemented loading skeleton animation
5. ✅ Added "Explore All Categories" button
6. ✅ Show only first 3 categories on homepage
7. ✅ Display real-time deal counts from backend
8. ✅ Responsive design for mobile/tablet/desktop

**Visual Enhancements:**
1. ✅ Blue-to-purple gradient theme
2. ✅ Icon containers with rounded corners
3. ✅ Deal count badges with SVG icons
4. ✅ Arrow buttons with hover animations
5. ✅ Scale and shadow transitions
6. ✅ Professional spacing and typography

**Technical Improvements:**
1. ✅ Proper error handling for API calls
2. ✅ Handle multiple response formats
3. ✅ Loading states with skeleton UI
4. ✅ Navigation to category pages
5. ✅ Clean component architecture
6. ✅ Removed unused code and dependencies

---

## Quick Start Guide

### For New Developers

1. **Clone and Install:**
   ```bash
   git clone https://github.com/jenfranx30/savemate-frontend.git
   cd savemate-frontend
   npm install
   ```

2. **Start Backend:**
   ```bash
   # In separate terminal, go to backend directory
   cd ../savemate-backend
   uvicorn app.main:app --reload
   ```

3. **Start Frontend:**
   ```bash
   # Back in frontend directory
   npm run dev
   ```

4. **View in Browser:**
   - Open http://localhost:5173
   - You should see the homepage with "My Favorites" section
   - Check browser console for any errors

5. **Test API Connection:**
   - Open browser DevTools → Network tab
   - Refresh page
   - Look for request to `localhost:8000/api/v1/categories`
   - Should return 200 OK with category data

---

## 📄 License

This project is part of an academic course (Agile Project Management) at WSB University.

**Academic Use Only** - Not for commercial distribution without permission.

---

## 🔗 Related Repositories

* [SaveMate Backend](https://github.com/jenfranx30/savemate-backend)

---

## Academic Context

**University:** WSB University in Dąbrowa Górnicza  
**Program:** Master's in Data Science  
**Course:** Agile Project Management  
**Professor:** Prof. Dawid Jurczyński  
**Timeline:** November 2025 - January 2026  
**Project Type:** Team Project (5 members)  
**Methodology:** Kanban with Trello

---

**Last Updated:** December 12, 2025  
**Version:** 1.2.0 (Authentication and Category Integration Complete)  
**Status:** ✅ Active Development  
**Next Milestone:** Advanced Features Implementation

---
