# FinanceTracker

## Overview
FinanceTracker is an AI-powered personal finance management application built with React and Vite. It provides comprehensive financial tracking, budgeting, investment portfolio management, and smart financial insights.

## Project Architecture

### Frontend (Port 5000)
- **Framework**: React 18 with Vite 5
- **Styling**: TailwindCSS with custom plugins
- **State Management**: Redux Toolkit
- **Routing**: React Router DOM
- **Charts**: Chart.js, Recharts, D3.js
- **UI Components**: Lucide React icons, Framer Motion animations

### Backend (Python - Optional)
- **Flask server** for AI sentiment analysis (not required for frontend operation)
- Located in `finance_ai_server.py` and `sentiment_analyzer.py`
- Requires Python dependencies from `requirements.txt`

## Directory Structure
```
src/
├── components/         # Reusable UI components
│   ├── ui/            # Base UI components (Button, Input, Select, etc.)
│   └── pages/         # Page-specific components
├── pages/             # Application pages
│   ├── budget-planning/
│   ├── financial-dashboard/
│   ├── investment-portfolio/
│   ├── transaction-management/
│   ├── user-login/
│   └── ...
├── context/           # React context providers
├── utils/             # Utility functions
└── styles/            # Global styles
```

## Commands
- `npm run start` - Start development server on port 5000
- `npm run build` - Build for production (outputs to `build/` directory)
- `npm run serve` - Preview production build

## Configuration
- Vite config: `vite.config.mjs`
- TailwindCSS config: `tailwind.config.js`
- PostCSS config: `postcss.config.js`

## Key Features
- User authentication (login/registration)
- Financial dashboard with account balances
- Budget planning and tracking
- Investment portfolio management
- Transaction management
- Paper trading simulator
- AI-powered insights (optional Flask backend)
- Receipt scanning with Tesseract.js

## Mobile App (Capacitor)
The app is configured with Capacitor for building native Android and iOS apps.

### Mobile Commands
- `npm run mobile:build` - Build web app and sync with native platforms
- `npm run mobile:sync` - Sync web assets to native platforms
- `npm run mobile:android` - Open Android project in Android Studio
- `npm run mobile:ios` - Open iOS project in Xcode

### Building Mobile Apps
1. Run `npm run mobile:build` to build and sync
2. For Android: Open `android/` folder in Android Studio, build APK
3. For iOS: Open `ios/` folder in Xcode (requires macOS), build IPA

### Capacitor Config
- Config file: `capacitor.config.ts`
- App ID: `com.financetracker.app`
- Web directory: `build/`

## Deployment
- Static deployment configured
- Build output: `build/` directory
- Run `npm run build` before deploying
