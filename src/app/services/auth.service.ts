import { Injectable, signal, inject } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from '@angular/fire/auth';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth = inject(Auth);
  private userSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.userSubject.asObservable();
  
  // Signals for easy UI access
  public userSignal = signal<User | null>(null);
  public isLoading = signal(false);
  public isAuthReady = signal(false);

  constructor() {
    onAuthStateChanged(this.auth, (user) => {
      this.userSubject.next(user);
      this.userSignal.set(user);
      this.isAuthReady.set(true);
    });
  }

  async signup(email: string, password: string): Promise<any> {
    this.isLoading.set(true);
    try {
      const result = await createUserWithEmailAndPassword(this.auth, email, password);
      // Manually update state immediately to prevent race conditions during redirect
      this.userSubject.next(result.user);
      this.userSignal.set(result.user);
      return result;
    } finally {
      this.isLoading.set(false);
    }
  }

  async login(email: string, password: string): Promise<any> {
    this.isLoading.set(true);
    try {
      const result = await signInWithEmailAndPassword(this.auth, email, password);
      // Manually update state immediately to prevent race conditions during redirect
      this.userSubject.next(result.user);
      this.userSignal.set(result.user);
      return result;
    } finally {
      this.isLoading.set(false);
    }
  }

  async logout(): Promise<void> {
    this.isLoading.set(true);
    try {
      await signOut(this.auth);
    } finally {
      this.isLoading.set(false);
    }
  }

  getUserId(): string | null {
    return this.auth.currentUser?.uid || null;
  }

  get isAuthenticated(): boolean {
    return !!this.auth.currentUser;
  }
}
