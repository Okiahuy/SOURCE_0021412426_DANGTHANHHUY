import { CurrencyPipe, DatePipe, isPlatformBrowser, NgFor, NgIf } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CategoryService } from '../../services/category.service';
import { BrandService } from '../../../../../admin/src/app/services/brand.service';
import { ColorService } from '../../../../../admin/src/app/services/color.service';
import { ProductService } from '../../services/product.service'; 
import { UserService } from '../../services/user.service';
import { MaterialService } from '../../../../../admin/src/app/services/material.service';
import { PaymentService } from '../../../../../admin/src/app/services/payment.service';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-history-order',
  standalone: true,
  imports: [NgFor,NgIf,CurrencyPipe,FormsModule,DatePipe,RouterModule,ReactiveFormsModule],
  templateUrl: './history-order.component.html',
  styleUrl: './history-order.component.css'
})
export class HistoryOrderComponent implements OnInit{
  orderdetailItems: any[] = [];
  fullName: string | null = '';
  userID: string | null = '';

  categories: { [key: number]: string } = {}; 

  materials: { [key: number]: string } = {}; 

  brands: { [key: number]: string } = {}; 

  colors: { [key: number]: string } = {}; 

  user: any[] = [];

  orderID!: number; 

  reviewForm: FormGroup;

  likeCount: number = 0;

  productID!: number; 


  Message: string | null = null;

  comment: string = '';

  selectedRating: number | null = null;

  editForm: FormGroup;


  orderItem: any[] = [];

  // Hàm xử lý khi checkbox thay đổi
  onRatingChange(rating: number) {
    this.selectedRating = rating;
    console.log(`Bạn đã chọn ${rating} sao.`);
  }
  openEditModal(item: any) {
    this.editForm.patchValue({
      productID: item.productID
    });

  }
  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private router: Router,
    private categoryService: CategoryService,
    private brandService: BrandService,
    private colorService: ColorService,
    private userService: UserService,
    private route: ActivatedRoute,
    private materialSevice: MaterialService,

    private paymentService: PaymentService,
    @Inject(PLATFORM_ID) private platformId: object // Inject PLATFORM_ID để kiểm tra môi trường

  ) { this.reviewForm = this.fb.group({
    rating: ['', [Validators.required, Validators.min(1), Validators.max(5)]],
    comment: ['', Validators.required],
    userID: ['', Validators.required],
    productID: ['', Validators.required]
  }); 
 //CONSTRUCTOR SỬA 
 this.editForm = this.fb.group({
  brandID: ['', Validators.required],
  name: ['', Validators.required],
  description: ['', Validators.required],
});

}
  ngOnInit() {
    this.orderID = Number(this.route.snapshot.paramMap.get('orderID')); // Lấy ID từ URL

    if (isPlatformBrowser(this.platformId)) {
      this.fullName = sessionStorage.getItem('fullName');
      this.userID = sessionStorage.getItem('userID');
      if (this.userID) {
        this.userService.getOrderDetailByOrderID(Number(this.orderID)).subscribe(
          (data) => {
            this.orderdetailItems = data;
            this.userService.getOrderByOrderID(Number(this.orderID)).subscribe(
              (dataorder) => {
                this.orderdetailItems = data;
                this.orderItem = [dataorder];
              })
            this.orderdetailItems.forEach(item => {
              this.productService.getProductsById(item.productID).subscribe(
                (product) => {
                  item.productName = product.name; // Tên sản phẩm
                  item.productImage = product.imageUrl; // Hình ảnh sản phẩm
                  item.productColor = product.colorID; // Màu sắc
                  this.colorService.getColorById(item.productColor).subscribe(
                    (color: any) => {
                      this.colors[item.productColor] = color.colorName; 
                    },
                    error => {
                      console.error(`Lỗi khi tải màu với ID ${item.productColor}:`, error);
                    }
                  );
                  item.productCategory = product.categoryID; // 
                  this.categoryService.getCategoryById(item.productCategory).subscribe(
                    (category: any) => {
                      this.categories[item.productCategory] = category.name; // Lưu tên danh mục theo ID
                    },
                    error => {
                      console.error(`Lỗi khi tải danh mục với ID ${item.productCategory}:`, error);
                    }
                  );
                  item.productMaterial = product.materialID; // 
                  this.materialSevice.getMaterialById(item.productMaterial).subscribe(
                    (material: any) => {
                      this.materials[item.productMaterial] = material.materialName; // Lưu tên danh mục theo ID
                    },
                    error => {
                      console.error(`Lỗi khi tải danh mục với ID ${item.productMaterial}:`, error);
                    }
                  );
                  item.productPrice = product.price; // Giá sản phẩm
                  item.totalPrice = item.quantity * product.price; // Tổng tiền
  
                },
                (error) => {
                  console.error(`Lỗi khi lấy sản phẩm với ID ${item.productID}:`, error);
                }
              );
            });
          },
          (error) => {
            console.error('Lỗi khi lấy giỏ hàng:', error);
          }
        );
      }
    }
    
    // Kiểm tra ID hợp lệ
    if (Number(this.userID)) {
      this.userService.getAllUserByID(Number(this.userID)).subscribe(
        data => {
          //this.product = data; // Lưu dữ liệu sản phẩm vào mảng
          this.user = [data];
         
        },
        error => {
          console.error('Error fetching product details:', error);
        }
      );
    }
    }

    submitReview() {
      
      if (this.selectedRating) {
          this.userService.addReview(
              Number(this.selectedRating),
              this.comment,
              Number(this.userID),
              this.selectedProductID,
              this.orderID
          ).subscribe({
              next: (response) => {
                  alert('Đánh giá đã được thêm thành công!');
                  this.comment = '';  // Reset comment sau khi thành công
                  this.selectedRating = null;  // Reset rating nếu cần
                  this.updateStatus10Order(this.orderID);
              },
              error: (error) => {
                  console.error('Lỗi khi thêm đánh giá:', error);
                  alert('Có lỗi xảy ra, vui lòng thử lại!' + error.message);
              }
          });
      } else {
          alert('Vui lòng điền đầy đủ thông tin!');
      }
  }
  selectedProductID: number = 0;

  openReviewModal(productID: number): void {
    this.selectedProductID = productID;
    console.log('ProductID được chọn:', this.selectedProductID); // Kiểm tra trên console
  }

  updateStatus10Order(orderID: number) {
    this.paymentService.updateStatus(orderID, 10).subscribe(
      (response: HttpResponse<any>) => {
        if (response.status == 200) {  // Kiểm tra mã 200 OK
         
          
        }
      },
      (error) => {
        
       
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
   
}
