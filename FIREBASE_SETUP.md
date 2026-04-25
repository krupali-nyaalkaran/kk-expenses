# Daily Expense Tracker - Firebase Setup Guide

## ⚠️ IMPORTANT: Free Tier Only (Spark Plan)

This guide will help you set up Firebase **FREE TIER** only. No paid features are used.

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name: **daily-expense-tracker**
4. Uncheck "Enable Google Analytics" (not needed for free tier)
5. Click "Create project"
6. Wait for project to be created

## Step 2: Enable Realtime Database

1. In Firebase Console, go to **Build → Realtime Database**
2. Click "Create Database"
3. Select **Location: us-central1** (or closest to you)
4. Start in **Test Mode** (important for development)
   - Allows read/write access (we'll secure it later)
5. Click "Enable"

## Step 3: Set Database Rules (Security)

1. Go to **Realtime Database → Rules**
2. Replace everything with this (SECURE YET FREE TIER COMPATIBLE):

```json
{
  "rules": {
    "expenses": {
      "$uid": {
        ".read": "auth.uid === $uid",
        ".write": "auth.uid === $uid",
        ".validate": "newData.hasChildren(['name', 'amount', 'date', 'createdAt'])"
      }
    }
  }
}
```

3. Click "Publish"

This ensures:
- ✅ Users can only access their own expenses
- ✅ No one can read/write other users' data
- ✅ Works on free tier

## Step 4: Enable Authentication (Email/Password)

1. Go to **Build → Authentication**
2. Click "Get Started"
3. Click on **Email/Password**
4. Toggle "Enable"
5. Click "Save"

## Step 5: Get Firebase Config

1. Go to **Project Settings** (gear icon)
2. Click on "Your apps" section
3. Click "Web" (</> icon)
4. Enter app name: **daily-expense-tracker**
5. Register app
6. Copy the Firebase config (you'll see the object with apiKey, authDomain, etc.)

## Step 6: Add Config to Angular

1. Open `src/environments/environment.ts`
2. Replace with your Firebase config:

```typescript
export const environment = {
  production: false,
  firebase: {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    databaseURL: "https://YOUR_PROJECT.firebasedatabase.app",
    projectId: "YOUR_PROJECT",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_ID",
    appId: "YOUR_APP_ID"
  }
};
```

3. Also update `src/environments/environment.prod.ts` with same config

## Step 7: Free Tier Limits ✅

These are safe to use without worrying about costs:

- ✅ **100 concurrent connections** - More than enough for personal expense tracker
- ✅ **1GB storage** - Perfect for expense data
- ✅ **10GB data download/month** - Way more than needed
- ✅ **Authentication: free**
- ✅ No credit card required initially
- ✅ Will never charge without warning

## Database Structure

Your expenses will be stored like this:

```
expenses/
  userId1/
    expenseId1:
      name: "Coffee"
      amount: 150
      date: "2024-04-08"
      createdAt: 1712583900000
    expenseId2:
      name: "Fuel"
      amount: 500
      date: "2024-04-08"
      createdAt: 1712584200000
  userId2/
    expenseId1:
      ...
```

Each user sees only their own data (secure by rules).

## ✅ Verification Checklist

Before running the app:

- [ ] Firebase project created
- [ ] Realtime Database enabled
- [ ] Database Rules published
- [ ] Authentication (Email/Password) enabled
- [ ] Firebase config added to environment files
- [ ] Config has: apiKey, authDomain, databaseURL, projectId, appId

## 🚀 Running the App

```bash
npm install
npm start
```

Then:
1. Go to `http://localhost:4200`
2. Click "Signup"
3. Create account with email/password
4. Start adding expenses!

## 🔒 Security Notes

- Database rules ensure users only access their own data
- No data is visible to other users
- Firebase handles authentication securely
- All data is encrypted in transit

## 📞 Troubleshooting

**Error: "Permission denied"**
- Usually means database rules not published
- Go to Realtime Database → Rules and click "Publish"

**Error: "Auth/configuration-not-found"**
- Firebase config not set properly
- Double-check environment.ts file

**Email signup not working**
- Make sure Email/Password auth is enabled in Firebase Console

## 💡 Tips

- Test your rules in Firebase Console → Realtime Database → Rules → "Simulate"
- Monitor free tier usage in Firebase Console → Usage
- Never commit real Firebase keys - use environment variables in production
- Create different Firebase projects for development and production

---

**You're all set! Your app is completely free to use and host.**
