import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { Payment } from '../models/payment.model';
@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = 'http://localhost:8081/api/payments'; // Đường dẫn API 

  private apiUrlOrder = 'http://localhost:8081/api/orders'; // Đường dẫn API 


  constructor(private http: HttpClient) {}

  // Lấy danh mục theo ID
  getPaymentById(payment: number) {
    return this.http.get(`${this.apiUrl}/${payment}`);
  }
  // Lấy tất cả danh mục
  getAllBrand(): Observable<Payment[]> {
    return this.http.get<Payment[]>(this.apiUrl);
  }
  //thêm danh mục
  addPayment(payment: any): Observable<any> {
    return this.http.post(this.apiUrl, payment);
  }
  //CẬP NHẬT DANH MỤC
  updatePayment(payment: Payment): Observable<any> {
    return this.http.put(`${this.apiUrl}/${payment.paymentID}`, payment);
  }
  //XÓA DANH MỤC THEO ID
  deletePayment(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  updateStatus(orderID: number, status: number): Observable<HttpResponse<any>> {
    const updatedOrder = { status };  // Gửi trạng thái mới
    return this.http.put(`${this.apiUrlOrder}/${orderID}`, updatedOrder, { observe: 'response' });
  }
  

}

