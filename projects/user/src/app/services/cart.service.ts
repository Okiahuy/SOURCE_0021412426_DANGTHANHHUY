import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private baseUrl = 'http://localhost:8081/api/carts'; // Địa chỉ base của API

  private apiUrl = 'http://localhost:8081/api/orders'; // Địa chỉ API

  constructor(private http: HttpClient) { }

  // Sử dụng BehaviorSubject để quản lý số lượng sản phẩm
  private cartCountSubject = new BehaviorSubject<number>(0);
  cartCount$ = this.cartCountSubject.asObservable(); // Observable để các component subscribe

  // Lấy số lượng sản phẩm từ API
  loadCartCount(userID: number): void {
    const url = `${this.baseUrl}/count/${userID}`;
    this.http.get<number>(url).subscribe((count) => {
      this.cartCountSubject.next(count); // Cập nhật giá trị mới cho BehaviorSubject
    });
  }

  // Phương thức để thêm sản phẩm vào giỏ hàng
  addToCart(userID: number, productID: number, price: number): Observable<HttpResponse<any>> {
    const url = `${this.baseUrl}/addcart`;
    const params = {
      userID: userID.toString(),
      productID: productID.toString(),
      price: price.toString()
    };
    this.loadCartCount(userID);
    // Gửi request POST với các tham số userID, productID và price
    return this.http.post(url, {}, { params, observe: 'response' });
  }

  // Phương thức để lấy giỏ hàng theo userID
  getCartByUserID(userID: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/user/${userID}`);
  }
  updateCart(cartId: number, quantity: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/${cartId}`, { quantity });
  }

  deleteCart(cartId: number, userID: number): Observable<any> {
    this.loadCartCount(userID);
    return this.http.delete(`${this.baseUrl}/${cartId}`);
  }

  // Hàm xóa đơn hàng theo ID
  deleteOrder(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  processPayment(orderRequest: any): Observable<HttpResponse<any>> {
    return this.http.post('http://localhost:8081/api/orders/buy', orderRequest, {observe: 'response'});
  }


  // Gọi API đếm số lượng cart theo userID
  getCartCountByUserId(userID: number): Observable<number> {
    const url = `${this.baseUrl}/count/${userID}`;
    return this.http.get<number>(url);
  }
  

}
