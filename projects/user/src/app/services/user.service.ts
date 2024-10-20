import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Brand } from '../models/brand.model'; 
import { catchError, Observable, of } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8081/api/users'; // Đường dẫn API 

  private apiUrlregiter = 'http://localhost:8081/api/users/register'; // Đường dẫn API 

  private apiUrlOrder = 'http://localhost:8081/api/orders/customer'; // Đường dẫn API 

  private apiUrlOrder2 = 'http://localhost:8081/api/orders'; // Đường dẫn API 

  private apiUrlOrderDetail = 'http://localhost:8081/api/orderdetails/orderdetail'; // Đường dẫn API 

  private apiUrlreviews = 'http://localhost:8081/api/reviews';  // URL của API Spring Boot

  constructor(private http: HttpClient) {}

  //thêm danh mục
  addUser(user: any): Observable<HttpResponse<any>> {
    return this.http.post<any>(this.apiUrlregiter, user, { observe: 'response' });
  }

  //lấy người dùng
  getAllUserByID(userID: number): Observable<any> {
    return this.http.get<User>(`${this.apiUrl}/${userID}`);
  }

  // Lấy thông tin người dùng theo ID
  getUserById(userID: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${userID}`);
  }

  // Cập nhật thông tin người dùng
  updateUser(userID: number, userData: any): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${userID}`, userData);
  }

  getOrderByUserID(userID: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrlOrder}/${userID}`)
  }

  getOrderByOrderID(orderID: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrlOrder2}/${orderID}`)
  }

  getOrderDetailByOrderID(userID: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrlOrderDetail}/${userID}`)
  }

  getAllOrder(): Observable<any> {
    return this.http.get<any>(`${this.apiUrlOrder2}`)
  }
  // Hàm thêm đánh giá  startNum: number, comment: string, userID: number, productID: number
  addReview(startNum: number, comment: string, userID: number, productID: number,
    orderID: number): Observable<HttpResponse<any>> {
      const review = {
        startNum,
        comment,
        userID,
        productID,
      };
    const params = new HttpParams().set('orderID', orderID.toString());
    return this.http.post<any>('http://localhost:8081/api/reviews', review, {params});
  }

  getReviewsByProductID(productID: number): Observable<any[]> {
    const url = `http://localhost:8081/api/reviews/${productID}`;
    return this.http.get<any[]>(url);
  }

  getAverageRating(productID: number): Observable<number> {
    return this.http.get<number>(`http://localhost:8081/api/reviews/average-rating/${productID}`);
  }
  
}
