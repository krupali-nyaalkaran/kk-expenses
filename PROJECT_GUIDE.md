# Daily Expense Tracker - Project Guide

## 📁 Project Structure

```
src/
├── app/
│   ├── auth/
│   │   ├── login/
│   │   │   └── login.component.ts
│   │   └── signup/
│   │       └── signup.component.ts
│   ├── dashboard/
│   │   └── dashboard.component.ts
│   ├── services/
│   │   ├── auth.service.ts          # Authentication logic
│   │   └── expense.service.ts       # Expense CRUD operations
│   ├── guards/
│   │   └── auth.guard.ts            # Route protection
│   ├── app.routes.ts                # App routing
│   ├── app.config.ts                # Firebase & Material config
│   └── app.ts                       # Root component
├── environments/
│   ├── environment.ts               # Dev Firebase config
│   └── environment.prod.ts          # Prod Firebase config
└── index.html                       # HTML template with Material theme
```

## 🔐 Authentication Flow

1. **Signup**: User creates account with email/password
   - Firebase stores credentials securely
   - User gets unique UID

2. **Login**: User logs in with credentials
   - Auth service stores user session
   - Dashboard guard checks authentication
   - Only logged-in users can access dashboard

3. **Logout**: User signs out
   - Session cleared
   - Redirected to login page

## 💾 Expense Data Flow

1. **Add Expense**:
   - Form validation
   - Data sent to Firebase Realtime Database
   - Stored under `expenses/{userId}/{expenseId}`
   - Auto-updates all subscribed components

2. **View Expenses**:
   - Service loads all user's expenses from Firebase
   - Filters by date/month as needed
   - RxJS observables keep UI in sync

3. **Delete Expense**:
   - Remove from Firebase
   - Observable updates automatically

## 🎯 Core Features

### 1. Dashboard
- Shows today's date
- Displays today's total expense
- Displays current month's total
- Lists all today's expenses

### 2. Add Expense
- Expense name input
- Amount input
- Date picker (defaults to today)
- Add button

### 3. Expense Table
- Name column
- Amount column
- Date column
- Delete button per row

### 4. Monthly Summary
- Shows month-wise breakdown
- Example: "April 2024: ₹5,000"

## 🛠️ Installation & Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Firebase
Follow `FIREBASE_SETUP.md` to:
- Create Firebase project
- Enable Database & Auth
- Get Firebase config
- Update `environment.ts` and `environment.prod.ts`

### 3. Run Development Server
```bash
npm start
```

Open: `http://localhost:4200`

### 4. Build for Production
```bash
npm run build
```

Output: `dist/` folder

## 📱 UI Components Used

- **Angular Material Cards** - For cards/sections
- **Material Form Fields** - For inputs
- **Material Table** - For expense list
- **Material Buttons** - For actions
- **Material Toolbar** - For header
- **Material Date Picker** - For date selection
- **Material Icons** - For UI icons
- **Material Snackbar** - For notifications

## 🔄 Data Binding

Uses **RxJS Observables** for reactive updates:

```typescript
// Service provides:
getTodayTotal(): Observable<number>
getTodayExpenses(): Observable<Expense[]>
getMonthlyTotal(): Observable<number>
getExpensesByMonth(): Observable<{ [month]: number }>
```

Components subscribe and automatically update when data changes.

## 🔒 Security Features

- ✅ Firebase Authentication (Email/Password)
- ✅ Database Rules (users only see their data)
- ✅ Auth Guards (protect dashboard route)
- ✅ No hardcoded credentials
- ✅ User data isolated by UID

## 📊 Key Services

### AuthService
```typescript
signup(email, password): Promise
login(email, password): Promise
logout(): Promise
getCurrentUser(): Observable
getUserId(): string
```

### ExpenseService
```typescript
loadExpenses(uid): void
addExpense(uid, name, amount, date): Promise
deleteExpense(uid, id): Promise
getTodayExpenses(): Observable
getTodayTotal(): Observable
getMonthlyTotal(): Observable
getExpensesByMonth(): Observable
```

## 🎨 Styling

- **Material Design** - Clean, modern UI
- **Responsive** - Works on mobile/tablet/desktop
- **Color Scheme** - Purple gradient theme
- **Animations** - Material transitions

## 📈 Free Tier Limits

- 100 concurrent connections ✅
- 1GB storage ✅
- 10GB downloads/month ✅
- Email/Password auth ✅
- All free, no charges ✅

## 🚀 Deployment Options

### 1. Firebase Hosting (FREE)
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

### 2. Netlify (FREE)
- Connect GitHub repo
- Auto-deploy on push

### 3. Vercel (FREE)
- Similar to Netlify
- Excellent performance

## 🐛 Common Issues & Solutions

**Issue: Can't login**
- Check Firebase config in environment.ts
- Verify email/password auth is enabled in Firebase

**Issue: Expenses not saving**
- Check database rules are published
- Verify database is enabled

**Issue: Permission denied**
- Database rules might be too strict
- Review rules in Firebase Console

**Issue: Module not found**
- Run `npm install` again
- Clear node_modules: `rm -r node_modules && npm install`

## 📝 Adding New Features

To add a feature:
1. Create service method
2. Update component template
3. Add Material component if needed
4. Handle RxJS subscription
5. Add snackbar feedback

## 🔧 Environment Variables

For production, use environment variables instead of hardcoding:

```typescript
// environment.prod.ts
export const environment = {
  production: true,
  firebase: {
    // Use environment variables here
    apiKey: process.env['FIREBASE_API_KEY'] || 'fallback'
  }
};
```

## 📞 Support

Refer to:
- [Angular Documentation](https://angular.io/docs)
- [Angular Material](https://material.angular.io/)
- [Firebase Docs](https://firebase.google.com/docs)
- [RxJS Docs](https://rxjs.dev/)

---

**Happy expense tracking! 💰**
