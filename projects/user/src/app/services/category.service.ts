import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Category } from '../models/category.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class CategoryService {
  
  private apiUrl = 'http://localhost:8081/api/categories'; // Đường dẫn API danh mục

  constructor(private http: HttpClient) {}

  // Lấy danh mục theo ID
  getCategoryById(categoryId: number) {
    return this.http.get(`${this.apiUrl}/${categoryId}`);
  }
  // Lấy tất cả danh mục
  getAllCate(): Observable<Category[]> {
    return this.http.get<Category[]>(this.apiUrl);
  }
  //thêm danh mục
  addCategory(category: any): Observable<any> {
    return this.http.post(this.apiUrl, category);
  }
  //CẬP NHẬT DANH MỤC
  updateCategory(category: Category): Observable<any> {
    return this.http.put(`${this.apiUrl}/${category.categoryID}`, category);
  }
  //XÓA DANH MỤC THEO ID
  deleteCategory(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
  //TÌM KIẾM DANH MỤC THEO TÊN
  searchCategoryByName(name: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/search?name=${name}`);
  }
  //phan trang
  getCategoriesByPage(page: number, size: number): Observable<any> {
    return this.http.get(`${this.apiUrl}?page=${page}&size=${size}`);
  }

}
