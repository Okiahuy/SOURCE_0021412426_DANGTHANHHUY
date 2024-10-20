import { CurrencyPipe, isPlatformBrowser, NgFor, NgIf } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FavoriteService } from '../../services/favorite.service';
import { BrandService } from '../../services/brand.service';
import { CategoryService } from '../../services/category.service';
import { ProductService } from '../../services/product.service';
import { FormBuilder } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-product-user',
  standalone: true,
  imports: [NgIf,NgFor,CurrencyPipe,RouterModule],
  templateUrl: './product-user.component.html',
  styleUrl: './product-user.component.css'
})
export class ProductUserComponent implements OnInit {
  products: any[] = [];
  categories: { [key: number]: string } = {}; 
  cate: any[] = [];

  brands: { [key: number]: string } = {}; 
  bra: any[] = [];
  fullName: string | null = '';


  productID!: number;
  userID: string | null = '';

  favorited: boolean = false; // Trạng thái yêu thích

  showImage: boolean = false; // Biến để kiểm soát hiển thị ảnh
  showImage2: boolean = false; // Biến để kiểm soát hiển thị ảnh
  showImage3: boolean = false; // Biến để kiểm soát hiển thị ảnh
  imageUrl: string = 'https://bizweb.dktcdn.net/100/175/988/articles/collection-classic-watches-datejust.jpg?v=1553780943657'; // Đường dẫn đến ảnh
  imageUrl2: string = 'https://www.watchesworld.com/wp-content/uploads/2024/05/rolex-submariner-lifestyle.jpg'; // Đường dẫn đến ảnh
  imageUrl3: string = 'https://magazine.chrono24.com/cdn-cgi/image/f=auto,metadata=none,fit=cover,q=65,w=1200,h=600,dpr=2.0/2019/09/Mens-Watches-Every-Woman-Should-Know-and-Love_2_1.jpg'; // Đường dẫn đến ảnh

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
    this.loadCategoryNames();
    this.loadBrandNames();
    this.showImageAlert();
  }

  showImageAlert() {
    this.showImage = true; // Hiển thị ảnh
    // Tự động ẩn ảnh sau 5 giây
    setTimeout(() => {
      this.showImage = false;
      this.showImage2 = true; // Hiển thị ảnh
    }, 3000);
    setTimeout(() => {
      this.showImage2 = false;
      this.showImage3 = true; // Hiển thị ảnh
    }, 6000);
    setTimeout(() => {
      this.showImage3 = false;
      this.showImage = true; // Hiển thị ảnh  
    }, 9000);

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
        // Sau khi lấy sản phẩm, lấy tên danh mục cho mỗi sản phẩm
        this.loadCategoryNames();
        this.loadBrandNames();
        this.products.forEach(product => {
          this.checkFavorite(product.productID); // Kiểm tra trạng thái yêu thích cho từng sản phẩm
        });
      },
      error => {
        console.error('Lỗi khi tải sản phẩm:', error);
      }
    );
  }
  onclick() { //nút đăng nhập
    this.router.navigate(['/user/login-user']);
  }
  ///hiển thị danh mục theo id
  loadCategoryNames() {
    // Lấy danh sách ID danh mục duy nhất và lọc ra các ID hợp lệ
    const categoryIds = Array.from(new Set(this.products.map(product => product.categoryID).filter(id => id !== undefined))); 
    categoryIds.forEach(categoryID => {
      this.categoryService.getCategoryById(categoryID).subscribe(
        (category: any) => {
          this.categories[categoryID] = category.name; // Lưu tên danh mục theo ID
        },
        error => {
          console.error(`Lỗi khi tải danh mục với ID ${categoryID}:`, error);
        }
      );
    });
  }
  ///hiển thị TH theo id
  loadBrandNames() {
    // Lấy danh sách ID thương hiệu duy nhất và lọc ra các ID hợp lệ
    const brandIds = Array.from(new Set(this.products.map(product => product.brandID).filter(id => id !== undefined))); 
  
    brandIds.forEach(brandID => {
      this.brandService.getBrandById(brandID).subscribe(
        (brand: any) => {
          this.brands[brandID] = brand.name; // Lưu tên thương hiệu theo ID
        },
        error => {
          console.error(`Lỗi khi tải thương hiệu với ID ${brandID}:`, error);
        }
      );
    });
  }

}