// src/app/services/attendance.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface SimpleUser {
  id: number;
  uuid: string;
  firstname: string;
  lastname: string;
  role: string;
  department: string;
}

export interface SimpleStudent {
  id: number;
  uuid: string;
  firstname: string;
  lastname: string;
  role: string;
  department: string;
}


export interface StaffAttendanceRecord {
  id: number;
  user_id: number;
  first_name: string;    // instead of firstname
  last_name: string;     // instead of lastname
  user_name?: string;    // optional combined name
  user_role: string;     // instead of role
  department: string;
  time_in: string | null;
  time_out: string | null;
  status: string;
}

export interface StudentAttendanceRecord {
  id: number;
  user_id: number;
  first_name: string;    // instead of firstname
  last_name: string;     // instead of lastname
  user_name?: string;    // optional combined name
  user_role: string;     // instead of role
  department: string;
  time_in: string | null;
  time_out: string | null;
  status: string;
}


@Injectable({ providedIn: 'root' })
export class AttendanceService {
  // private base = 'http://localhost:5000/api/attendance'; // Flask backend local URL
  private base = 'https://attendance.yonnegroup.co/smart-attendance-backend/api/attendance';

  constructor(private http: HttpClient) {}

  // Staff user list for manual attendance
  listUsers(): Observable<{ success: boolean; users: SimpleUser[] }> {
    return this.http.get<{ success: boolean; users: SimpleUser[] }>(
      `${this.base}/users`,
      { withCredentials: true }
    );
  }

  // Student user list for manual attendance
  listStudents(): Observable<{ success: boolean; students: SimpleStudent[] }> {
    return this.http.get<{ success: boolean; students: SimpleStudent[] }>(
      `${this.base}/students`,
      { withCredentials: true }
    );
  }

  // Staff Manual sign-in / sign-out
  staffManualAction(payload: {
    user_id?: number;
    user_uuid?: string;
    action: 'sign_in' | 'sign_out';
    timestamp?: string;
  }): Observable<any> {
    return this.http.post(`${this.base}/manual/staff`, payload, { withCredentials: true });
  }

  // Student Manual sign-in / sign-out
  studentManualAction(payload: {
    user_id?: number;
    user_uuid?: string;
    action: 'sign_in' | 'sign_out';
    timestamp?: string;
  }): Observable<any> {
    return this.http.post(`${this.base}/manual/student`, payload, { withCredentials: true });
  }

  // Get today's attendance records for staff
  getTodayStaffAttendance(): Observable<{ success: boolean; data: StaffAttendanceRecord[] }> {
    return this.http.get<{ success: boolean; data: StaffAttendanceRecord[] }>(
      `${this.base}/today/staff`,
      { withCredentials: true }
    );
  }

  // Get today's attendance records for students
  getTodayStudentsAttendance(): Observable<{ success: boolean; data: StudentAttendanceRecord[] }> {
    return this.http.get<{ success: boolean; data: StudentAttendanceRecord[] }>(
      `${this.base}/today/students`,
      { withCredentials: true }
    );
  }

  // Get all attendance records for staff
  getAllStaffAttendance(): Observable<{ success: boolean; data: StaffAttendanceRecord[] }> {
    return this.http.get<{ success: boolean; data: StaffAttendanceRecord[] }>(
      `${this.base}/all/staff`,
      { withCredentials: true }
    );
  }

  // Get all attendance records for students
  getAllStudentsAttendance(): Observable<{ success: boolean; data: StudentAttendanceRecord[] }> {
    return this.http.get<{ success: boolean; data: StudentAttendanceRecord[] }>(
      `${this.base}/all/students`,
      { withCredentials: true }
    );
  }
}
