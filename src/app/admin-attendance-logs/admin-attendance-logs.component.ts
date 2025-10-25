import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AttendanceService,   StaffAttendanceRecord } from '../services/attendance.service';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-admin-attendance-logs',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxPaginationModule],
  templateUrl: './admin-attendance-logs.component.html',
  styleUrls: ['./admin-attendance-logs.component.css']
})
export class AdminAttendanceLogsComponent implements OnInit {
  records: StaffAttendanceRecord[] = [];
  filteredRecords: StaffAttendanceRecord[] = [];
  loading = false;
  error: string | null = null;

  // Filters
  filterStartDate: string = '';
  filterEndDate: string = '';
  filterRole: string = '';
  filterDepartment: string = '';
  departments: string[] = ['IT', 'HR', 'Cybersecurity', 'Networking', 'AI Engineering', 'Data Analysis'];

  // Analytics
  absenteeCount = 0;
  averageCheckinTime: string = '--:--';
  itemsPerPage: number = 10;
  P1: number = 1; // Pagination for attendance records

  constructor(private attendanceService: AttendanceService) {}

  ngOnInit(): void {
    this.loadAllAttendance();
  }

  loadAllAttendance(): void {
    this.loading = true;
    this.error = null;

    this.attendanceService.getAllStaffAttendance().subscribe({
      next: (res) => {
        // Map backend fields correctly
        this.records = res.data.map(r => ({
          ...r,
        }));

        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Failed to load attendance records';
        this.loading = false;
      }
    });
  }

 applyFilters(): void {
  this.filteredRecords = this.records.filter(r => {
    let match = true;

    // Filter by role
    if (this.filterRole) match = match && !!(r.user_role === this.filterRole);

    // Filter by department
    if (this.filterDepartment) match = match && !!(r.department === this.filterDepartment);

    // Filter by date range
    if (this.filterStartDate) match = match && !!(r.time_in && new Date(r.time_in) >= new Date(this.filterStartDate));
    if (this.filterEndDate) match = match && !!(r.time_in && new Date(r.time_in) <= new Date(this.filterEndDate));

    return match;
  });

  this.computeAnalytics();
}


  private computeAnalytics(): void {
    // Absentees: records with no time_in
    this.absenteeCount = this.filteredRecords.filter(r => !r.time_in).length;

    // Average check-in time
    const checkins = this.filteredRecords
      .filter(r => r.time_in)
      .map(r => new Date(r.time_in!).getTime());

    if (checkins.length) {
      const avg = checkins.reduce((a, b) => a + b, 0) / checkins.length;
      const d = new Date(avg);
      this.averageCheckinTime = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      this.averageCheckinTime = '--:--';
    }
  }

  // Placeholder export functions
  exportCSV(): void {
    console.log('Export CSV clicked');
  }

  exportPDF(): void {
    console.log('Export PDF clicked');
  }

  printTable(): void {
    window.print();
  }
}
