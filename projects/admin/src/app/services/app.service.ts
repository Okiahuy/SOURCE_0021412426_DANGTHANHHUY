import { HttpClient, HttpHeaders   } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

const api = 'http://localhost:3000/api';

@Injectable({
    providedIn: 'root'
})

export class AppService {
    private apiUrl = 'http://localhost:8081/api/users';

  constructor(private http: HttpClient) {}

  // Lấy tất cả người dùng
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  // Thêm người dùng
  addUser(user: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, user, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  // // Cập nhật người dùng
  // updateUser(user: User): Observable<User> {
  //   return this.http.put<User>(`${this.apiUrl}/${user.id}`, user, {
  //     headers: new HttpHeaders({
  //       'Content-Type': 'application/json'
  //     })
  //   });
  // }

  // Xóa người dùng
  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

