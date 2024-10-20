// dashboard.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  private apiUrl = 'http://localhost:8081/api/dashboard';

  constructor(private http: HttpClient) {}

  // Phương thức lấy tổng hợp thông tin
  getSummary(): Observable<any> {
    return this.http.get(`${this.apiUrl}/summary`);
  }
}
