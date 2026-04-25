# 🚀 QUICK START GUIDE - Daily Expense Tracker

## Prerequisites
- **Node.js 18+** installed on your machine
- **Firebase account** (free)
- **Text editor** (VS Code recommended)

## 5-Minute Setup

### Step 1: Get Firebase Credentials (2 minutes)
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **Create a project**
3. Name it: `daily-expense-tracker`
4. Skip Google Analytics
5. Once created, go to **Build → Realtime Database**
6. Click **Create Database**
7. Select **us-central1** region
8. Choose **Test Mode** (important!)
9. Click **Enable**

### Step 2: Enable Email/Password Auth (1 minute)
1. Go to **Build → Authentication**
2. Click **Get Started**
3. Click **Email/Password**
4. Toggle **Enable**
5. Click **Save**

### Step 3: Get Your Firebase Config (1 minute)
1. Go to **Project Settings** (⚙️ icon)
2. Scroll to **Your apps** section
3. Click **Web** icon (</>)
4. Register web app (any name)
5. **Copy the Firebase config object** - you'll need this next

### Step 4: Add Config to Project (1 minute)
1. Open the project folder in your editor
2. Open `src/environments/environment.ts`
3. Replace the whole firebase object with your config from Firebase Console
4. Also update `src/environments/environment.prod.ts` with same config
5. **Save both files**

### Step 5: Run the App!
```bash
npm install
npm start
```

Then:
- Open `http://localhost:4200` in your browser
- Click **Signup** to create an account
- Start adding expenses!

## ✅ What You Got

✅ Complete Angular 21 application with:
- Authentication (Email/Password)
- Expense tracking with Firebase Realtime Database
- Beautiful Material Design UI
- Today's expenses view
- Monthly summary
- Completely FREE (uses Firebase free tier)

## 📁 Project Files Created

**Services:**
- `src/app/services/auth.service.ts` - User authentication
- `src/app/services/expense.service.ts` - Expense CRUD operations

**Components:**
- `src/app/auth/login/` - Login page
- `src/app/auth/signup/` - Signup page  
- `src/app/dashboard/` - Main dashboard

**Configuration:**
- `src/environments/environment.ts` - Development config
- `src/environments/environment.prod.ts` - Production config
- `src/app/app.config.ts` - Angular configuration
- `src/app/app.routes.ts` - Routing setup
- `src/app/guards/auth.guard.ts` - Route protection

**Documentation:**
- `FIREBASE_SETUP.md` - Detailed Firebase setup instructions
- `PROJECT_GUIDE.md` - Architecture and features guide
- `README.md` - Complete project documentation

## 🔧 Commands

```bash
# Development server
npm start

# Build for production
npm run build

# Run tests
npm test
```

## ❓ Troubleshooting

**Can't login after signup?**
- Make sure `environment.ts` has correct Firebase config
- Check database rules are published in Firebase Console

**Expenses not saving?**
- Verify Firebase Realtime Database is enabled
- Check database rules (should be published, not just draft)

**App won't compile?**
- Run: `npm install --legacy-peer-deps`

## 📚 Need More Help?

Read the detailed guides:
- **Firebase Setup**: `FIREBASE_SETUP.md` 
- **Architecture**: `PROJECT_GUIDE.md`
- **Overview**: `README.md`

## 🎉 You're Ready!

Your complete, production-ready expense tracker is ready to use. All data is stored securely in Firebase, completely free!

**Happy expense tracking! 💰**

---

For issues or questions, check the documentation files in your project root.
