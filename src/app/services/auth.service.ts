import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  //private apiUrl = 'http://127.0.0.1:5000/api/auth'; // Flask backend local URL
  private apiUrl = 'https://attendance.yonnegroup.co/smart-attendance-backend/api/auth'; // Flask backend production URL

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { username, password });
  }

  register(username: string, password: string, role: string = 'student'): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, { username, password, role });
  }
}
