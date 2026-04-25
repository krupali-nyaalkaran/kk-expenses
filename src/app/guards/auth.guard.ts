import { Injectable, inject } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { map, take, tap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  private authService = inject(AuthService);
  private router = inject(Router);

  constructor() {}

  canActivate(): Observable<boolean> {
    return new Observable<boolean>(observer => {
      // Use a timer or interval to check for initialization if signals aren't available in this context
      // But better: use toObservable for the signal or just pipe from currentUser$ but filter out undefined
      
      const checkAuth = () => {
        if (this.authService.isAuthReady()) {
          const isAuthenticated = this.authService.isAuthenticated;
          if (!isAuthenticated) {
            this.router.navigate(['/login']);
            observer.next(false);
          } else {
            observer.next(true);
          }
          observer.complete();
        } else {
          // Check again in 50ms if not ready
          setTimeout(checkAuth, 50);
        }
      };

      checkAuth();
    });
  }
}
