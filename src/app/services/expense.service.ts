import { Injectable, signal, computed, inject, Injector, runInInjectionContext } from '@angular/core';
import { Database, ref, push, remove, onValue, update, set } from '@angular/fire/database';
import { AuthService } from './auth.service';

export interface Expense {
  id: string;
  name: string;
  amount: number;
  date: string; // YYYY-MM-DD
  createdAt: number;
}

export interface Income {
  id: string;
  source: string;
  amount: number;
  date: string; // YYYY-MM-DD
  createdAt: number;
}

export interface Saving {
  id: string;
  purpose: string;
  amount: number;
  date: string; // YYYY-MM-DD
  createdAt: number;
}

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  private db = inject(Database);
  private authService = inject(AuthService);
  private injector = inject(Injector);
  
  // Signal state
  public expenses = signal<Expense[]>([]);
  public incomes = signal<Income[]>([]);
  public savings = signal<Saving[]>([]);
  public budget = signal<number>(0);
  public isLoading = signal(false);

  constructor() {
    // Watch auth state to load/clear expenses
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.loadExpenses(user.uid);
        this.loadIncomes(user.uid);
        this.loadSavings(user.uid);
        this.loadBudget(user.uid);
      } else {
        this.expenses.set([]);
        this.incomes.set([]);
        this.savings.set([]);
        this.budget.set(0);
      }
    });
  }

  private loadBudget(userId: string): void {
    const budgetRef = ref(this.db, `expenses/${userId}/_budget`);
    onValue(budgetRef, (snapshot) => {
      if (snapshot.exists()) {
        this.budget.set(Number(snapshot.val()));
      } else {
        this.budget.set(0);
      }
    });
  }

  public async setBudget(amount: number): Promise<void> {
    const userId = this.authService.getUserId();
    if (!userId) return;
    const budgetRef = ref(this.db, `expenses/${userId}/_budget`);
    await runInInjectionContext(this.injector, () => set(budgetRef, amount));
  }

  private loadExpenses(userId: string): void {
    this.isLoading.set(true);
    const expensesRef = ref(this.db, `expenses/${userId}`);
    
    // Safety timeout: stop spinning after 5 seconds even if Firebase is slow
    const loadTimeout = setTimeout(() => {
      this.isLoading.set(false);
    }, 5000);

    onValue(expensesRef, (snapshot) => {
      clearTimeout(loadTimeout);
      if (snapshot.exists()) {
        const data = snapshot.val();
        // Filter out internal meta keys like _budget
        const expensesList: Expense[] = Object.keys(data)
          .filter(key => !key.startsWith('_'))
          .map(key => ({
            id: key,
            ...data[key]
          }));
        // Sort: Newest first using the createdAt timestamp
        expensesList.sort((a, b) => b.createdAt - a.createdAt);
        this.expenses.set(expensesList);
      } else {
        this.expenses.set([]);
      }
      this.isLoading.set(false);
    }, (error) => {
      clearTimeout(loadTimeout);
      this.isLoading.set(false);
      console.error('Error loading expenses:', error);
    });
  }

  private loadIncomes(userId: string): void {
    const incomesRef = ref(this.db, `incomes/${userId}`);
    onValue(incomesRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const list: Income[] = Object.keys(data).map(key => ({ id: key, ...data[key] }));
        list.sort((a, b) => b.createdAt - a.createdAt);
        this.incomes.set(list);
      } else {
        this.incomes.set([]);
      }
    });
  }

  private loadSavings(userId: string): void {
    const savingsRef = ref(this.db, `savings/${userId}`);
    onValue(savingsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const list: Saving[] = Object.keys(data).map(key => ({ id: key, ...data[key] }));
        list.sort((a, b) => b.createdAt - a.createdAt);
        this.savings.set(list);
      } else {
        this.savings.set([]);
      }
    });
  }

  async addExpense(name: string, amount: number, date: string): Promise<void> {
    const userId = this.authService.getUserId();
    if (!userId) throw new Error('User not authenticated');

    this.isLoading.set(true);
    
    // Add a safety timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      this.isLoading.set(false);
    }, 10000);

    try {
      const expensesRef = ref(this.db, `expenses/${userId}`);
      const newExpenseRef = push(expensesRef);
      await set(newExpenseRef, {
        name,
        amount,
        date,
        createdAt: Date.now()
      });
    } catch (error: any) {
      console.error('Error adding expense:', error);
      throw error;
    } finally {
      clearTimeout(timeout);
      this.isLoading.set(false);
    }
  }

  async updateExpense(expenseId: string, name: string, amount: number, date: string): Promise<void> {
    const userId = this.authService.getUserId();
    if (!userId) throw new Error('User not authenticated');

    this.isLoading.set(true);
    const timeout = setTimeout(() => this.isLoading.set(false), 5000);

    try {
      const expenseRef = ref(this.db, `expenses/${userId}/${expenseId}`);
      await update(expenseRef, { name, amount, date });
    } catch (error: any) {
      console.error('Error updating expense:', error);
      throw error;
    } finally {
      clearTimeout(timeout);
      this.isLoading.set(false);
    }
  }

  async deleteExpense(expenseId: string): Promise<void> {
    const userId = this.authService.getUserId();
    if (!userId) throw new Error('User not authenticated');

    this.isLoading.set(true);
    const timeout = setTimeout(() => this.isLoading.set(false), 5000);

    try {
      const expenseRef = ref(this.db, `expenses/${userId}/${expenseId}`);
      await remove(expenseRef);
    } catch (error: any) {
      console.error('Error deleting expense:', error);
      throw error;
    } finally {
      clearTimeout(timeout);
      this.isLoading.set(false);
    }
  }

  // --- Incomes ---
  async addIncome(source: string, amount: number, date: string): Promise<void> {
    const userId = this.authService.getUserId();
    if (!userId) throw new Error('User not authenticated');
    const newRef = push(ref(this.db, `incomes/${userId}`));
    await set(newRef, { source, amount, date, createdAt: Date.now() });
  }

  async updateIncome(id: string, source: string, amount: number, date: string): Promise<void> {
    const userId = this.authService.getUserId();
    if (!userId) throw new Error('User not authenticated');
    await update(ref(this.db, `incomes/${userId}/${id}`), { source, amount, date });
  }

  async deleteIncome(id: string): Promise<void> {
    const userId = this.authService.getUserId();
    if (!userId) throw new Error('User not authenticated');
    await remove(ref(this.db, `incomes/${userId}/${id}`));
  }

  // --- Savings ---
  async addSaving(purpose: string, amount: number, date: string): Promise<void> {
    const userId = this.authService.getUserId();
    if (!userId) throw new Error('User not authenticated');
    const newRef = push(ref(this.db, `savings/${userId}`));
    await set(newRef, { purpose, amount, date, createdAt: Date.now() });
  }

  async updateSaving(id: string, purpose: string, amount: number, date: string): Promise<void> {
    const userId = this.authService.getUserId();
    if (!userId) throw new Error('User not authenticated');
    await update(ref(this.db, `savings/${userId}/${id}`), { purpose, amount, date });
  }

  async deleteSaving(id: string): Promise<void> {
    const userId = this.authService.getUserId();
    if (!userId) throw new Error('User not authenticated');
    await remove(ref(this.db, `savings/${userId}/${id}`));
  }

  // Computed signals for stats
  public todayTotal = computed(() => {
    const today = new Date();
    const day = '' + today.getDate();
    const month = '' + (today.getMonth() + 1);
    const year = today.getFullYear();
    const todayStr = [day.padStart(2, '0'), month.padStart(2, '0'), year].join('-');
    
    return this.expenses()
      .filter(exp => exp.date === todayStr)
      .reduce((sum, exp) => sum + exp.amount, 0);
  });

  public todayCount = computed(() => {
    const today = new Date();
    const day = '' + today.getDate();
    const month = '' + (today.getMonth() + 1);
    const year = today.getFullYear();
    const todayStr = [day.padStart(2, '0'), month.padStart(2, '0'), year].join('-');
    return this.expenses().filter(exp => exp.date && exp.date === todayStr).length;
  });

  public monthlyTotal = computed(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    return this.expenses()
      .filter(exp => {
        if (!exp.date || typeof exp.date !== 'string') return false;
        // Parse DD-MM-YYYY
        const parts = exp.date.split('-');
        if (parts.length !== 3) return false;
        const dMonth = parseInt(parts[1]) - 1;
        const dYear = parseInt(parts[2]);
        return dMonth === currentMonth && dYear === currentYear;
      })
      .reduce((sum, exp) => sum + exp.amount, 0);
  });

  public monthlyIncomeTotal = computed(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    return this.incomes()
      .filter(inc => {
        if (!inc.date) return false;
        const parts = inc.date.split('-');
        return (parseInt(parts[1]) - 1) === currentMonth && parseInt(parts[2]) === currentYear;
      }).reduce((sum, inc) => sum + inc.amount, 0);
  });

  public monthlySavingTotal = computed(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    return this.savings()
      .filter(sav => {
        if (!sav.date) return false;
        const parts = sav.date.split('-');
        return (parseInt(parts[1]) - 1) === currentMonth && parseInt(parts[2]) === currentYear;
      }).reduce((sum, sav) => sum + sav.amount, 0);
  });

  public yearlySavingTotal = computed(() => {
    const currentYear = new Date().getFullYear();
    return this.savings()
      .filter(sav => {
        if (!sav.date) return false;
        const parts = sav.date.split('-');
        return parseInt(parts[2]) === currentYear;
      }).reduce((sum, sav) => sum + sav.amount, 0);
  });
}
