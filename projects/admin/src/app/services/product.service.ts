import { HttpClient, HttpHeaders   } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';
import { Product } from "../models/product.model";


@Injectable({
    providedIn: 'root'
})

export class ProductService {
private apiUrl = 'http://localhost:8081/api/products';



private apiUrlgetPapge = 'http://localhost:8081/api/products/page';

  constructor(private http: HttpClient) {}

  //lấy sản phẩm và phân trang
  getProductsInPage(page: number, size: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrlgetPapge}?page=${page}&size=${size}`);
  }

  // Lấy tất cả Product
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }
  //lấy sản phẩm theo id danh mục
  
  getProductsByCategoryId(categoryId: number) {
    return this.http.get(`http://localhost:8081/api/products/category/${categoryId}`);
  }
  // Thêm sản phẩm
  addProduct(product: FormData): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product);
  }
  // API để cập nhật sản phẩm
  updateProduct(productId: number, productData: FormData): Observable<any> {
    return this.http.put(`${this.apiUrl}/${productId}`, productData, { observe: 'response' });
  }

  // Xóa sản phẩm
  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
  // Tìm kiếm sản phẩm theo tên
  searchProducts(name: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/search?name=${name}`);
  }
}

