import { CurrencyPipe, DatePipe, NgFor, NgIf } from '@angular/common';
import { Component, ElementRef, Inject, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import {NgxPrintModule} from 'ngx-print';
import { MaterialService } from '../../services/material.service';
import { UserService } from '../../../../../user/src/app/services/user.service'; 
import { ColorService } from '../../services/color.service';
import { BrandService } from '../../../../../user/src/app/services/brand.service';
import { CategoryService } from '../../../../../user/src/app/services/category.service';
import { ProductService } from '../../../../../user/src/app/services/product.service';

@Component({
  selector: 'app-invoice-admin',
  standalone: true,
  imports: [NgxPrintModule,CurrencyPipe,NgIf,NgFor,DatePipe,RouterModule],
  templateUrl: './invoice-admin.component.html',
  styleUrl: './invoice-admin.component.css'
})
export class InvoiceAdminComponent implements OnInit{
  @ViewChild('printSection') printSection!: ElementRef;

  orderID!: number;

  orderdetailItems: any[] = [];
  fullName: string | null = '';
  userID: string | null = '';

  categories: { [key: number]: string } = {}; 

  materials: { [key: number]: string } = {}; 

  brands: { [key: number]: string } = {}; 

  colors: { [key: number]: string } = {}; 

  user: any;



  
  orderItems: any[] = [];

  constructor(
    private productService: ProductService,
    private router: Router,
    private categoryService: CategoryService,
    private brandService: BrandService,
    private colorService: ColorService,
    private userService: UserService,
    private route: ActivatedRoute,
    private materialSevice: MaterialService,
    @Inject(PLATFORM_ID) private platformId: object // Inject PLATFORM_ID để kiểm tra môi trường

  ) { }
ngOnInit(): void {
  this.updateCurrentTime(); 
  this.orderID = Number(this.route.snapshot.paramMap.get('orderID')); // Lấy ID từ URL
  if (this.orderID) {
    this.userService.getOrderByOrderID(Number(this.orderID)).subscribe(
      (data) => {
        this.orderItems = [data];
        const userID = this.orderItems[0].userID; // Lấy userID từ orderItems
          this.userService.getUserById(Number(userID)).subscribe(
            data => {
              this.user = data;
            }),
          this.userService.getOrderDetailByOrderID(Number(this.orderID)).subscribe(
            (data) => {
              this.orderdetailItems = data;
              this.orderdetailItems.forEach(item => {
                this.productService.getProductsById(item.productID).subscribe(
                  (product) => {
                    item.productName = product.name; // Tên sản phẩm
                    item.productDescription = product.description;
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
                    item.productBrand = product.brandID; // Màu sắc
                    this.brandService.getBrandById(item.productBrand).subscribe(
                      (color: any) => {
                        this.brands[item.productBrand] = color.name; 
                      },
                      error => {
                        console.error(`Lỗi khi tải màu với ID ${item.productBrand}:`, error);
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
            console.error('Lỗi khi lấy đơn hàng:', error);
          }
        );
      },
      
      (error) => {
        console.error('Lỗi khi lấy đơn hàng:', error);
      }
    );
  }
}
    currentTime: string = '';

    printInvoice(): void {
      window.print();
    }
  getCurrentDateTime(): string {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  }

  updateCurrentTime(): void {
    this.currentTime = this.getCurrentDateTime(); // Cập nhật thời gian
  }
convertStringToDate(dateString: string): Date {
  const year = +dateString.substring(0, 4);
  const month = +dateString.substring(4, 6) - 1; // Tháng bắt đầu từ 0
  const day = +dateString.substring(6, 8);
  return new Date(year, month, day);
}

}
