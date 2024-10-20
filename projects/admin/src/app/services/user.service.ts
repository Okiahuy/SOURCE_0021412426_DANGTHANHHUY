import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8081/api/users'; // Đường dẫn API 

  constructor(private http: HttpClient) {}

  //thêm danh mục
  getAllUsers(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }


}
