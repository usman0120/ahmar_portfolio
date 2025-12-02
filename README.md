# Muhammad Ahmar Saleem - Portfolio Website

A modern, responsive portfolio website for a Flutter Developer and Software Engineering student, featuring a complete admin dashboard for content management.

## 🚀 Live Demo
https://ahmar-portfolio-tau.vercel.app

## ✨ Features

### Public Website
- **Home Page**: Hero section with animated background, profile display, and call-to-action buttons
- **About Page**: Personal bio, education timeline, goals, and experience
- **Skills Page**: Categorized skills display with proficiency levels and animations
- **Projects Page**: Portfolio projects with filtering by technology stack
- **Contact Page**: Contact form with message storage to Firebase

### Admin Dashboard (Protected)
- **Authentication**: Secure login with Firebase Auth
- **Dashboard Overview**: Stats, quick actions, and recent activity
- **Project Management**: Full CRUD operations for portfolio projects
- **Skills Management**: Add, edit, and delete skills with categories
- **Messages Management**: View and manage contact form submissions
- **Profile Settings**: Update personal information, bio, and social links
- **Account Settings**: Change password, preferences, and security settings

## 🛠️ Tech Stack

### Frontend
- **React 19** with TypeScript
- **Tailwind CSS 3** - Styling framework
- **Framer Motion** - Animation library
- **React Router DOM** - Routing

### Backend & Database
- **Firebase Authentication** - User authentication
- **Firebase Firestore** - NoSQL database
- **Firebase Hosting** (Optional) - Deployment

### Development Tools
- **Vite** - Build tool and dev server
- **TypeScript** - Type safety
- **ESLint** - Code linting
- **PostCSS** - CSS processing

## 📁 Project Structure

```

portfolio-ahmar/
├──public/
│└── favicon.ico
├──src/
│├── assets/                    # Static assets
│├── components/                # Reusable components
││   ├── ui/                    # UI components
││   ├── Navbar.tsx             # Navigation bar
││   ├── Footer.tsx             # Footer component
││   └── LoadingSkeleton.tsx    # Loading states
│├── pages/                     # Page components
││   ├── Home.tsx               # Landing page
││   ├── About.tsx              # About page
││   ├── Skills.tsx             # Skills page
││   ├── Projects.tsx           # Projects page
││   ├── Contact.tsx            # Contact page
││   └── Admin/                 # Admin pages
││       ├── Dashboard.tsx      # Admin dashboard
││       ├── ProjectsAdmin.tsx  # Projects management
││       ├── SkillsAdmin.tsx    # Skills management
││       ├── MessagesAdmin.tsx  # Messages management
││       ├── ProfileSettings.tsx# Profile settings
││       ├── Settings.tsx       # Account settings
││       └── AdminLogin.tsx     # Admin login
│├── routes/
││   └── AppRoutes.tsx          # Application routes
│├── context/
││   └── AuthContext.tsx        # Authentication context
│├── firebase/
││   ├── firebaseClient.ts      # Firebase configuration
││   └── models.ts              # TypeScript interfaces
│├── hooks/
││   ├── useAuth.ts             # Auth hook
││   └── useFirestore.ts        # Firestore operations
│├── styles/
││   └── globals.css            # Global styles
│├── utils/
││   ├── validators.ts          # Form validation
││   └── animations.ts          # Animation configurations
│├── App.tsx                    # Main App component
│└── main.tsx                   # Application entry point
├──.env                           # Environment variables
├──.gitignore                     # Git ignore file
├──index.html                     # HTML template
├──package.json                   # Dependencies
├──tsconfig.json                  # TypeScript config
├──tailwind.config.cjs            # Tailwind config
├──postcss.config.cjs             # PostCSS config
└──vite.config.ts                 # Vite config

```

## 🎨 Design System

### Color Palette
- **Primary**: `#FF6B35` (Warm Orange)
- **Secondary**: `#F7C59F` (Soft Peach)
- **Accent**: `#254441` (Deep Green-Teal)
- **Background**: `#FAF7F2` (Off-White)
- **Text Dark**: `#1E1E1E`
- **Text Light**: `#6B6B6B`

### Typography
- **Headings**: Poppins (Bold, SemiBold)
- **Body Text**: Inter (Regular, Medium)

### UI Style
- Smooth curves (rounded-2xl)
- Glassmorphism effects
- Soft shadows and gradients
- Hover animations
- Responsive grid layouts

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ installed
- Firebase account
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/portfolio-ahmar.git
   cd portfolio-ahmar
```

1. Install dependencies
   ```bash
   npm install
   ```
2. Set up Firebase
   · Create a new Firebase project
   · Enable Authentication (Email/Password)
   · Create Firestore Database
   · Get your Firebase config from Project Settings
3. Configure environment variables
   Create .env file in root directory:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```
4. Start development server
   ```bash
   npm run dev
   ```
5. Build for production
   ```bash
   npm run build
   ```

🔐 Admin Setup

1. Enable Email/Password Authentication in Firebase Console
2. Create Admin User:
   · Email: admin@ahmar.com
   · Password: password123
3. Access Admin Dashboard at /admin/login

📦 Deployment

Option 1: Vercel (Recommended)

```bash
npm run build
vercel --prod
```

Option 2: Firebase Hosting

```bash
npm run build
firebase deploy --only hosting
```

Option 3: Netlify

· Connect GitHub repository
· Set build command: npm run build
· Set publish directory: dist

🔧 Firebase Configuration

Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Public read access
    match /projects/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /skills/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /profile/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    // Admin-only access
    match /messages/{document} {
      allow read, write: if request.auth != null;
    }
  }
}
```

Collections Structure

· projects: Portfolio projects with title, description, tech stack, links
· skills: Skills with name, category, icon, proficiency level
· profile: Personal information, bio, social links
· messages: Contact form submissions

🧪 Testing

Run development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

Lint code:

```bash
npm run lint
```

📱 Responsive Design

· Mobile: 100% responsive down to 320px
· Tablet: Optimized for 768px and above
· Desktop: Full experience from 1024px
· Large Desktop: Enhanced layouts from 1440px

🎯 Key Features Implementation

Animations

· Page transitions with Framer Motion
· Staggered item animations
· Hover effects and micro-interactions
· Loading skeletons

Performance

· Lazy loading images
· Code splitting
· Optimized bundle size
· Efficient Firestore queries

SEO

· Semantic HTML
· Meta tags
· Structured data
· Fast loading times

🤝 Contributing

1. Fork the repository
2. Create a feature branch (git checkout -b feature/AmazingFeature)
3. Commit changes (git commit -m 'Add AmazingFeature')
4. Push to branch (git push origin feature/AmazingFeature)
5. Open a Pull Request

📄 License

This project is licensed under the MIT License - Allows rights reserved 

🙏 Acknowledgments

· Firebase for backend services
· Tailwind CSS for styling
· Framer Motion for animations
· React for UI framework

📞 Contact

Muhammad Ahmar Saleem - @ahmar

Project Link: https://ahmar-portfolio-tau.vercel.app

---

Made with ❤️ by Usman Ahmad for Ahmar Saleem

```