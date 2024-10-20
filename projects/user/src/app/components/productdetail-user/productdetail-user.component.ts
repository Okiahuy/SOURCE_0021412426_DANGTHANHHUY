import { Component, Inject, Input, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CurrencyPipe, DecimalPipe, isPlatformBrowser, NgFor, NgIf } from '@angular/common';
import { Product } from '../../models/product.model';
import { CategoryService } from '../../services/category.service';
import { BrandService } from '../../services/brand.service';
import { ColorService } from '../../../../../admin/src/app/services/color.service';
import { MaterialService } from '../../../../../admin/src/app/services/material.service';
import { FavoriteService } from '../../services/favorite.service';
import { CartService } from '../../services/cart.service';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { PaymentService } from '../../../../../admin/src/app/services/payment.service';

@Component({
  selector: 'app-productdetail-user',
  standalone: true,
  imports: [CurrencyPipe,NgIf,NgFor, ReactiveFormsModule, FormsModule, DecimalPipe],
  templateUrl: './productdetail-user.component.html',
  styleUrl: './productdetail-user.component.css'
})
export class ProductdetailUserComponent implements OnInit{
  @Input()product: any[] = [];
  brand: any;


  cate: any;


  bra: any


  col: any;


  mate: any;

  fullName: string | null = '';
  userID: string | null = '';

  likeCount: number = 0;

  productID!: number; 


  orderID!: number; 

  Message: string | null = null;

  comment: string = '';

  selectedRating: number | null = null;

  reviews: any[] = [];

  averageRating: number = 0;


  // Hàm xử lý khi checkbox thay đổi
  onRatingChange(rating: number) {
    this.selectedRating = rating;
    console.log(`Bạn đã chọn ${rating} sao.`);
  }

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private productService: ProductService, // Inject service
    private categoryService: CategoryService,
    private brandService: BrandService,
    private colorService: ColorService,
    private materialService: MaterialService,
    private favoriteService: FavoriteService,
    private cartService: CartService,
    private router: Router,
    private userService: UserService,
    private paymentService: PaymentService,
    @Inject(PLATFORM_ID) private platformId: object // Inject PLATFORM_ID để kiểm tra môi trường
  ) {
   
  }

  onclick() {
    this.router.navigate(['/user/login-user']);
  }
   // Hàm gửi dữ liệu đánh giá
//    submitReview() {
//     alert('Đánh giá đã được thêm thành công!' + this.orderID);
//     if (this.selectedRating) {
//         this.userService.addReview(
//             Number(this.selectedRating),
//             this.comment,
//             Number(this.userID),
//             this.productID,
//             this.orderID
//         ).subscribe({
//             next: (response) => {
//                 alert('Đánh giá đã được thêm thành công!');
//                 this.comment = '';  // Reset comment sau khi thành công
//                 this.selectedRating = null;  // Reset rating nếu cần
//                 this.updateStatus10Order(this.orderID);
//             },
//             error: (error) => {
//                 console.error('Lỗi khi thêm đánh giá:', error);
//                 alert('Có lỗi xảy ra, vui lòng thử lại!' + error.message);
//             }
//         });
//     } else {
//         alert('Vui lòng điền đầy đủ thông tin!');
//     }
// }

loadAverageRating(productID: number): void {
  this.userService.getAverageRating(productID).subscribe({
    next: (rating) => {
      this.averageRating = rating;
    },
    error: (error) => {
      console.error('Lỗi khi lấy trung bình số sao:', error);

    },
  });
}

loadReviews(productID: number): void {
  this.userService.getReviewsByProductID(productID).subscribe({
    next: (data) => {
      this.reviews = data;
      this.reviews.forEach((review) => {
        this.userService.getUserById(review.userID).subscribe((user) => {
          review.userName = user.fullname; // Gán tên người dùng vào review
        });
      });
    },
    error: (error) => {
      console.error('Lỗi khi tải đánh giá:', error);
      this.reviews = [];
    },
  });
}

getStarsArray(rating: number): number[] {
  const fullStars = Math.floor(rating); // Số sao nguyên
  const hasHalfStar = rating % 1 >= 0.5 ? 1 : 0; // Kiểm tra có nửa sao không
  const emptyStars = 5 - fullStars - hasHalfStar; // Tính số sao trống

  return [
    ...Array(fullStars).fill(1),    // Sao đầy
    ...Array(hasHalfStar).fill(0.5), // Sao nửa
    ...Array(emptyStars).fill(0)     // Sao trống
  ];
}


  ngOnInit() {
    this.productID = Number(this.route.snapshot.paramMap.get('productID')); // Lấy ID từ URL
    this.getLikes(this.productID);
    if (isPlatformBrowser(this.platformId)) {
      // Chỉ truy cập sessionStorage nếu đang chạy trên trình duyệt
      this.fullName = sessionStorage.getItem('fullName');
      this.userID = sessionStorage.getItem('userID');
     
    }
    // Kiểm tra ID hợp lệ
    if (!isNaN(this.productID)) {
      this.loadReviews(this.productID);
      this.loadAverageRating(this.productID);
      // Gọi API để lấy thông tin sản phẩm
      this.productService.getProductsById(this.productID).subscribe(
        data => {
          //this.product = data; // Lưu dữ liệu sản phẩm vào mảng
          this.product = [data];
          this.loadBrand(data.brandID); // Gọi hàm để lấy thương hiệu
          this.loadCategorie(data.categoryID);
          this.loadColors(data.colorID);
          this.loadMaterrials(data.materialID);
          this.getLikes(this.productID);
        },
        error => {
          console.error('Error fetching product details:', error);
        }
      );
    } else {
      console.error('Invalid product ID:', this.productID);
    }
    }
    updateStatus10Order(orderID: number) {
      this.paymentService.updateStatus(orderID, 10).subscribe(
        (response: HttpResponse<any>) => {
          if (response.status == 200) {  // Kiểm tra mã 200 OK
            this.Message = "Đánh giá thành công!";
            this.showAddAlert();
            
          }
        },
        (error) => {
          this.Message = "Đánh giá thành công!";
          this.showAddAlert();
         
        }
      );
    }
    getLikes(productID: number): void {
      this.favoriteService.getLikesForProduct(productID).subscribe(
        (data: any) => {
          // Tìm số lượt thích cho sản phẩm hiện tại
          const productLikes = data.find((item: any) => item.productID === productID);
          this.likeCount = productLikes ? productLikes.totalLikes : 0; // Cập nhật số lượt thích
        },
        (error) => {
          console.error('Error fetching likes:', error);
          
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
    
    loadBrand(brandID: number) {
      this.brandService.getBrandById(brandID).subscribe(
        brandData => {
          this.brand = brandData; // Lưu thông tin thương hiệu
        },
        error => {
          console.error('Error fetching brand details:', error);
        }
      );
    }
   // Phương thức load danh mục từ API
   loadCategorie(brandID: number): void {
    this.categoryService.getCategoryById(brandID).subscribe(
      data => {
        this.cate = data; 
    });
  }
  // Phương thức load danh mục từ API
  loadColors(brandID: number): void {
    this.colorService.getColorById(brandID).subscribe(
      data => {
      this.col = data; 
    });
  }
      // Phương thức load danh mục từ API
  loadMaterrials(brandID: number): void {
    this.materialService.getMaterialById(brandID).subscribe(
      data => {
      this.mate = data; 
    });
  }
}