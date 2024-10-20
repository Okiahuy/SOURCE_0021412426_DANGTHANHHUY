import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FavoriteService } from '../../services/favorite.service';
import { ProductService } from '../../services/product.service';
import { FormBuilder } from '@angular/forms';
import { CurrencyPipe, isPlatformBrowser, NgFor, NgIf } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-favorite-user',
  standalone: true,
  imports: [NgFor,NgIf, CurrencyPipe,RouterModule],
  templateUrl: './favorite-user.component.html',
  styleUrl: './favorite-user.component.css'
})
export class FavoriteUserComponent implements OnInit{

  productID!: number;
  userID: string | null = '';
  fullName: string | null = '';
  products: any[] = [];
  favoriteProducts: any[] = [];
  Message: string | null = null;

  constructor(private fb: FormBuilder,
    private productService: ProductService,
    private favoriteService: FavoriteService,
    private router: Router,
    private cartService: CartService,
    @Inject(PLATFORM_ID) private platformId: object // Inject PLATFORM_ID để kiểm tra môi trường
  ) {
  
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

    // phương thức để thêm sản phẩm vào giỏ hàng
    addProductToCart(productID: number, price: number) {
      this.cartService.addToCart(Number(this.userID), productID, price).subscribe(
        (response: HttpResponse<any>) => {
          console.log('Sản phẩm đã được thêm vào giỏ hàng:', response);
          if (response.status === 201) {
            this.Message = "Sản phẩm đã được thêm vào giỏ hàng!";
            this.showAddAlert();
          }
        },
        (error) => {
         
          this.Message = "Sản phẩm đã được thêm vào giỏ hàng!";
          this.showAddAlert();
          this.cartService.loadCartCount(Number(this.userID));
        }
      );
    }

  // Khởi tạo component
  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Chỉ truy cập sessionStorage nếu đang chạy trên trình duyệt
      this.fullName = sessionStorage.getItem('fullName');
      this.userID = sessionStorage.getItem('userID');

      if (this.userID) {
        this.favoriteService.getFavoriteProducts(Number(this.userID)).subscribe(
          (data) => {
            this.products = data;
            this.products.forEach((product) => {
              this.checkFavoriteStatus(product); // Kiểm tra từng sản phẩm
            });
          },
          (error) => {
            console.error('Error loading favorite products:', error);
          }
        );
      }
    }
  }

  onclick() { //nút đăng nhập
    this.router.navigate(['/user/login-user']);
  }

  loadProducts() {
    this.productService.getProductByQuantity().subscribe(
      (data: any) => {
        this.products = data;
        this.products.forEach(product => {
          this.checkFavoriteStatus(product.productID); 
        });
      },
      error => {
        console.error('Lỗi khi tải sản phẩm:', error);
      }
    );
  }

// Hàm kiểm tra trạng thái yêu thích của sản phẩm
checkFavoriteStatus(product: any) {
  this.favoriteService.checkFavorite(Number(this.userID), product.productID).subscribe(
    (response) => {
      product.isFavorited = response.favorited; // Cập nhật trạng thái yêu thích
    },
    (error) => {
      console.error('Error checking favorite status:', error);
    }
  );
}
  toggleFavorite(productID: number): void {
    if (this.userID) {
        this.favoriteService.toggleFavorite(Number(this.userID), productID).subscribe(
            (response: any) => {
                console.log('Yêu thích đã được cập nhật:', response);
                
                // Cập nhật trạng thái yêu thích trong sản phẩm
                const product = this.products.find(p => p.productID === productID);
                if (product) {
                    product.favorited = !product.favorited; // Đảo ngược trạng thái
                }

            },
            (error) => {
                console.error('Lỗi khi cập nhật yêu thích:', error);
                this.router.navigate(['/']);
            }
        );
    }
}




}
