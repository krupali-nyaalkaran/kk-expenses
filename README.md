# 🎯 Daily Expense Tracker - Firebase Web App

A complete, production-ready **Daily Expense Tracker** built with:
- **Angular 21** (latest stable)
- **Firebase** (Free tier only - Spark Plan)
- **Angular Material** (beautiful UI)
- **TypeScript** (type-safe code)
- **RxJS** (reactive data handling)

## ✨ Features

### 🔐 Authentication
- Email/Password signup and login
- Secure Firebase authentication
- User data isolation by UID

### 💰 Expense Management
- Add expenses with name, amount, and date
- View today's expenses
- Delete expenses
- Automatic data sync

### 📊 Dashboard
- Today's total expense
- Current month's total expense
- Monthly breakdown summary
- Beautiful Material UI

### 📱 Responsive Design
- Works on desktop, tablet, and mobile
- Clean, modern interface
- Smooth animations

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm installed

### 1. Setup Firebase (Free Tier)

**[Read FIREBASE_SETUP.md for detailed steps]**

Quick summary:
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create new project
3. Enable Realtime Database (Test Mode)
4. Enable Email/Password Authentication
5. Get Firebase config
6. Update `src/environments/environment.ts`

```typescript
// environment.ts
export const environment = {
  production: false,
  firebase: {
    apiKey: "YOUR_API_KEY",
    authDomain: "your-project.firebaseapp.com",
    databaseURL: "https://your-project.firebasedatabase.app",
    projectId: "your-project",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "YOUR_ID",
    appId: "YOUR_APP_ID"
  }
};
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run Development Server

```bash
npm start
```

Open `http://localhost:4200` in your browser

### 4. Test the App

1. Click **Signup** → Create new account
2. Login with your credentials
3. Add expenses using the form
4. View today's expenses
5. See monthly summary

## 📋 Project Structure

```
expensesk/
├── src/
│   ├── app/
│   │   ├── auth/
│   │   │   ├── login/
│   │   │   └── signup/
│   │   ├── dashboard/
│   │   ├── services/
│   │   │   ├── auth.service.ts
│   │   │   └── expense.service.ts
│   │   ├── guards/
│   │   │   └── auth.guard.ts
│   │   ├── app.routes.ts
│   │   ├── app.config.ts
│   │   └── app.ts
│   ├── environments/
│   │   ├── environment.ts
│   │   └── environment.prod.ts
│   ├── index.html
│   └── main.ts
├── FIREBASE_SETUP.md        👈 Read this first!
├── PROJECT_GUIDE.md         👈 Detailed architecture
├── package.json
└── README.md                👈 This file
```

## 🛠️ Commands

```bash
# Install dependencies
npm install

# Run dev server
npm start

# Build for production
npm run build

# Run tests
npm test
```

## 🔥 Firebase Free Tier Limits

✅ **Safe to use without any charges:**
- 100 concurrent connections
- 1 GB storage
- 10 GB data download/month
- Email/Password authentication
- Unlimited users

**Zero cost forever** until you exceed these limits!

## 🔒 Security

Database Rules (Secure):
```json
{
  "rules": {
    "expenses": {
      "$uid": {
        ".read": "auth.uid === $uid",
        ".write": "auth.uid === $uid"
      }
    }
  }
}
```

✅ Users can only access their own data
✅ No cross-user data leaks
✅ Firebase handles authentication securely

## 📖 Database Structure

```
expenses/
└── userId/
    ├── expenseId1
    │   ├── name: "Coffee"
    │   ├── amount: 150
    │   ├── date: "2024-04-08"
    │   └── createdAt: 1712583900000
    └── expenseId2
        ├── name: "Fuel"
        ├── amount: 500
        ├── date: "2024-04-08"
        └── createdAt: 1712584200000
```

Each user sees only their expenses!

## 🎨 UI Components

All using **Angular Material**:
- Cards for data display
- Form fields for input
- Tables for listings
- Buttons with ripple effects
- Date picker for date selection
- Icons and placeholders
- Responsive grid layout

## 🔄 Reactive Architecture

Uses **RxJS Observables** throughout:
- Real-time data updates
- Automatic UI refresh
- Clean separation of concerns
- Memory leak prevention

## 📊 Features Breakdown

### Authentication
- ✅ Sign up with email/password
- ✅ Login with validation
- ✅ Logout with session clear
- ✅ Password confirmation
- ✅ Email format validation

### Expense Tracking
- ✅ Add expense (name, amount, date)
- ✅ View today's expenses
- ✅ Calculate daily total
- ✅ Calculate monthly total
- ✅ Delete expense
- ✅ Monthly summary breakdown

### UI/UX
- ✅ Beautiful Material Design
- ✅ Responsive layout
- ✅ Loading spinners
- ✅ Error & success messages
- ✅ Form validation
- ✅ Empty state handling

## 🚀 Deployment

### Firebase Hosting (Recommended - FREE)

```bash
npm install -g firebase-tools
npm run build
firebase login
firebase init hosting
firebase deploy
```

### Netlify (Alternative - FREE)

1. Push code to GitHub
2. Connect repository to Netlify
3. Auto-deployed on every push

### Docker (Advanced)

```dockerfile
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build
EXPOSE 4200
CMD ["npm", "start"]
```

## 💡 Key Technologies

| Package | Version | Purpose |
|---------|---------|---------|
| Angular | 21.x | Framework |
| Firebase | Latest | Backend |
| Angular Material | Latest | UI Components |
| RxJS | 7.8 | Reactive |
| TypeScript | 5.9 | Type Safety |

## 🐛 Troubleshooting

### Dependency Conflicts

If you get "ERESOLVE" error, use:
```bash
npm install --legacy-peer-deps
```

### Firebase Config Issues

Make sure `environment.ts` has:
- ✅ `apiKey` 
- ✅ `authDomain`
- ✅ `databaseURL`
- ✅ `projectId`

Check database rules are **published** (not draft)

### Material Not Loading

Import Material modules in components as seen in dashboard.component.ts

## 📚 Resources

- [Angular Docs](https://angular.io)
- [Firebase Docs](https://firebase.google.com/docs)
- [Material Docs](https://material.angular.io/)
- [RxJS Docs](https://rxjs.dev/)
- [TypeScript Docs](https://www.typescriptlang.org/)

## 🤝 Contributing

Feel free to fork and submit PRs!

## 📝 License

MIT License - Free to use and modify

## ❓ FAQ

**Q: Is this production-ready?**  
A: Yes! It's secure and follows Angular best practices.

**Q: Will I be charged?**  
A: No! Free tier is forever unless you exceed Spark Plan limits.

**Q: Can I add more features?**  
A: Absolutely! The architecture supports easy extensions.

**Q: How many users?**  
A: Unlimited with free tier!

**Q: Can I use this as a template?**  
A: Yes! Feel free to customize for your needs.

## 🎓 Learning Path

1. Read `PROJECT_GUIDE.md` for architecture
2. Read `FIREBASE_SETUP.md` for backend setup
3. Explore code in `src/app/`
4. Try modifying dashboard component
5. Add new features!

## 📞 Support

Need help?
1. Check troubleshooting section above
2. Read the documentation files
3. Check Angular/Firebase docs
4. Review code comments

---

## ✅ Checklist Before Starting

- [ ] Node.js 18+ installed
- [ ] Firebase account created
- [ ] Firebase config obtained
- [ ] `environment.ts` updated
- [ ] Dependencies installed (`npm install`)
- [ ] Development server running (`npm start`)
- [ ] Can navigate to `localhost:4200`

**You're ready! Happy expense tracking! 💰**

---

**Made with ❤️ using Angular & Firebase**



```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
