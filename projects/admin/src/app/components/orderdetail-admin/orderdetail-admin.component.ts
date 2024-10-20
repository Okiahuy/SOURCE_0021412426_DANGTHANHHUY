import { CurrencyPipe, DatePipe, isPlatformBrowser, NgFor, NgIf } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CategoryService } from '../../../../../user/src/app/services/category.service';
import { ProductService } from '../../../../../user/src/app/services/product.service';
import { BrandService } from '../../../../../user/src/app/services/brand.service';
import { ColorService } from '../../services/color.service';
import { UserService } from '../../../../../user/src/app/services/user.service';
import { MaterialService } from '../../services/material.service';


@Component({
  selector: 'app-orderdetail-admin',
  standalone: true,
  imports: [NgFor,NgIf,CurrencyPipe,FormsModule,DatePipe,RouterModule],
  templateUrl: './orderdetail-admin.component.html',
  styleUrl: './orderdetail-admin.component.css'
})
export class OrderdetailAdminComponent {
  orderdetailItems: any[] = [];
  fullName: string | null = '';
  userID: string | null = '';

  categories: { [key: number]: string } = {}; 

  materials: { [key: number]: string } = {}; 

  brands: { [key: number]: string } = {}; 

  colors: { [key: number]: string } = {}; 

  user: any[] = [];

  orderID!: number; 

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
  ngOnInit() {
    this.orderID = Number(this.route.snapshot.paramMap.get('orderID')); // Lấy ID từ URL
        this.userService.getOrderDetailByOrderID(Number(this.orderID)).subscribe(
          (data) => {
            this.orderdetailItems = data;
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
            console.error('Lỗi khi lấy đơn hàng:', error);
          }
        );
      }
    }
   

  


