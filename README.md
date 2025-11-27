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

## 🤝 Team

- **Jenefer Yago**
- **Rustam Islamov**
- **Mahammad Rustamov**
- **Rustam Yariyev**
- **Sadig Shikhaliyev**

## 🔗 Related

- [SaveMate Backend](https://github.com/jenfranx30/savemate-backend)

---

**Built with ❤️ using React + Vite + Tailwind CSS**
