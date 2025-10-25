import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AttendanceService, SimpleStudent } from '../services/attendance.service';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../user.service';

@Component({
  selector: 'app-admin-student-manual-attendance',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-student-manual-attendance.component.html',
  styleUrl: './admin-student-manual-attendance.component.css'
})
export class AdminStudentManualAttendanceComponent implements OnInit {

  students: SimpleStudent[] = [];
  form: FormGroup;
  loadingUsers = false;
  submitting = false;
  feedback: { type: 'success'|'error'|'info', message: string } | null = null;

  constructor(private attendance: AttendanceService, private fb: FormBuilder, private userService: UserService) {
    this.form = this.fb.group({
      student_id: [null, Validators.required],
      // optional: timestamp ISO string
      time: [null],
      action: ['sign_in', Validators.required] // 'sign_in' or 'sign_out'
    });
  }

  ngOnInit(): void {
    this.fetchStudents();
  }

  fetchStudents() {
    this.loadingUsers = true;
    this.attendance.listStudents().subscribe({
      next: (res) => {
        this.students = res.students || [];
        this.loadingUsers = false;
        console.log(res);
      },
      error: (err) => {
        this.loadingUsers = false;
        this.feedback = { type: 'error', message: 'Failed to load students' };
      }
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      this.feedback = { type: 'error', message: 'Select a user and action.' };
      return;
    }
    this.submitting = true;
    this.feedback = null;

    const payload: any = {
      student_id: this.form.value.student_id,
      action: this.form.value.action
    };

    // If admin entered time (local), convert to ISO in UTC (server expects ISO)
    const t = this.form.value.time;
    if (t) {
      // t may be a string like "2025-09-15T09:00"; convert to ISO
      payload.timestamp = new Date(t).toISOString();
    }

    this.attendance.studentManualAction(payload).subscribe({
      next: (res: any) => {
        this.submitting = false;
        if (res && res.success) {
          this.feedback = { type: 'success', message: res.message || 'Recorded' };
        } else {
          this.feedback = { type: 'info', message: res.message || 'No action' };
        }
      },
      error: (err) => {
        this.submitting = false;
        const m = err?.error?.message || 'Server error while recording attendance';
        this.feedback = { type: 'error', message: m };
      }
    });
  }

  displayName(u: SimpleStudent) {
    return `${u.firstname} ${u.lastname} (${u.role})`;
  }
}
