import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommunicatorService {

  constructor(private http: HttpClient) { }

  onSubmitLoginService(formInputs:any):Observable<any> {
    return this.http.post<any>('http://127.0.0.1:8000/api/auth/login', formInputs)
  }

  onSubmitRegisterService(formInputs:any):Observable<any> {
    return this.http.post<any>('http://127.0.0.1:8000/api/auth/register', formInputs)
  }
}
