import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Brand } from '../models/brand.model'; 
import { catchError, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BrandService {
  private apiUrl = 'http://localhost:8081/api/brands'; // Đường dẫn API 

  constructor(private http: HttpClient) {}

  // Lấy danh mục theo ID
  getBrandById(brand: number) {
    return this.http.get(`${this.apiUrl}/${brand}`);
  }
  // Lấy tất cả danh mục
  getAllBrand(): Observable<Brand[]> {
    return this.http.get<Brand[]>(this.apiUrl);
  }
  //thêm danh mục
  addBrand(brand: any): Observable<any> {
    return this.http.post(this.apiUrl, brand);
  }
  //CẬP NHẬT DANH MỤC
  updateBrand(brand: Brand): Observable<any> {
    return this.http.put(`${this.apiUrl}/${brand.brandID}`, brand);
  }
  //XÓA DANH MỤC THEO ID
  deleteBrand(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
  /// TÌM KIẾM DANH MỤC THEO TÊN
searchBrandByName(name: string): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/search?name=${name}`).pipe(
    catchError(this.handleError<any[]>('searchBrandByName', []))
  );
}

// Error handling method
private handleError<T>(operation = 'operation', result?: T) {
  return (error: any): Observable<T> => {
    console.error(`${operation} failed: ${error.message}`);
    return of(result as T);
  };
}


}
