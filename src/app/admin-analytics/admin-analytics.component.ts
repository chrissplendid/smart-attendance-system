import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // ✅ Import FormsModule
import { AuthService } from '../auth.service';
import { UserService } from '../user.service';
import {
  AttendanceService,
  StaffAttendanceRecord,
  StudentAttendanceRecord,
} from '../services/attendance.service';
import { NgxPaginationModule } from 'ngx-pagination';

interface StatCard {
  label: string;
  value: number;
  bgClass: string;
  subText?: string;
}

@Component({
  selector: 'app-admin-analytics',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule, NgxPaginationModule], // ✅ Add FormsModule
  templateUrl: './admin-analytics.component.html',
  styleUrls: ['./admin-analytics.component.css'],
})

export class AdminAnalyticsComponent implements OnInit {
  user: any;
  users: any[] = [];
  students: any[] = [];
  staffDailyAttendance: StaffAttendanceRecord[] = [];
  studentDailyAttendance: StudentAttendanceRecord[] = [];
  errorMessage: string = '';
  attendanceError: string = '';
  attendanceDate: string = '';
  // Filters
  userSearch: string = '';
  filterRole: string = '';
  P1: number = 1; // Pagination for users
  P2: number = 1; // Pagination for students
  P3: number = 1; // Pagination for staff attendance
  P4: number = 1; // Pagination for student attendance
  itemsPerPage: number = 10; // Items per page for pagination


  // Track counts separately
  totalUsers = 0;
  totalStudents = 0;

  stats: StatCard[] = [
    {
      label: 'Total Users',
      value: 0,
      bgClass: 'bg-gradient-primary',
      subText: 'Admins, Staff, Students',
    },
    { label: 'Active Today', value: 0, bgClass: 'bg-gradient-success' },
    { label: 'Late Arrivals', value: 0, bgClass: 'bg-gradient-warning' },
    { label: 'Absentees', value: 0, bgClass: 'bg-gradient-danger' },
  ];

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private attendanceService: AttendanceService
  ) {}

  ngOnInit(): void {
    this.authService.user$.subscribe((u) => (this.user = u));
    this.loadUsers();
    this.loadStudents();
    this.loadStaffDailyAttendance();
    this.loadStudentDailyAttendance();
  }

  private loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.totalUsers = users.length;
        this.updateTotalUsers();
      },
      error: (error) => {
        this.errorMessage =
          error.status === 401
            ? "You don't have permission to view users."
            : 'Failed to load users.';
      },
    });
  }

  private loadStudents(): void {
    this.userService.getStudents().subscribe({
      next: (students) => {
        this.students = students;
        this.totalStudents = students.length;
        this.updateTotalUsers();
      },
      error: (error) => {
        this.errorMessage =
          error.status === 401
            ? "You don't have permission to view students."
            : 'Failed to load students.';
      },
    });
  }

  private updateTotalUsers(): void {
    // ✅ Combine both staff and students
    this.stats[0].value = this.totalUsers + this.totalStudents;
  }

  loadStaffDailyAttendance(): void {
    this.attendanceService.getTodayStaffAttendance().subscribe({
      next: (res) => {
        this.staffDailyAttendance = res.data.map((r) => ({
          ...r,
          user_name: r.user_name || `${r.first_name} ${r.last_name}`,
          user_role: r.user_role || r.user_role,
        }));
        this.computeAttendanceStats();
      },
      error: (err) => {
        console.error(err);
        this.attendanceError = 'Failed to load daily attendance.';
      },
    });
  }

  loadStudentDailyAttendance(): void {
    this.attendanceService.getTodayStudentsAttendance().subscribe({
      next: (res) => {
        this.studentDailyAttendance = res.data.map((r) => ({
          ...r,
          user_name: r.user_name || `${r.first_name} ${r.last_name}`,
          user_role: r.user_role || r.user_role,
        }));
        this.computeAttendanceStats();
      },
      error: (err) => {
        console.error(err);
        this.attendanceError = 'Failed to load daily attendance.';
      },
    });
  }

  private computeAttendanceStats(): void {
    // Combine both staff & students for analytics
    const allRecords = [...this.staffDailyAttendance, ...this.studentDailyAttendance];

    const activeToday = allRecords.filter((r) => r.time_in).length;
    const lateArrivals = allRecords.filter((r) => r.status === 'LATE').length;
    const absentees = allRecords.filter((r) => r.status === 'ABSENT').length;

    this.stats[1].value = activeToday;
    this.stats[2].value = lateArrivals;
    this.stats[3].value = absentees;
  }

  exportCSV(): void {
    console.log('Export CSV clicked');
  }

  exportPDF(): void {
    console.log('Export PDF clicked');
  }
}
