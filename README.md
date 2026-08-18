# 🚀 IntelliRank – AI-Powered SEO Analysis & Rank Tracking Platform

IntelliRank is a full-stack **AI-powered SEO analysis and keyword rank tracking platform** built using the MERN stack. It helps users analyze websites, identify SEO issues, track keyword rankings, monitor ranking history, and get AI-powered SEO recommendations through an integrated Gemini-powered SEO Assistant.

## 🌐 Live Demo

**Live Application:** https://intelli-rank-eight.vercel.app/

---

## ✨ Features

### 🔍 Website SEO Analysis

* Analyze any website by entering its URL.
* Extract important website information such as:

  * Meta title
  * Meta description
  * Canonical URL
  * Robots information
  * Open Graph metadata
  * Twitter Card
  * Viewport and charset
  * Headings
  * Internal and external links
  * Images and alt text
  * Page content
  * Word count
  * Page size
  * Load time

### 📊 SEO Report

The application generates a detailed SEO report containing:

* Overall SEO Score
* SEO Score
* Performance Score
* Accessibility Score
* Best Practices Score
* Top Keywords
* Keyword Frequency and Density
* Critical Issues
* Warning Issues
* Informational Issues
* Actionable Recommendations

### 🤖 AI SEO Assistant

The platform includes an AI-powered SEO chatbot using **Google Gemini**.

Users can ask questions such as:

* How can I improve my SEO score?
* How can I improve my meta description?
* Why is my page performance low?
* Which SEO issues should I fix first?

The assistant uses the analyzed website report as context to provide relevant SEO recommendations.

### 💬 Chat History

* User conversations with the AI SEO Assistant are stored in MongoDB.
* Previous conversations can be retrieved using the analysis ID.
* Each conversation is associated with the authenticated user and specific SEO analysis.

### 📈 Keyword Rank Tracking

Users can track the Google ranking position of their keywords.

The rank tracker provides information such as:

* Keyword
* Target website/domain
* Current ranking
* Best ranking
* Ranking history
* Competitor information
* Active/inactive tracking status

### 🌐 Automated Google Search

Keyword ranking is checked using:

* **Browserbase** for cloud browser infrastructure
* **Playwright** for browser automation

The system searches Google and identifies the position of the target website.

### ⏰ Automated Rank Tracking

Scheduled rank tracking is implemented using a cron job so active keywords can be checked automatically.

### 🔐 Authentication

The application uses JWT-based authentication.

Features include:

* User registration
* User login
* Protected routes
* Authentication middleware
* Logout
* User-specific analyses and chat history

---

# 🛠️ Tech Stack

## Frontend

* React.js
* TypeScript
* Tailwind CSS
* React Router
* Axios
* Context API
* Lucide React

## Backend

* Node.js
* Express.js
* JavaScript
* REST APIs
* JWT Authentication

## Database

* MongoDB
* Mongoose

## AI

* Google Gemini API

## Web Automation

* Playwright
* Browserbase

## Other Tools

* Git
* GitHub
* Vercel
* Postman
* Node Cron

---

# 🏗️ Project Architecture

```text
                    IntelliRank
                        |
          ┌─────────────┴─────────────┐
          |                           |
       Frontend                    Backend
          |                           |
     React + TS                 Express + Node
          |                           |
     Axios API                     Routes
          |                           |
     Context API                Controllers
                                      |
                                   Services
                                      |
                         ┌────────────┴────────────┐
                         |                         |
                     MongoDB                  External APIs
                         |                  Gemini / Browserbase
                         |
                     Mongoose
```

---

# 📂 Project Structure

## Frontend

```text
client/
│
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── ProtectedRoute.tsx
│   │   ├── AnalysesCard.tsx
│   │   └── SeoChat.tsx
│   │
│   ├── context/
│   │   └── AppContext.tsx
│   │
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── Login.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Analyze.tsx
│   │   ├── Report.tsx
│   │   ├── History.tsx
│   │   ├── RankTracker.tsx
│   │   └── RankDetail.tsx
│   │
│   ├── types/
│   │   └── chat.ts
│   │
│   └── App.tsx
│
└── package.json
```

## Backend

```text
server/
│
├── config/
│   └── db.js
│
├── controllers/
│   ├── authController.js
│   ├── analysisController.js
│   ├── chatController.js
│   └── rankController.js
│
├── middleware/
│   └── auth.js
│
├── models/
│   ├── userModel.js
│   ├── analysis.js
│   ├── chatModel.js
│   └── rankModel.js
│
├── routes/
│   ├── authRoutes.js
│   ├── analysisRoutes.js
│   ├── chatRoutes.js
│   └── rankRoute.js
│
├── services/
│   ├── chatService.js
│   └── ...
│
├── cron/
│   └── rankTrackingCron.js
│
└── server.js
```

---

# 🔄 Application Flow

## Website Analysis

```text
User enters URL
       ↓
React Frontend
       ↓
Backend API
       ↓
Website Scraping
       ↓
Extract Website Data
       ↓
Gemini SEO Analysis
       ↓
Structured SEO Result
       ↓
MongoDB
       ↓
SEO Report
```

---

# 🤖 AI SEO Assistant Flow

```text
User asks SEO question
          ↓
SeoChat.tsx
          ↓
POST /api/chat
          ↓
Authentication Middleware
          ↓
Chat Controller
          ↓
Find Website Analysis
          ↓
Chat Service
          ↓
Google Gemini API
          ↓
AI Generated Response
          ↓
Save Chat in MongoDB
          ↓
Return Response
          ↓
Display AI Answer
```

---

# 📈 Keyword Rank Tracking Flow

```text
User adds keyword
        ↓
Backend
        ↓
Browserbase
        ↓
Playwright
        ↓
Google Search
        ↓
Extract Search Results
        ↓
Find Target Domain
        ↓
Calculate Ranking
        ↓
MongoDB
        ↓
Rank Tracker UI
```

---

# 🔐 Authentication Flow

```text
User Login
    ↓
Express API
    ↓
Validate Credentials
    ↓
Generate JWT
    ↓
Frontend Stores Token
    ↓
Token Sent With Requests
    ↓
Auth Middleware
    ↓
Verify JWT
    ↓
Access Protected Resource
```

---

# 🔌 API Endpoints

## Authentication

```text
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/user
```

## SEO Analysis

```text
POST   /api/analysis
GET    /api/analysis/list
GET    /api/analysis/:id
DELETE /api/analysis/:id
```

## AI SEO Assistant

```text
POST /api/chat
GET  /api/chat/:analysisId
```

## Rank Tracking

```text
POST   /api/rank
GET    /api/rank
PUT    /api/rank/:id/refresh
DELETE /api/rank/:id
```

---

# 🗄️ Database Structure

### User

```text
User
├── name
├── email
├── password
├── analysisCount
└── plan
```

### Analysis

```text
Analysis
├── userId
├── url
├── overallScore
├── categories
│   ├── seo
│   ├── performance
│   ├── accessibility
│   └── bestPractices
├── keywords
├── issues
└── metaData
```

### Chat

```text
Chat
├── analysisId
├── userId
└── messages
    ├── role
    └── content
```

### Rank Tracking

```text
RankTracking
├── userId
├── keyword
├── domain
├── currentRank
├── bestRank
├── history
├── competitors
└── status
```

---

# 🧠 AI SEO Analysis

Gemini receives structured website information such as:

* Website URL
* Page load time
* Status code
* Page size
* Word count
* Metadata
* Headings
* Links
* Images
* Page content

The AI evaluates the website based on SEO guidelines and generates structured results containing:

```text
Overall Score
      +
Category Scores
      +
Keywords
      +
SEO Issues
      +
Recommendations
```

---

# 🚀 Installation

## 1. Clone Repository

```bash
git clone https://github.com/your-username/intellirank.git

cd intellirank
```

## 2. Install Frontend Dependencies

```bash
cd client
npm install
```

## 3. Install Backend Dependencies

```bash
cd ../server
npm install
```

---

# 🔑 Environment Variables

Create a `.env` file inside the backend directory.

```env
PORT=5000

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

GEMINI_API_KEY=your_gemini_api_key

BROWSERBASE_API_KEY=your_browserbase_api_key

BROWSERBASE_PROJECT_ID=your_browserbase_project_id
```

For the frontend:

```env
VITE_BACKEND_URL=http://localhost:5000
```

> Never commit `.env` files or API keys to GitHub.

---

# ▶️ Running Locally

## Start Backend

```bash
cd server
npm run dev
```

## Start Frontend

Open another terminal:

```bash
cd client
npm run dev
```

The application will run locally using the frontend and backend development servers.

---

# 🎯 Key Highlights

* Full-stack MERN application
* AI-powered SEO analysis
* Gemini-powered conversational SEO assistant
* Automated Google keyword rank tracking
* Browser automation using Playwright
* Cloud browser infrastructure using Browserbase
* JWT authentication
* MongoDB-based report and chat history
* Scheduled keyword tracking
* Responsive Tailwind CSS interface
* RESTful backend APIs

---

# 🔮 Future Improvements

* PDF export for SEO reports
* SEO performance charts
* Email notifications for ranking changes
* Google OAuth authentication
* Competitor comparison dashboard
* Scheduled SEO reports
* Advanced keyword analytics
* Team collaboration
* Multi-language AI SEO recommendations

---

# 👩‍💻 Author

**Vanshika Kapoor**

B.Tech Computer Science Engineering

---

## ⭐ Project

If you find this project useful, consider giving the repository a ⭐ on GitHub.
