import { CurrencyPipe, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/categogy.service';
import { BrandService } from '../../services/brand.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { MaterialService } from '../../services/material.service';
import { ColorService } from '../../services/color.service';

@Component({
  selector: 'app-product-admin',
  standalone: true,
  imports: [NgFor,NgIf,ReactiveFormsModule,CurrencyPipe,RouterModule],
  templateUrl: './product-admin.component.html',
  styleUrl: './product-admin.component.css'
})
export class ProductAdminComponent implements OnInit {

  products: any[] = [];

  categories: { [key: number]: string } = {}; 
  cate: any[] = [];

  brands: { [key: number]: string } = {}; 
  bra: any[] = [];

  colors: { [key: number]: string } = {}; 
  col: any[] = [];

  materials: { [key: number]: string } = {}; 
  mate: any[] = [];

  totalPages: number = 0;
  currentPage: number = 1;
  pageSize: number = 6;

  selectedProduct: Product | null = null;
  selectedProductId: number = 0 ;
  productForm: FormGroup;
  editProductForm: FormGroup;

  idToDelete: number | null = null;


  imageUrl: string | null = null; // Biến để lưu tên tệp hình ảnh

  selectedFile: File | null = null;
  existingImageUrl: string | null = null;

  constructor(private fb: FormBuilder,
    private productService: ProductService,
    private categoryService: CategoryService,
    private brandService: BrandService,
    private colorService: ColorService,
    private materialService: MaterialService,
    private route: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer
  ) {
    /////////////////////////////////////////////////////////////////////////////////////////
    // Tạo form thêm sản phẩm
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: [, [Validators.required, Validators.min(0)]],
      disPrice: [, [Validators.required, Validators.min(0)]],
      quantity: [, [Validators.required, Validators.min(0)]],
      categoryID: [, Validators.required],
      brandID: [, Validators.required],
      materialID: [, Validators.required],
      colorID: [, Validators.required],
      imageUrl: [null] // Trường này sẽ được cập nhật khi chọn hình ảnh
    });
    /////////////////////////////////////////////////////////////////////////////////////////

  // Khởi tạo form sửa sản phẩm
  this.editProductForm = this.fb.group({
    name: ['', Validators.required],
    description: ['',Validators.required],
    price: ['', Validators.required],
    disPrice: ['', [Validators.required, Validators.min(0)]],
    quantity: ['', Validators.required],
    categoryID: ['', Validators.required],
    brandID: ['', Validators.required],
    materialID: ['', Validators.required],
    colorID: ['', Validators.required],
    imageUrl: [null]
  });
  }

  /////////////////////////////////////////////////////////////////////////////
  onFileSelected(event: any): void {
    console.log(event);
    const file = event.target.files[0];
    if (file) {
      this.productForm.patchValue({
        imageUrl: file // Lưu file vào form
      });
    }
  }
  addProduct(): void {
    if (this.productForm.valid) {
      const formData = this.prepareFormData(this.productForm.value);
      
      this.productService.addProduct(formData).subscribe((res: any) =>
        {
         {
          // Kiểm tra mã trạng thái phản hồi từ res
          if (res.status === 201) {
            // Thành công - Reset form và tải lại sản phẩm
            this.productForm.reset(); 
            this.loadProductsInPage(this.currentPage);
            this.showADDAlert();
          } else if (res.status === 400) {
            // Xử lý lỗi dữ liệu không hợp lệ
            alert('Dữ liệu không hợp lệ!');
          } else if (res.status === 409) {
            // Xử lý lỗi tên sản phẩm đã tồn tại
            alert('Tên sản phẩm đã tồn tại!');
          }else{
            this.productForm.reset(); 
            this.loadProductsInPage(this.currentPage);
            this.showADDAlert();
          }
        }
        
      },
      (error) => {
        this.productForm.reset(); 
        this.loadProductsInPage(this.currentPage);
        this.showADDAlert();
      });
    }
  }
   // Phương thức khi người dùng chọn file ảnh mới
   onFileSelectedUpdate(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      // Hiển thị ảnh preview
      this.existingImageUrl = this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(file)) as string;
    }
  }

  // Phương thức để chuẩn bị dữ liệu form
  prepareFormData_update(): FormData {
    const formData = new FormData();
    formData.append(
      'name',
      this.editProductForm.get('name')?.value
    );
    formData.append(
      'description',
      this.editProductForm.get('description')?.value
    );
    formData.append(
      'price',
      this.editProductForm.get('price')?.value
    );
    formData.append(
      'quantity',
      this.editProductForm.get('quantity')?.value
    );
    formData.append(
      'categoryID',
      this.editProductForm.get('categoryID')?.value
    );
    formData.append(
      'brandID',
      this.editProductForm.get('brandID')?.value
    );
    formData.append(
      'colorID',
      this.editProductForm.get('colorID')?.value
    );
    formData.append(
      'materialID',
      this.editProductForm.get('materialID')?.value
    );
    formData.append(
      'disPrice',
      this.editProductForm.get('disPrice')?.value
    );

    // Nếu người dùng có chọn ảnh mới, thêm file vào FormData
    if (this.selectedFile) {
      formData.append('imageUrl', this.selectedFile);
    }

    return formData;
  }

  // Phương thức sửa sản phẩm
  updateProduct(): void {
    const formData = this.prepareFormData_update();

    this.productService.updateProduct(this.selectedProductId, formData).subscribe(
      (response: any) => {
        if (response.status === 200) {
            this.editProductForm.reset();
            this.loadProductsInPage(this.currentPage);
            this.showEditAlert();
        } else if (response.status === 400) {
          this.showErr_data_Alert();
        }
      },
      (error) => {
        this.showEditAlert();
        this.loadProductsInPage(this.currentPage);
      }
    );
  }
  prepareFormData(productData: any): FormData {
    const formData = new FormData();
    for (const key in productData) {
      if (productData[key]) {
        formData.append(key, productData[key]);
      }
    }
    return formData;
  }
  /////////////////////////////////////////////////////////////////////////////
  ngOnInit(): void {
    this.loadProductsInPage(this.currentPage); // Gọi phương thức tải sản phẩm
    this.loadCategories();
    this.loadBrands();
    this.loadColors();
    this.loadMaterrials();
    this.loadCategoryNames();
    this.loadBrandNames();
    this.loadColorNames();
    this.loadMaterialNames();
   
  }
  loadProductsInPage(page: number): void {
    this.productService.getProductsInPage(page - 1, this.pageSize).subscribe(data => {
      this.products = data.content;
      this.totalPages = data.totalPages;
      this.loadCategoryNames();
      this.loadBrandNames();
      this.loadColorNames();
      this.loadMaterialNames();
    });
  }
  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadProductsInPage(page);
    }
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
  ///hiển thị màu theo id
  loadColorNames() {
    // Lấy danh sách ID danh mục duy nhất và lọc ra các ID hợp lệ
    const colorIds = Array.from(new Set(this.products.map(product => product.colorID).filter(id => id !== undefined))); 
  
    colorIds.forEach(colorID => {
      this.colorService.getColorById(colorID).subscribe(
        (color: any) => {
          this.colors[colorID] = color.colorName; // Lưu tên danh mục theo ID
        },
        error => {
          console.error(`Lỗi khi tải màu với ID ${colorID}:`, error);
        }
      );
    });
  }
  ///hiển thị màu theo id
  loadMaterialNames() {
    // Lấy danh sách ID danh mục duy nhất và lọc ra các ID hợp lệ
    const materialIds = Array.from(new Set(this.products.map(product => product.materialID).filter(id => id !== undefined))); 
  
    materialIds.forEach(materialID => {
      this.materialService.getMaterialById(materialID).subscribe(
        (material: any) => {
          this.materials[materialID] = material.materialName; // Lưu tên danh mục theo ID
        },
        error => {
          console.error(`Lỗi khi tải màu với ID ${materialID}:`, error);
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
  // Phương thức load danh mục từ API
  loadCategories(): void {
    this.categoryService.getAllCate().subscribe(data => {
      this.cate = data; 
    });
  }
    // Phương thức load danh mục từ API
    loadColors(): void {
      this.colorService.getAllColor().subscribe(data => {
        this.col = data; 
      });
    }
      // Phương thức load danh mục từ API
  loadMaterrials(): void {
    this.materialService.getAllMaterial().subscribe(data => {
      this.mate = data; 
    });
  }
  // Phương thức load danh mục từ API
  loadBrands(): void {
    this.brandService.getAllBrand().subscribe(data => {
      this.bra = data; 
    });
  }
  openEditModal(product: any): void {
    this.selectedProductId = product.productID;
    this.imageUrl = product.imageUrl; // Đặt URL hình ảnh từ sản phẩm
    this.editProductForm.patchValue(product);
  }
  //Mở form xóa
  openDeleteModal(id: number): void {
    this.idToDelete = id;
  }
  //hiển thị modal thêm sp thành công
  showADDAlert() {
    const successAlert = document.getElementById('success-alert');
    if (successAlert) {
      successAlert.style.display = 'block'; // Hiển thị alert
    
      // Tự động ẩn alert sau 3 giây
      setTimeout(() => {
        successAlert.style.display = 'none';
      }, 5000);
    }
    }
  //hiển thị modal sửa sp thành công
  showEditAlert() {
  const successAlert = document.getElementById('edit-alert');
  if (successAlert) {
    successAlert.style.display = 'block'; // Hiển thị alert

    // Tự động ẩn alert sau 3 giây
    setTimeout(() => {
      successAlert.style.display = 'none';
    }, 5000);
  }
  }
  ///hiển thị modal xóa sp thành công
  showDeleAlert() {
    const successAlert = document.getElementById('del-alert');
    if (successAlert) {
      successAlert.style.display = 'block'; // Hiển thị alert

      // Tự động ẩn alert sau 3 giây
      setTimeout(() => {
        successAlert.style.display = 'none';
      }, 3000);
    }
  }
  ///hiển thị modal lỗi sp 
  showErrAlert() {
    const successAlert = document.getElementById('err');
    if (successAlert) {
      successAlert.style.display = 'block'; // Hiển thị alert

      // Tự động ẩn alert sau 3 giây
      setTimeout(() => {
        successAlert.style.display = 'none';
      }, 3000);
    }
  }
  ///hiển thị modal lỗi sp 
  showErr_valid_Alert() {
    const successAlert = document.getElementById('err-valid');
    if (successAlert) {
      successAlert.style.display = 'block'; // Hiển thị alert

      // Tự động ẩn alert sau 3 giây
      setTimeout(() => {
        successAlert.style.display = 'none';
      }, 3000);
    }
  }
  ///hiển thị modal lỗi sp 
  showErr_data_Alert() {
    const successAlert = document.getElementById('err-data');
    if (successAlert) {
      successAlert.style.display = 'block'; // Hiển thị alert

      // Tự động ẩn alert sau 3 giây
      setTimeout(() => {
        successAlert.style.display = 'none';
      }, 3000);
    }
  }
  //xóa sản phẩm
  deleteProduct(id: number) {
    this.productService.deleteProduct(id).subscribe(
      response => {
        this.loadProductsInPage(this.currentPage);
        this.showDeleAlert(); // Hiện thông báo thành công
      },
      error => {
        this.loadProductsInPage(this.currentPage);
        console.error(error.error); // Ghi lại lỗi chi tiết
          // Kiểm tra nếu có thông điệp lỗi từ API
        if (error.error && error.error.message) {
            //this.errorMessage = error.error.message; // Hiển thị thông báo lỗi từ API
            
        } else {
          //this.showErrAlert(); ///dùng modal
          this.showDeleAlert();
        }
      }
    );
  }
  // Tìm kiếm sản phẩm
  searchProducts(name: string): void {
    this.productService.searchProducts(name).subscribe(
    (data: any) => {
      this.products = data;

    },
    error => {
      console.error('Lỗi khi tìm kiếm danh mục:', error);
    }
  );
  }
  // Reset form
  resetForm(form: any): void {
    form.reset();
    this.selectedProduct = null;
  }
  // Chọn sản phẩm để sửa
  selectProduct(product: Product): void {
    this.selectedProduct = product;
  }

  }
