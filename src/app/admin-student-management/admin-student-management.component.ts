import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, ReactiveFormsModule} from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { CommunicatorService } from '../communicator.service';
import { UserService } from '../user.service';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-admin-student-management',
  imports: [CommonModule, ReactiveFormsModule, NgxPaginationModule],
  templateUrl: './admin-student-management.component.html',
  styleUrl: './admin-student-management.component.css'
})
export class AdminStudentManagementComponent {
  private fb = inject(FormBuilder);
  private cookieService = inject(CookieService);
  private communicatorService = inject(CommunicatorService);
  private userService = inject(UserService);
  response: any;
  errorMessage: string = '';
  itemsPerPage: number = 10;
  P1: number = 1; // Pagination for student records

  ngOnInit() {
    this.loadStudents();
  }

  private loadStudents() {
    this.userService.getStudents().subscribe({
      next: (students) => {
        this.students = students;
      },
      error: (error) => {
        if (error.status === 401) {
          this.errorMessage = "You don't have permission to view students.";
        } else {
          this.errorMessage = "Failed to load students.";
        }
      }
    });
  }
  students: any[] = [];

  // ✅ Reactive form with validation for user management
  studentForm: FormGroup = this.fb.group({
    firstname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
    lastname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.email]],
    role: ['', Validators.required],
    department: ['', Validators.required]
  });

  enrollStudent() {
    if (this.studentForm.valid) {
      const USERDATA = this.studentForm.value;
      this.userService.enrollStudent(USERDATA).subscribe({
        next: (response) => {
          this.response = response;
          alert('Student enrolled successfully!');
          this.studentForm.reset();
          this.loadStudents(); // Refresh the student list
          this.errorMessage = '';
        },
        error: (error) => {
          this.errorMessage = error.message;
        }
      });
    }
  }

}
