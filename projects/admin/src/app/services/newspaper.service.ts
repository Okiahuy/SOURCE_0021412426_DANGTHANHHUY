import { HttpClient, HttpHeaders   } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of } from 'rxjs';
import { Newspaper } from "../models/newspaper.model"; 


@Injectable({
    providedIn: 'root'
})

export class NewspaperService {
private apiUrl = 'http://localhost:8081/api/newspaper';

  constructor(private http: HttpClient) {}

  // Lấy tất cả 
  getAllNewspapers(): Observable<Newspaper[]> {
    return this.http.get<Newspaper[]>(this.apiUrl);
  }
  //lấ theo id danh mục
  getNewspaperById(newspaperId: number) {
    return this.http.get(`http://localhost:8081/api/newspaper/${newspaperId}`);
  }
  // Thêm 
  addNewspaper(newspaper: FormData): Observable<Newspaper> {
    return this.http.post<Newspaper>(this.apiUrl, newspaper);
  }
  // API để cập nhật
  updateNewspaper(Id: number, newspaperData: FormData): Observable<any> {
    return this.http.put(`${this.apiUrl}/${Id}`, newspaperData, { observe: 'response' });
  }
  // Xóa 
  deleteNewspaper(id: number): Observable<any> {
    if (!id) {
      console.error('ID không hợp lệ:', id);
      return of('ID không hợp lệ');  // Trả về một Observable để tránh lỗi
    }
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
  
}

