import { isPlatformBrowser, NgClass, NgIf } from '@angular/common';
import { Component, HostListener, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-header-user',
  standalone: true,
  imports: [RouterModule,NgIf,RouterModule,NgClass,FormsModule],
  templateUrl: './header-user.component.html',
  styleUrl: './header-user.component.css'
})
export class HeaderUserComponent implements OnInit{

  searchQuery: string = ''; // Từ khóa tìm kiếm
  cartCount: number = 0;


  onSearch() {
    if (this.searchQuery.trim()) {
      // Điều hướng sang ProductComponent với query param
      this.router.navigate(['/'], {
        queryParams: { name: this.searchQuery },
      });
    }
  }

  constructor(
    private router: Router,
    private cartService: CartService,
    @Inject(PLATFORM_ID) private platformId: object // Inject PLATFORM_ID để kiểm tra môi trường
  ) {}
  fullName: string | null = '';
  userID: string | null = '';
 
  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      // Chỉ truy cập sessionStorage nếu đang chạy trên trình duyệt
      this.fullName = sessionStorage.getItem('fullName');
      this.userID = sessionStorage.getItem('userID');
      this.cartService.loadCartCount(Number(this.userID)); // Tải số lượng sản phẩm ban đầu

      // Subscribe để nhận thông báo mỗi khi số lượng thay đổi
      this.cartService.cartCount$.subscribe((count) => {
        this.cartCount = count;
      });
    }
  }
  // Gọi service để lấy số lượng sản phẩm
  loadCartCount(): void {
    this.cartService.getCartCountByUserId(Number(this.userID)).subscribe(
      (count) => {
        this.cartCount = count;
      },
      (error) => {
        console.error('Lỗi khi lấy số lượng giỏ hàng:', error);
      }
    );
  }
 
  load(){
    this.router.navigate(['/']);
  }
  logout() {
    sessionStorage.removeItem('fullName');
    sessionStorage.removeItem('userID');
    sessionStorage.removeItem('email');
    this.fullName = null; // Cập nhật lại biến fullname
    this.userID = null;   // Cập nhật lại biến userId
    this.router.navigate(['/user/login-user']);
  }

}
