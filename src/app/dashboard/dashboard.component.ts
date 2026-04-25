import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { Chart, registerables } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

Chart.register(...registerables);
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MAT_DATE_FORMATS, MatDateFormats, NativeDateModule, MAT_DATE_LOCALE, NativeDateAdapter, DateAdapter } from '@angular/material/core';
import { AuthService } from '../services/auth.service';
import { ExpenseService, Expense } from '../services/expense.service';
import { AiChatComponent } from '../shared/ai-chat/ai-chat.component';

// Custom adapter that always shows DD/MM/YYYY
class DdMmYyyyDateAdapter extends NativeDateAdapter {
  override format(date: Date, displayFormat: any): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }
}

export const MY_DATE_FORMATS: MatDateFormats = {
  parse: {
    dateInput: { month: 'short', year: 'numeric', day: 'numeric' },
  },
  display: {
    dateInput: { day: '2-digit', month: '2-digit', year: 'numeric' },
    monthYearLabel: { year: 'numeric', month: 'short' },
    dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
    monthYearA11yLabel: { year: 'numeric', month: 'long' },
  }
};

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatMenuModule,
    MatSelectModule,
    MatTabsModule,
    BaseChartDirective,
    AiChatComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: 'en-IN' },
    { provide: DateAdapter, useClass: DdMmYyyyDateAdapter }
  ]
})
export class DashboardComponent implements OnInit {
  private fb = inject(FormBuilder);
  public authService = inject(AuthService);
  public expenseService = inject(ExpenseService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  expenseForm: FormGroup;
  selectedDate = signal<Date>(new Date());
  viewDate = signal<Date>(new Date());
  selectedYear = signal<number>(new Date().getFullYear());
  availableYears = signal<number[]>([2020, 2021, 2022, 2023, 2024, 2025, 2026]);
  monthDays = signal<{ dayNum: string, dayName: string, date: Date }[]>([]);
  displayedColumns: string[] = ['name', 'amount', 'date', 'actions'];
  editingId = signal<string | null>(null);
  activeTabIndex = signal<number>(0);
  
  monthlyBudget = this.expenseService.budget;
  remainingBudget = computed(() => this.monthlyBudget() - this.expenseService.monthlyTotal());
  
  showBudgetPopup = signal<boolean>(false);
  budgetInputValue = signal<number>(0);

  private formatDate(date: Date): string {
    const d = new Date(date);
    const day = '' + d.getDate();
    const month = '' + (d.getMonth() + 1);
    const year = d.getFullYear();
    return [day.padStart(2, '0'), month.padStart(2, '0'), year].join('-');
  }

  constructor() {
    this.expenseForm = this.fb.group({
      name: ['', Validators.required],
      amount: ['', [Validators.required]],
      date: [new Date(), Validators.required]
    });
  }

  ngOnInit(): void {
    this.generateMonthDays();
  }

  editBudget(): void {
    this.budgetInputValue.set(this.monthlyBudget());
    this.showBudgetPopup.set(true);
  }

  saveBudget(): void {
    const val = this.budgetInputValue();
    if (!isNaN(Number(val)) && val >= 0) {
      this.expenseService.setBudget(Number(val));
      this.showBudgetPopup.set(false);
    }
  }

  closeBudgetPopup(): void {
    this.showBudgetPopup.set(false);
  }

  get monthLabel(): string {
    return this.viewDate().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  }

  private generateMonthDays(): void {
    const viewDate = this.viewDate();
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days: { dayNum: string, dayName: string, date: Date }[] = [];

    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      days.push({
        dayNum: i.toString().padStart(2, '0'),
        dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
        date: date
      });
    }
    this.monthDays.set(days);
  }

  changeMonth(delta: number): void {
    const current = this.viewDate();
    const newDate = new Date(current.getFullYear(), current.getMonth() + delta, 1);
    this.viewDate.set(newDate);
    this.selectedDate.set(newDate);
    this.generateMonthDays();
  }

  selectDate(date: Date): void {
    this.selectedDate.set(date);
  }

  isSameDate(d1: Date, d2: Date): boolean {
    return d1.getDate() === d2.getDate() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getFullYear() === d2.getFullYear();
  }

  // Computed based on selected date (reverted to daily focus for timeline)
  filteredExpenses = computed(() => {
    const targetDate = this.selectedDate();
    const targetDateStr = this.formatDate(targetDate);
    
    return this.expenseService.expenses().filter((exp: Expense) => exp.date === targetDateStr)
      .sort((a: Expense, b: Expense) => b.createdAt - a.createdAt);
  });

  dailyTotalAmount = computed(() => {
    return this.filteredExpenses().reduce((sum, exp) => sum + exp.amount, 0);
  });

  // Monthly Chart Data Logic
  chartData = computed(() => {
    const monthSummary = this.monthlySummaries();
    const lables = monthSummary.map(m => m.month);
    const totals = monthSummary.map(m => m.total);
    
    // For specific Daily Chart in a Month (X: Day, Y: Amount)
    const year = this.selectedYear();
    const month = this.viewDate().getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const dailyLabels = Array.from({ length: daysInMonth }, (_, i) => (i + 1).toString());
    const dailyTotals = new Array(daysInMonth).fill(0);
    
    this.expenseService.expenses().forEach((exp: Expense) => {
      const parts = exp.date.split('-');
      const d = parseInt(parts[0]);
      const m = parseInt(parts[1]) - 1;
      const y = parseInt(parts[2]);
      if (m === month && y === year) {
        dailyTotals[d - 1] += exp.amount;
      }
    });

    // Calculate Rolling Average
    let runningSum = 0;
    const rollingAverage = dailyTotals.map((val, i) => {
      runningSum += val;
      return runningSum / (i + 1);
    });

    return {
      labels: dailyLabels,
      datasets: [
        {
          type: 'bar' as const,
          data: dailyTotals,
          label: 'Daily Spending',
          backgroundColor: '#764ba2',
          borderRadius: 4,
          barPercentage: 0.6,
          order: 2
        },
        {
          type: 'line' as const,
          data: rollingAverage,
          label: 'Average Trend',
          borderColor: '#ff6a95',
          backgroundColor: 'transparent',
          borderWidth: 2,
          pointRadius: 3,
          tension: 0.4,
          order: 1
        }
      ]
    };
  });

  chartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { 
        display: true,
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: { size: 12, weight: '500' }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#1e293b',
        bodyColor: '#1e293b',
        borderColor: 'rgba(118, 75, 162, 0.2)',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 12,
        displayColors: true,
        callbacks: {
          label: (ctx: any) => `${ctx.dataset.label}: ₹${ctx.raw.toFixed(2)}`
        }
      }
    },
    scales: {
      y: {
        display: true,
        grid: { color: 'rgba(0,0,0,0.03)' },
        border: { display: false },
        ticks: { 
          color: '#94a3b8',
          font: { size: 10 }
        }
      },
      x: {
        display: true,
        grid: { display: false },
        border: { display: false },
        ticks: { 
          color: '#64748b',
          font: { size: 10, weight: '600' }
        }
      }
    }
  };

  // Yearly Monthly Summary logic 
  monthlySummaries = computed(() => {
    const year = this.selectedYear();
    const allExpenses = this.expenseService.expenses();
    const summaries = [];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    for (let i = 0; i < 12; i++) {
      const monthTotal = allExpenses.filter(exp => {
        const parts = exp.date.split('-');
        return parseInt(parts[2]) === year && parseInt(parts[1]) === (i + 1);
      }).reduce((acc, exp) => acc + exp.amount, 0);
      
      summaries.push({ month: monthNames[i], monthIdx: i, total: monthTotal });
    }
    return summaries;
  });

  onYearChange(year: number): void {
    this.selectedYear.set(year);
    const current = this.viewDate();
    const newDate = new Date(year, current.getMonth(), 1);
    this.viewDate.set(newDate);
    this.selectedDate.set(newDate);
    this.generateMonthDays();
  }

  selectMonth(idx: number): void {
    const year = this.selectedYear();
    const newDate = new Date(year, idx, 1);
    this.viewDate.set(newDate);
    this.selectedDate.set(newDate);
    this.generateMonthDays();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onDateChange(event: any): void {
    if (event.value) {
      this.selectedDate.set(event.value);
    }
  }

  async handleSubmit(): Promise<void> {
    if (this.expenseForm.valid) {
      const { name, amount, date } = this.expenseForm.value;
      const dateStr = this.formatDate(date);

      try {
        if (this.editingId()) {
          await this.expenseService.updateExpense(this.editingId()!, name, amount, dateStr);
          this.snackBar.open('Expense updated!', 'Close', { duration: 3000 });
          this.editingId.set(null);
        } else {
          await this.expenseService.addExpense(name, amount, dateStr);
          this.snackBar.open('Expense added!', 'Close', { duration: 3000 });
        }
        this.expenseForm.reset();
        this.expenseForm.patchValue({ date: new Date() });
        this.expenseForm.markAsPristine();
        this.expenseForm.markAsUntouched();
        Object.keys(this.expenseForm.controls).forEach(key => {
          this.expenseForm.get(key)?.setErrors(null);
        });
        this.activeTabIndex.set(0);
      } catch (error: any) {
        this.snackBar.open(`Error: ${error.message}`, 'Close', { duration: 5000 });
      }
    } else {
      // Show error feedback if form is invalid
      this.expenseForm.markAllAsTouched();
      this.snackBar.open('Please fill all required fields correctly', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
    }
  }

  editExpense(expense: Expense): void {
    const parts = expense.date.split('-');
    const dateObj = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
    
    this.editingId.set(expense.id);
    this.expenseForm.patchValue({
      name: expense.name,
      amount: expense.amount,
      date: dateObj
    });
    this.activeTabIndex.set(1);
    // Scroll to top to show form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async deleteExpense(id: string): Promise<void> {
    if (confirm('Are you sure you want to delete this expense?')) {
      try {
        await this.expenseService.deleteExpense(id);
        this.snackBar.open('Expense deleted!', 'Close', { duration: 3000 });
      } catch (error: any) {
        this.snackBar.open(`Error: ${error.message}`, 'Close', { duration: 5000 });
      }
    }
  }

  cancelEdit(): void {
    this.editingId.set(null);
    this.expenseForm.reset({ date: new Date() });
    
    // Auto-switch to Table tab
    this.activeTabIndex.set(0);
  }

  logout(): void {
    this.authService.logout().then(() => {
      this.router.navigate(['/login']);
      this.snackBar.open('Logged out successfully', 'Close', { duration: 3000 });
    });
  }

  exportToPDF(type: 'daily' | 'weekly' | 'monthly' | 'yearly'): void {
    const doc = new jsPDF();
    const now = new Date();
    const userEmail = (this.authService.currentUser$ as any).value?.email || 'User';

    let dataToExport: Expense[] = [];
    let title = '';

    // Data filtering logic
    if (type === 'daily') {
      const targetStr = this.formatDate(this.selectedDate());
      dataToExport = this.expenseService.expenses().filter((exp: Expense) => exp.date === targetStr);
      title = `Daily Report - ${targetStr}`;
    } else if (type === 'weekly') {
      const weekAgo = new Date();
      weekAgo.setDate(now.getDate() - 7);
      dataToExport = this.expenseService.expenses().filter((exp: Expense) => {
        const parts = exp.date.split('-');
        const expDate = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
        return expDate >= weekAgo && expDate <= now;
      });
      title = `Weekly Report (${this.formatDate(weekAgo)} to ${this.formatDate(now)})`;
    } else if (type === 'monthly') {
      const month = this.selectedDate().getMonth();
      const year = this.selectedDate().getFullYear();
      dataToExport = this.expenseService.expenses().filter((exp: Expense) => {
        const parts = exp.date.split('-');
        const m = parseInt(parts[1]) - 1;
        const y = parseInt(parts[2]);
        return m === month && y === year;
      });
      title = `Monthly Report - ${this.selectedDate().toLocaleString('en-US', { month: 'long', year: 'numeric' })}`;
    } else if (type === 'yearly') {
      const year = this.selectedYear();
      dataToExport = this.expenseService.expenses().filter((exp: Expense) => {
        const parts = exp.date.split('-');
        return parseInt(parts[2]) === year;
      });
      title = `Yearly Report - ${year}`;
    }

    if (dataToExport.length === 0) {
      this.snackBar.open('No data found for this period', 'Close', { duration: 3000 });
      return;
    }

    // Grouping Logic
    const grouped = dataToExport.reduce((groups: any, exp) => {
      const date = exp.date;
      if (!groups[date]) groups[date] = [];
      groups[date].push(exp);
      return groups;
    }, {});

    const sortedDates = Object.keys(grouped).sort((a, b) => {
      const pA = a.split('-'); const pB = b.split('-');
      return new Date(parseInt(pA[2]), parseInt(pA[1]) - 1, parseInt(pA[0])).getTime() -
             new Date(parseInt(pB[2]), parseInt(pB[1]) - 1, parseInt(pB[0])).getTime();
    });

    const tableRows: any[] = [];
    const colors = [
      [245, 240, 255], // Soft Purple
      [240, 250, 255], // Soft Blue
      [255, 240, 245], // Soft Rose
      [240, 255, 250], // Soft Mint
      [255, 252, 240]  // Soft Gold
    ];
    
    sortedDates.forEach((dateStr, idx) => {
      const parts = dateStr.split('-');
      const d = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
      const dayName = d.toLocaleDateString('en-US', { weekday: 'long' });
      
      // Section Header
      tableRows.push([{ content: `${dateStr} (${dayName})`, colSpan: 3, styles: { fillColor: [118, 75, 162], textColor: 255, fontStyle: 'bold' } }]);
      
      let dayTotal = 0;
      grouped[dateStr].forEach((exp: Expense) => {
        tableRows.push([exp.date, exp.name, `Rs. ${exp.amount}`]);
        dayTotal += exp.amount;
      });

      // Day Sub-total
      tableRows.push([{ content: `Sub-total for ${dateStr}: Rs. ${dayTotal.toFixed(2)}`, colSpan: 3, styles: { fillColor: colors[idx % colors.length], fontStyle: 'bold', halign: 'right' } }]);
    });

    doc.setFontSize(22);
    doc.setTextColor(118, 75, 162);
    doc.text('Expense Report', 14, 20);
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(title, 14, 28);
    doc.text(`User: ${userEmail}`, 14, 34);

    autoTable(doc, {
      startY: 40,
      head: [['Date', 'Description', 'Amount']],
      body: tableRows,
      theme: 'grid',
      headStyles: { fillColor: [118, 75, 162], textColor: 255 },
      styles: { fontSize: 9 },
      margin: { top: 40 }
    });

    const grandTotal = dataToExport.reduce((sum, exp) => sum + exp.amount, 0);
    const finalY = (doc as any).lastAutoTable.finalY + 15;
    
    doc.setDrawColor(118, 75, 162);
    doc.setLineWidth(0.5);
    doc.line(14, finalY - 5, 196, finalY - 5);
    doc.setFontSize(14);
    doc.setTextColor(118, 75, 162);
    doc.text(`GRAND TOTAL: Rs. ${grandTotal.toFixed(2)}`, 14, finalY);

    doc.save(`Expenses_${type}_${new Date().getTime()}.pdf`);
    this.snackBar.open(`${type.charAt(0).toUpperCase() + type.slice(1)} PDF Downloaded`, 'Close', { duration: 3000 });
  }
}
