import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Color } from '../models/color.model'; 
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ColorService {
  
  private apiUrl = 'http://localhost:8081/api/colors'; // Đường dẫn API danh mục

  constructor(private http: HttpClient) {}

  // Lấy danh mục theo ID
  getColorById(colorId: number) {
    return this.http.get(`${this.apiUrl}/${colorId}`);
  }
  // Lấy tất cả danh mục
  getAllColor(): Observable<Color[]> {
    return this.http.get<Color[]>(this.apiUrl);
  }
  //thêm danh mục
  addColor(color: any): Observable<any> {
    return this.http.post(this.apiUrl, color);
  }
  //CẬP NHẬT DANH MỤC
  updateColor(color: Color): Observable<any> {
    return this.http.put(`${this.apiUrl}/${color.colorID}`, color);
  }
  //XÓA DANH MỤC THEO ID
  deleteColor(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
  //TÌM KIẾM DANH MỤC THEO TÊN
  searchColorByName(name: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/search?name=${name}`);
  }


}