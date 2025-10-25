import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, ReactiveFormsModule} from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { CommunicatorService } from '../communicator.service';
import { UserService } from '../user.service';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-admin-user-management',
  imports: [CommonModule, ReactiveFormsModule, NgxPaginationModule],
  templateUrl: './admin-user-management.component.html',
  styleUrl: './admin-user-management.component.css'
})
export class AdminUserManagementComponent implements OnInit {
  private fb = inject(FormBuilder);
  private cookieService = inject(CookieService);
  private communicatorService = inject(CommunicatorService);
  private userService = inject(UserService);
  response: any;
  errorMessage: string = '';
  itemsPerPage: number = 10;
  P1: number = 1; // Pagination for user records

  ngOnInit() {
    this.loadUsers();
  }

  private loadUsers() {
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
      },
      error: (error) => {
        if (error.status === 401) {
          this.errorMessage = "You don't have permission to view users.";
        } else {
          this.errorMessage = "Failed to load users.";
        }
      }
    });
  }
  users: any[] = [];

  // ✅ Reactive form with validation for user management
  userForm: FormGroup = this.fb.group({
    firstname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
    lastname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(100)]],
    role: ['', Validators.required],
    department: ['', Validators.required]
  });

  enrollUser() {
    if (this.userForm.valid) {
      const USERDATA = this.userForm.value;
      this.userService.enrollUser(USERDATA).subscribe({
        next: (response) => {
          this.response = response;
          alert('User enrolled successfully!');
          this.userForm.reset();
          this.loadUsers(); // Refresh the user list
          this.errorMessage = '';
        },
        error: (error) => {
          this.errorMessage = error.message;
        }
      });
    }
  }

}
