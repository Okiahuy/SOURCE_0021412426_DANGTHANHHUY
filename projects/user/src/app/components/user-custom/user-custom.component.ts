import { CurrencyPipe, DatePipe, isPlatformBrowser, NgFor, NgIf } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';
import { ProductService } from '../../services/product.service';
import { PaymentService } from '../../../../../admin/src/app/services/payment.service';
import { HttpResponse } from '@angular/common/http';
import { CartService } from '../../services/cart.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-custom',
  standalone: true,
  imports: [CurrencyPipe,NgIf,NgFor,DatePipe,RouterModule,ReactiveFormsModule],
  templateUrl: './user-custom.component.html',
  styleUrl: './user-custom.component.css'
})
export class UserCustomComponent implements OnInit{
  user: any[] = [];
  fullName: string | null = '';
  userID: string | null = '';
  hashedPassword: string = '';

  orderItems: any[] = [];

  Message: string | null = null;


  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService,
    private productService: ProductService,
    private paymentService: PaymentService,
    private cartService: CartService,
    @Inject(PLATFORM_ID) private platformId: object // Inject PLATFORM_ID để kiểm tra môi trường
  ) {
    
  }
  
  logout() {
    sessionStorage.removeItem('fullName');
    sessionStorage.removeItem('userID');
    this.fullName = null; // Cập nhật lại biến fullname
    this.userID = null;   // Cập nhật lại biến userId
    this.router.navigate(['/user/login-user']);
  }
  convertStringToDate(dateString: string): Date {
    const year = +dateString.substring(0, 4);
    const month = +dateString.substring(4, 6) - 1; // Tháng bắt đầu từ 0
    const day = +dateString.substring(6, 8);
    return new Date(year, month, day);
  }
  

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.fullName = sessionStorage.getItem('fullName');
      this.userID = sessionStorage.getItem('userID');
      if (this.userID) {
       this.loadorder(Number(this.userID));
      }
      if (!isNaN(Number(this.userID))) {
        // Gọi API để lấy thông tin sản phẩm
        this.userService.getUserById(Number(this.userID)).subscribe(
          data => {
            this.user = [data];
          },
          error => {
            console.error('Error fetching product details:', error);
          }
        );
      }
    }
  }

  

  loadorder(userID: number): void {
    this.userService.getOrderByUserID(Number(this.userID)).subscribe(
      (data) => {
        this.orderItems = data;
       
      },
      (error) => {
        console.error('Lỗi khi lấy giỏ hàng:', error);
      }
    );
  }
  
  showAddAlert() {
    const successAlert = document.getElementById('a');
    if (successAlert) {
      successAlert.style.display = 'block'; // Hiển thị alert
    
      // Tự động ẩn alert sau 3 giây
      setTimeout(() => {
        successAlert.style.display = 'none';
      }, 3000);
    }
    }
  updateStatus3Order(orderID: number) {
    this.paymentService.updateStatus(orderID, 3).subscribe(
      (response: HttpResponse<any>) => {
        if (response.status == 200) {  // Kiểm tra mã 200 OK
          this.Message = "Nhận hàng thành công!";
          this.showAddAlert();
          this.loadorder(Number(this.userID));
        }
      },
      (error) => {
        this.Message = "Nhận hàng thành công!";
        this.showAddAlert();
        this.loadorder(Number(this.userID));
      }
    );
  }
   // Xóa đơn hàng
 deleteOrder(id: number): void {
  if (confirm('Bạn có chắc chắn muốn xóa đơn hàng này không?')) {
    this.cartService.deleteOrder(id).subscribe(
      () => {
        alert('Đơn hàng đã được xóa thành công!');
        this.loadorder(Number(this.userID));
      },
      (error) => {
        console.error('Lỗi khi xóa đơn hàng:', error);
        this.loadorder(Number(this.userID));
      }
    );
  }
}
  updateStatus4Order(orderID: number) {
    this.paymentService.updateStatus(orderID, 4).subscribe(
      (response: HttpResponse<any>) => {
        if (response.status == 200) {  // Kiểm tra mã 200 OK
          this.Message = "Hủy thành công!";
          this.showAddAlert();
          this.loadorder(Number(this.userID));
        }
      },
      (error) => {
        this.Message = "Hủy thành công!";
        this.showAddAlert();
        this.loadorder(Number(this.userID));
      }
    );
  }


}
