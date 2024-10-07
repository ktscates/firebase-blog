import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, of, catchError, map } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.authService.getCurrentUser().pipe(
      map((user) => {
        if (user) {
          return true; // User is authenticated
        } else {
          this.router.navigate(['auth']); // Redirect to login page
          return false; // User is not authenticated
        }
      }),
      catchError(() => {
        this.router.navigate(['auth']); // Redirect to login page on error
        return of(false);
      })
    );
  }
}
