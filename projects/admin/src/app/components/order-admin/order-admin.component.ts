import { CurrencyPipe, DatePipe, isPlatformBrowser, NgFor, NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../../../../user/src/app/services/user.service'; 
import { HttpResponse } from '@angular/common/http';
import { PaymentService } from '../../services/payment.service';
import {NgxPrintModule} from 'ngx-print';
import { CartService } from '../../../../../user/src/app/services/cart.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-order-admin',
  standalone: true,
  imports: [CurrencyPipe,NgIf,NgFor,DatePipe,RouterModule,NgSwitchCase,NgSwitch,NgSwitchDefault,NgxPrintModule,FormsModule],
  templateUrl: './order-admin.component.html',
  styleUrl: './order-admin.component.css'
})
export class OrderAdminComponent implements OnInit{
  user: any[] = [];
  fullName: string | null = '';
  userID: string | null = '';
  hashedPassword: string = '';

  orderItems: any[] = [];


  Message: string | null = null;
  filteredOrders: any[] = [];  // Danh sách đơn hàng sau khi lọc

  selectedStatus: string = ''; // Trạng thái đã chọn từ select



  constructor(
    private router: Router,
    private userService: UserService,
    private paymentService: PaymentService,
    private cartService: CartService,
    @Inject(PLATFORM_ID) private platformId: object // Inject PLATFORM_ID để kiểm tra môi trường
  ) {}
  
  logout() {
    sessionStorage.removeItem('fullName');
    sessionStorage.removeItem('userID');
    this.fullName = null; // Cập nhật lại biến fullname
    this.userID = null;   // Cập nhật lại biến userId
    this.router.navigate(['/user/login-user']);
  }

  
 // Xóa đơn hàng
 deleteOrder(id: number): void {
  if (confirm('Bạn có chắc chắn muốn xóa đơn hàng này không?')) {
    this.cartService.deleteOrder(id).subscribe(
      () => {
        alert('Đơn hàng đã được xóa thành công!');
        this.loadOrders(); // Cập nhật danh sách đơn hàng sau khi xóa
      },
      (error) => {
        alert('Đơn hàng đã được xóa thành công!');
        this.loadOrders(); 
      }
    );
  }
}
  convertStringToDate(dateString: string): Date {
    const year = +dateString.substring(0, 4);
    const month = +dateString.substring(4, 6) - 1; // Tháng bắt đầu từ 0
    const day = +dateString.substring(6, 8);
    return new Date(year, month, day);
  }
  

  ngOnInit() { 
    this.loadOrders();
  }
  // Lấy tất cả đơn hàng từ API
  loadOrders(): void {
    this.userService.getAllOrder().subscribe(
      (data) => {
        this.orderItems = data;
        this.filteredOrders = data; // Khởi tạo danh sách được lọc bằng toàn bộ đơn hàng
      },
      (error) => {
        console.error('Lỗi khi lấy danh sách đơn hàng:', error);
      }
    );
  }

  // Lọc đơn hàng theo trạng thái
  filterOrders(): void {
    if (this.selectedStatus === '') {
      // Nếu không có trạng thái nào được chọn, hiển thị tất cả đơn hàng
      this.filteredOrders = this.orderItems;
    } else {
      // Lọc đơn hàng theo trạng thái đã chọn
      this.filteredOrders = this.orderItems.filter(
        (order) => order.status === this.selectedStatus
      );
    }
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

    updateStatusOrder(orderID: number) {
      this.paymentService.updateStatus(orderID, 2).subscribe(
        (response: HttpResponse<any>) => {
          if (response.status == 200) {  // Kiểm tra mã 200 OK
            this.Message = "Đơn hàng đã được duyệt!";
            this.showAddAlert();
            this.loadOrders();
          }
        },
        (error) => {
          this.Message = "Đơn hàng đã được duyệt!";
          this.showAddAlert();
          this.loadOrders();
        }
      );
    }
    


}
