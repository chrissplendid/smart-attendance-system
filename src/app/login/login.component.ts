import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { CommunicatorService } from '../communicator.service';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,   // best practice in Angular 15+ for isolated components
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private cookieService = inject(CookieService);
  private communicatorService = inject(CommunicatorService);
  private authService = inject(AuthService);

  response: any;
  errorMessage: string = '';

  // ✅ Reactive form with validation
  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  // ✅ Method called on submit
  login(): void {
    if (this.loginForm.invalid) {
      this.errorMessage = 'Please fill all required fields correctly';
      return;
    }

    const loginData = this.loginForm.value;

    this.authService.login(this.loginForm.value.email, this.loginForm.value.password).subscribe({
      next: (res) => {
        this.response = res;

        // Example: store JWT in cookies/localStorage
        if (res?.access_token) {
          this.cookieService.set('auth_token', res.access_token);
          this.cookieService.set('role', res.role);

          // Redirect user based on role
          if (res.role === 'admin') {
            this.router.navigate(['/admin-dashboard']);
          } else if (res.role === 'staff') {
            this.router.navigate(['/staff-dashboard']);
          } else {
            this.router.navigate(['/student-dashboard']);
          }
        }
      },
      error: (err) => {
        this.errorMessage = err.error?.msg || 'Login failed. Try again.';
      },
    });
  }
}
