import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class LogoutGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.auth.isLoggedIn()) {
      const role = this.auth.getRole();
      if (role === 'ADMIN') {
        this.router.navigate(['/admin-dashboard']);
      } else if (role === 'STAFF') {
        this.router.navigate(['/staff-dashboard']);
      } else {
        this.router.navigate(['/']);
      }
      return false;
    }
    return true;
  }
}