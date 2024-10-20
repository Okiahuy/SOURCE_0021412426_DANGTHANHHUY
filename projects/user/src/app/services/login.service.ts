import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class loginService {
  private apiUrl = 'http://localhost:8081/api/users/login'; // Đường dẫn API 

  constructor(private http: HttpClient) {}

  login(body: any): any {
    return this.http.post<any>(this.apiUrl, body);
  }




  
}