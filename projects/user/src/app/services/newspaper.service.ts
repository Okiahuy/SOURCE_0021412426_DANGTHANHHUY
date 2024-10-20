import { HttpClient, HttpHeaders   } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of } from 'rxjs';
import { Newspaper } from "../models/newspaper.model"; 


@Injectable({
    providedIn: 'root'
})

export class NewspaperService {
private apiUrl = 'http://localhost:8081/api/newspaper';
private apiUrlgetPapge = 'http://localhost:8081/api/newspaper/page';
  constructor(private http: HttpClient) {}

  // Lấy tất cả 
  getAllNewspapers(): Observable<Newspaper[]> {
    return this.http.get<Newspaper[]>(this.apiUrl);
  }

//lấy sản phẩm và phân trang
getNewspapersInPage(page: number, size: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrlgetPapge}?page=${page}&size=${size}`);
}



}