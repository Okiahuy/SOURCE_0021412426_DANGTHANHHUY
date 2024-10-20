import { HttpClient, HttpHeaders   } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';
import { Product } from "../models/product.model";


@Injectable({
    providedIn: 'root'
})

export class ProductService {
private apiUrl = 'http://localhost:8081/api/products';




private apiUrlQuantity = 'http://localhost:8081/api/products/quantity?limit=8';


private apiUrlgetPapge = 'http://localhost:8081/api/products/page';

  constructor(private http: HttpClient) {}

  //lấy sản phẩm và phân trang
  getProductsInPage(page: number, size: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrlgetPapge}?page=${page}&size=${size}`);
  }

  // Lấy Product theo so luong
  getProductByQuantity(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrlQuantity);
  }

  // Lấy tất cả Product 
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }
//lấy sản phẩm theo id 
  getProductsById(productId: number) {
    return this.http.get<Product>(`http://localhost:8081/api/products/${productId}`);
  }
  //lấy sản phẩm theo id danh mục
  getProductsByCategoryId(categoryId: number): Observable<any[]>{
    return this.http.get<any[]>(`http://localhost:8081/api/products/category/${categoryId}`);
  }
  getProductsByBrandId(brandID: number): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:8081/api/products/brand/${brandID}`);
  }

  // Thêm sản phẩm
  // addProduct(product: FormData): Observable<Product> {
  //   return this.http.post<Product>(this.apiUrl, product);
  // }
//////////////////////////////////////////////////////////////////////////////
  addProduct(productData: FormData): Observable<any> {
    const headers = new HttpHeaders();
    return this.http.post(this.apiUrl, productData, { headers });
  }
//////////////////////////////////////////////////////////////////////////////
  // Cập nhật sản phẩm
  updateProduct(product: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${product.productID}`, product);
  }

  // Xóa sản phẩm
  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
  // Tìm kiếm sản phẩm theo tên
  searchProducts(name: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/search?name=${name}`);
  }
  
  getAverageRating(productID: number): Observable<number> {
    return this.http.get<number>(`http://localhost:8081/api/reviews/average-rating/${productID}`);
  }
  

}

