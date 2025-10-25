import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CommunicatorService {
  // private readonly apiUrl = 'http://localhost:5000/api'; // Flask backend local URL
  private readonly apiUrl = 'https://attendance.yonnegroup.co/smart-attendance-backend/api';

  constructor(private http: HttpClient) {}

  /** 🔑 Login and store JWT in HttpOnly cookie */
  login(email: string, password: string): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/auth/login`,
      { email, password },
      { withCredentials: true } // ✅ allow cookie exchange
    );
  }

  /** 👤 Enroll biometric data */
  enrollBiometric(payload: any): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/biometrics/enroll`,
      payload,
      { withCredentials: true } // ✅ send cookies with request
    );
  }

  /** 🕒 Sign attendance */
  async signInAttendance(payload: any): Promise<any> {
    return firstValueFrom(
      this.http.post(
        `${this.apiUrl}/attendance/signin`,
        payload,
        { withCredentials: true } // ✅ cookie authentication
      )
    );
  }
}
