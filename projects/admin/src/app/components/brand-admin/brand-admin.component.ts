import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Brand } from '../../models/brand.models';
import { BrandService } from '../../services/brand.service';
import { error } from 'console';

@Component({
  selector: 'app-brand-admin',
  standalone: true,
  imports: [NgFor,NgIf, ReactiveFormsModule,RouterModule],
  templateUrl: './brand-admin.component.html',
  styleUrl: './brand-admin.component.css'
})
export class BrandAdminComponent implements OnInit{
  brands: Brand[] = [];

  editBrandForm: FormGroup;

  brandForm: FormGroup;

  selectedCategoryId: number | null = null;

  idToDelete: number | null = null;

  errorMessage: string | null = null;

  errorSuccess: string | null = null;


  constructor(private fb: FormBuilder, private brandService: BrandService) {
    //CONSTRUCTOR THÊM 
    this.brandForm = this.fb.group({
      name: ['', Validators.required], 
      description: ['', Validators.required],
    });
    //CONSTRUCTOR SỬA 
    this.editBrandForm = this.fb.group({
      brandID: ['', Validators.required],
      name: ['', Validators.required],
      description: ['', Validators.required],
    });
  }
  ngOnInit(): void {
    this.loadAllBrands(); 
  }

  loadAllBrands() {
    this.brandService.getAllBrand().subscribe(
      (data: any) => {
        this.brands = data;
      },
      error => {
        console.error('Lỗi khi tải sản phẩm:', error);
      }
    );
  }
  openEditModal(cate: Brand) {
    this.editBrandForm.patchValue({
      brandID: cate.brandID,
      name: cate.name,
      description: cate.description
    });
    
    }
  //form thêm danh mục
  onSubmit() {
    if (this.brandForm.valid) {
      this.brandService.addBrand(this.brandForm.value).subscribe(
        response => {
          //alert('Thêm danh mục thành công!');
          // Reset form và tải lại danh mục
          this.loadAllBrands();
          this.brandForm.reset();
          this.showADDAlert();
        },
        error => {
          //alert('Có lỗi xảy ra khi thêm danh mục.');
          console.error(error);
          this.loadAllBrands();
          this.showADDAlert();
        }
      );
    }
  }
//hiển thị modal thêm danh mục thành công
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
///hiển thị modal xóa danh mục thành công
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
  ///hiển thị modal lỗi danh mục 
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

  //hiển thị modal sửa danh mục thành công
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
// Phương thức xử lý khi submit form sửa
onEditSubmit() {
  if (this.editBrandForm.valid) {
    this.brandService.updateBrand(this.editBrandForm.value).subscribe(
      response => {
        this.loadAllBrands(); // Tải lại danh sách danh mục sau khi cập nhật
        this.showEditAlert();
        //this.hideEditAlert();
      },
      error => {
        //console.error('Error updating category:', error); // Log lỗi
        //console.error(error);
        this.loadAllBrands();
        this.showEditAlert();
        //this.hideEditAlert();
      }
    );
  }
  }
  
  openConfirmDeleteModal(id: number) {
  this.idToDelete = id; // Lưu id danh mục cần xóa
  }
  // Xóa danh mục
  deleteBrand(id: number) {
  this.brandService.deleteBrand(id).subscribe(
    response => {
      this.loadAllBrands();
      this.showDeleAlert(); // Hiện thông báo thành công
    },
    error => {
      this.loadAllBrands();
      console.error(error.error); // Ghi lại lỗi chi tiết
        // Kiểm tra nếu có thông điệp lỗi từ API
        if (error.error && error.error.message) {
          //this.errorMessage = error.error.message; // Hiển thị thông báo lỗi từ API
          this.showErrAlert(); ///dùng modal
      } else {
          this.errorMessage = "Có lỗi xảy ra. Vui lòng thử lại."; // Thông báo lỗi mặc định
      }
      //this.showDeleAlert(); // Hiện thông báo lỗi
    }
  );

}

// Tìm kiếm danh mục theo tên
searchBrands(name: string) {
this.brandService.searchBrandByName(name).subscribe(
  (data: any) => {
    this.brands = data;
  },
  error => {
    console.error('Lỗi khi tìm kiếm danh mục:', error);
  }
);
}
}


