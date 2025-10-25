import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
  uuid: string;
  firstname: string;
  lastname: string;
  email: string;
  role: string;
  department: string;
}

export interface Student {
  uuid: string;
  firstname: string;
  lastname: string;
  email: string;
  role: string;
  department: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  // private apiUrl = 'http://localhost:5000/api/users'; // Flask backend local URL
  private apiUrl = 'https://attendance.yonnegroup.co/smart-attendance-backend/api/users';

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/staff`, {
      withCredentials: true, // <-- send cookies
    });
  }

  getStudents(): Observable<Student[]> {
    return this.http.get<Student[]>(`${this.apiUrl}/students`, {
      withCredentials: true, // <-- send cookies
    });
  }

  enrollUser(formData: any): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/enroll/staff`, formData, {
      withCredentials: true, // <-- send cookies
    });
  }

  enrollStudent(formData: any): Observable<Student> {
    return this.http.post<Student>(`${this.apiUrl}/enroll/student`, formData, {
      withCredentials: true, // <-- send cookies
    });
  }
}
