import { CurrencyPipe, isPlatformBrowser, NgFor, NgIf } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { FavoriteService } from '../../services/favorite.service';
import { BrandService } from '../../services/brand.service';
import { CategoryService } from '../../services/category.service';
import { ProductService } from '../../services/product.service';
import { FormBuilder } from '@angular/forms';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-brand-user',
  standalone: true,
  imports: [NgIf,NgFor,CurrencyPipe,RouterModule],
  templateUrl: './brand-user.component.html',
  styleUrl: './brand-user.component.css'
})
export class BrandUserComponent {
  products: any[] = [];
  brands: any[] = [];
  categories: any[] = [];



  fullName: string | null = '';


  productID!: number;
  userID: string | null = '';

  favorited: boolean = false; // Trạng thái yêu thích
  Message: string | null = null;
  
  constructor(private fb: FormBuilder,
    private productService: ProductService,
    private categoryService: CategoryService,
    private brandService: BrandService,
    private favoriteService: FavoriteService,
    private cartService: CartService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: object // Inject PLATFORM_ID để kiểm tra môi trường
  ) {
  
  }
  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Chỉ truy cập sessionStorage nếu đang chạy trên trình duyệt
      this.fullName = sessionStorage.getItem('fullName');
      this.userID = sessionStorage.getItem('userID');
      
    }
    this.loadProducts();
    this.loadBrands();
    this.loadCategories();
  }
  // Lấy danh sách thương hiệu từ service
  loadBrands() {
    this.brandService.getAllBrand().subscribe({
      next: (data) => (this.brands = data),
      error: (err) => console.error('Lỗi khi tải thương hiệu:', err),
    });
  }

  // Lấy danh sách danh mục từ service
  loadCategories() {
    this.categoryService.getAllCate().subscribe({
      next: (data) => (this.categories = data),
      error: (err) => console.error('Lỗi khi tải danh mục:', err),
    });
  }

  // Lọc sản phẩm theo thương hiệu
  filterByBrand(brandId: number) {
    this.productService.getProductsByBrandId(brandId).subscribe({
      next: (data) => {
         this.products = data || [];
    },
      error: (err) => {
        console.error('Lỗi khi lọc sản phẩm theo thương hiệu:', err);
        this.products = [];
      },
    });
  }

  // Lọc sản phẩm theo danh mục
  filterByCategory(categoryId: number) {
    this.productService.getProductsByCategoryId(categoryId).subscribe({
      next: (data) => {
        this.products = data || []; // Nếu null, gán thành mảng rỗng
      },
      
      error: (err) => {
        console.error('Lỗi khi lọc sản phẩm:', err);
        this.products = [];
      },
    });
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
  onclick() { //nút đăng nhập
    this.router.navigate(['/user/login-user']);
  }
  checkFavorite(productID: number): void {
    if (this.userID) {
      this.favoriteService.checkFavorite(Number(this.userID), productID).subscribe(
        (response: any) => {
          const product = this.products.find(p => p.productID === productID);
          if (product) {
            product.favorited = response.favorited; // Cập nhật trạng thái yêu thích cho sản phẩm
          }
        },
        (error) => {
          console.error('Error checking favorite status:', error);
        }
      );
    }
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
  loadProducts() {
    this.productService.getProducts().subscribe(
      (data: any) => {
        this.products = data;
        this.products.forEach(product => {
          this.checkFavorite(product.productID); // Kiểm tra trạng thái yêu thích cho từng sản phẩm
        });
      },
      error => {
        console.error('Lỗi khi tải sản phẩm:', error);
      }
    );
  }
}
