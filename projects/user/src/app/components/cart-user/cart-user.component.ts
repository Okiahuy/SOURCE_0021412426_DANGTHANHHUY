import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { CurrencyPipe, DatePipe, isPlatformBrowser, NgFor, NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../../../../admin/src/app/services/categogy.service';
import { BrandService } from '../../../../../admin/src/app/services/brand.service';
import { ColorService } from '../../../../../admin/src/app/services/color.service';
import { HttpResponse } from '@angular/common/http';


@Component({
  selector: 'app-cart-user',
  standalone: true,
  imports: [NgFor,NgIf,CurrencyPipe,FormsModule,DatePipe],
  templateUrl: './cart-user.component.html',
  styleUrl: './cart-user.component.css'
})
export class CartUserComponent {
  cartItems: any[] = [];
  fullName: string | null = '';
  userID: string | null = '';
  email: string | null = '';
  categories: { [key: number]: string } = {}; 

  brands: { [key: number]: string } = {}; 

  colors: { [key: number]: string } = {}; 

  constructor(private cartService: CartService,
    private productService: ProductService,
    private router: Router,
    private categoryService: CategoryService,
    private brandService: BrandService,
    private colorService: ColorService,
    @Inject(PLATFORM_ID) private platformId: object // Inject PLATFORM_ID để kiểm tra môi trường

  ) { }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Chỉ truy cập sessionStorage nếu đang chạy trên trình duyệt
      this.fullName = sessionStorage.getItem('fullName');
      this.userID = sessionStorage.getItem('userID');
      this.email = sessionStorage.getItem('email');
      this.cartService.loadCartCount(Number(this.userID));
    }
    if (this.userID) {
      this.cartService.getCartByUserID(Number(this.userID)).subscribe(
        (data) => {
          this.cartItems = data;
          this.cartItems.forEach(item => {
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

                item.productPrice = (product.price * (1 - product.disPrice / 100)); // Giá sản phẩm
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
    this.updateTotalPrice();
  }

  onclick() { //nút đăng nhập
    this.router.navigate(['/user/login-user']);
  }

  updateTotalPrice() {
    this.totalPrice = this.cartItems
      .filter((item) => item.selected) // Chỉ tính các sản phẩm được chọn
      .reduce((acc, item) => acc + item.quantity * item.productPrice, 0);
  } 
  // Biến lưu trữ các sản phẩm và thông tin liên quan
selectedProductIDs: number[] = []; // Mảng lưu các productID của sản phẩm được chọn
selectedItems: any[] = []; // Mảng lưu các sản phẩm đã chọn từ giỏ hàng
totalQuantity: number = 0;  // Tổng số lượng sản phẩm được chọn
totalPrice: number = 0; 
userEmail: string | null = '';   // Gửi email
orderRequest: any = {};

// Phương thức thực hiện thanh toán
submitPayment(): void {
  // Lọc ra các sản phẩm đã được người dùng chọn trong giỏ hàng
  const selectedItems = this.cartItems.filter(item => item.selected);
  
  // Lấy userID từ sessionStorage để biết người dùng hiện tại là ai
  const userID = sessionStorage.getItem('userID');

  // Giả định paymentID là 1, có thể thay đổi dựa trên phương thức thanh toán thực tế
  const paymentID = 1; 
  
  // Kiểm tra xem có sản phẩm nào được chọn hay không
  if (selectedItems.length > 0) {
    // Tính tổng số tiền của tất cả sản phẩm được chọn (giá sản phẩm * số lượng)
    this.totalPrice = selectedItems.reduce((acc, item) => acc + item.productPrice * item.quantity, 0);
    
    // Tạo danh sách các sản phẩm đã chọn với thông tin productID, quantity và price
    const orderItems = selectedItems.map(item => ({
      productID: item.productID,  // ID của sản phẩm
      quantity: item.quantity,    // Số lượng sản phẩm
      price: item.productPrice    // Giá của sản phẩm
    }));

    // Tạo yêu cầu đơn hàng để gửi lên server
    const orderRequest = {
      userID: Number(userID),  // Chuyển userID từ chuỗi sang số
      paymentID: paymentID,    // ID phương thức thanh toán
      totalPrice: this.totalPrice,  // Tổng số tiền của đơn hàng
      userEmail: this.email, ///gửi mail
      items: orderItems        // Danh sách các sản phẩm và thông tin của từng sản phẩm
    };

    // Gọi API thanh toán trên server thông qua cartService
    this.cartService.processPayment(orderRequest).subscribe(
      // Xử lý khi thanh toán thành công
      (response: HttpResponse<any>) => {
        console.log('Thanh toán thành công', response);  // Ghi log phản hồi từ server
        if (response.status === 201) {
          // alert('Thanh toán thành công!');  // Hiển thị thông báo thành công cho người dùng
          this.showAddAlert();
        }
      },
      // Xử lý khi có lỗi xảy ra trong quá trình thanh toán
      (error) => {
        alert('Thanh toán thành công!');
        //this.showAddAlert();  // Hiển thị thông báo thành công cho người dùng
      }
    );
  } else {
    // Nếu không có sản phẩm nào được chọn, thông báo cho người dùng
    alert('Vui lòng chọn ít nhất một sản phẩm để thanh toán.');
  }
}

  openOrderModal() {
    const selectedItems = this.cartItems.filter((item) => item.selected);
    if (selectedItems.length < 0) {
      alert('Vui lòng chọn ít nhất một sản phẩm để thanh toán.');
      return;
    }
    const orderItems = selectedItems.map(item => ({
      productID: item.productID,
      quantity: item.quantity,
      price: item.productPrice
    }));

    this.orderRequest = {
      userID: Number(this.userID),
      paymentID: 1,
      totalPrice: this.totalPrice,
      items: orderItems
    };
  }

  showModal() {
    const successAlert = document.getElementById('orderModal');
    if (successAlert) {
      successAlert.style.display = 'block'; // Hiển thị alert
    
    }
  }

  increaseQuantity(cartId: number) {
    const item = this.cartItems.find(i => i.cartID === cartId);
    if (item) {
      item.quantity++;
      this.cartService.updateCart(cartId, item.quantity).subscribe(
        response => {
          console.log('Cập nhật thành công', response);
        },
        error => {
          console.error('Lỗi khi cập nhật', error);
        }
      );
    }
  }

  decreaseQuantity(cartId: number) {
    const item = this.cartItems.find(i => i.cartID === cartId);
    if (item && item.quantity > 1) {
      item.quantity--;
      this.cartService.updateCart(cartId, item.quantity).subscribe(
        response => {
          console.log('Cập nhật thành công', response);
        },
        error => {
          console.error('Lỗi khi cập nhật', error);
        }
      );
    }
  }

  updateCart(item: any): void {
    // Gọi API để cập nhật giỏ hàng trên server
    this.cartService.updateCart(item.id, item.quantity).subscribe(
      (response) => {
        console.log('Cập nhật giỏ hàng thành công:', response);
      },
      (error) => {
        console.error('Lỗi khi cập nhật giỏ hàng:', error);
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
  deleteCart(item: number): void {
    // Gọi API để cập nhật giỏ hàng trên server
    this.cartService.deleteCart(item, Number(this.userID)).subscribe(
      (response) => {
        console.log('Xoa giỏ hàng thành công:', response);
        this.cartService.loadCartCount(Number(this.userID));
        if (this.userID) {
          this.cartService.getCartByUserID(Number(this.userID)).subscribe(
            (data) => {
              this.cartItems = data;
              this.cartItems.forEach(item => {
                this.productService.getProductsById(item.productID).subscribe(
                  (product) => {
                    item.productName = product.name; // Tên sản phẩm
                    item.productImage = product.imageUrl; // Hình ảnh sản phẩm
                    item.productColor = product.colorID; // Màu sắc
                    item.productCategory = product.categoryID; // Loại sản phẩm
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
      },
      (error) => {
        console.error('Lỗi khi cập nhật giỏ hàng:', error);
      }
    );
  }


}
