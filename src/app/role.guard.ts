import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate, CanActivateChild {
  constructor(private auth: AuthService, private router: Router) {}

  private checkAccess(expectedRole: string | undefined) : boolean {
    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/']);
      return false;
    }

    const userRole = this.auth.getRole();
    if (expectedRole && userRole !== expectedRole) {
      // Redirect to the appropriate dashboard based on role
      if (userRole === 'ADMIN') {
        this.router.navigate(['/admin-dashboard']);
      } else if (userRole === 'STAFF') {
        this.router.navigate(['/staff-dashboard']);
      } else {
        this.router.navigate(['/']);
      }
      return false;
    }
    return true;
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.checkAccess(route.data['role']);
  }

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.checkAccess(childRoute.data['role'] || childRoute.parent?.data['role']);
  }
}