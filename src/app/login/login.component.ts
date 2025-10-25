import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  Validators,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { CommunicatorService } from '../communicator.service';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true, // best practice in Angular 15+ for isolated components
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

    const { email, password } = this.loginForm.value;

    this.communicatorService.login(email, password).subscribe({
      next: (res) => {
        this.response = res;

        // ✅ Only use refresh_token & user data from response
        if (res?.user) {
          this.authService.setTokens(
            res.access_token_cookie,
            res.refresh_token_cookie
          );
          this.cookieService.set('role', res.user.role);
          this.authService.setUser(res.user);

          if (res.user.role === 'ADMIN') {
            this.router.navigate(['/admin-dashboard']);
          } else if (res.user.role === 'STAFF') {
            this.router.navigate(['/staff-dashboard']);
          } else {
            alert('Unknown role. Contact support.');
            this.router.navigate(['/login']);
          }
        }
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Login failed. Try again.';
      },
    });
  }
}
