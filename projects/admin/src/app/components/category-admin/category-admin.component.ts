import { Component, OnInit } from '@angular/core';
import { Category } from '../../models/category.model';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoryService } from '../../services/categogy.service';
import { NgFor, NgIf } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-category-admin',
  standalone: true,
  imports: [NgFor,NgIf, ReactiveFormsModule,RouterModule],
  templateUrl: './category-admin.component.html',
  styleUrl: './category-admin.component.css'
})
export class CategoryAdminComponent implements OnInit {
  cates: Category[] = [];

  editCategoryForm: FormGroup;

  categoryForm: FormGroup;

  selectedCategoryId: number | null = null;

  idToDelete: number | null = null;

  errorMessage: string | null = null;

  errorSuccess: string | null = null;

  constructor(private fb: FormBuilder, private categoryService: CategoryService) {
    //CONSTRUCTOR THÊM DANH MỤC
    this.categoryForm = this.fb.group({
      name: ['', Validators.required], //THÊM TÊN DANH MỤC
      description: ['', Validators.required] ///THÊM MÔ TẢ CHO DANH MỤC 
    });
    //CONSTRUCTOR SỬA DANH MỤC
    this.editCategoryForm = this.fb.group({
      categoryID: ['', Validators.required],
      name: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadAllCates(); // Gọi phương thức tải sản phẩm
    //this.loadCategories();
  }
  loadAllCates() {
    this.categoryService.getAllCate().subscribe(
      (data: any) => {
        this.cates = data;
      },
      error => {
        console.error('Lỗi khi tải sản phẩm:', error);
      }
    );
  }
  //form thêm danh mục
  onSubmit() {
    if (this.categoryForm.valid) {
      this.categoryService.addCategory(this.categoryForm.value).subscribe(
        response => {
          //alert('Thêm danh mục thành công!');
          // Reset form và tải lại danh mục
          this.loadAllCates();
          this.categoryForm.reset();
          this.showADDAlert();
        },
        error => {
          //alert('Có lỗi xảy ra khi thêm danh mục.');
          console.error(error);
          this.loadAllCates();
          this.showADDAlert();
        }
      );
    }
  }

// Mở modal để chỉnh sửa danh mục
openEditModal(cate: Category) {
this.editCategoryForm.patchValue({
  categoryID: cate.categoryID,
  name: cate.name,
  description: cate.description
});

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

//ẩn modal sửa
hideEditAlert() {
const successAlert = document.getElementById('editCategoryModal');
if (successAlert) {
  successAlert.style.display = 'block'; // Hiển thị alert
  // Tự động ẩn alert sau 3 giây
  setTimeout(() => {
    successAlert.style.display = '';
  }, 0);
}
}

// Phương thức xử lý khi submit form sửa
onEditSubmit() {
if (this.editCategoryForm.valid) {
  this.categoryService.updateCategory(this.editCategoryForm.value).subscribe(
    response => {
      this.loadAllCates(); // Tải lại danh sách danh mục sau khi cập nhật
      this.showEditAlert();
      //this.hideEditAlert();
    },
    error => {
      //console.error('Error updating category:', error); // Log lỗi
      //console.error(error);
      this.loadAllCates();
      this.showEditAlert();
      //this.hideEditAlert();
    }
  );
}
}

openConfirmDeleteModal(id: number) {
this.idToDelete = id; // Lưu id danh mục cần xóa
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
// Xóa danh mục
deleteCategory(id: number) {
  this.categoryService.deleteCategory(id).subscribe(
    response => {
      this.loadAllCates();
      //this.errorSuccess = response.message;// Lấy thông điệp từ phản hồi JSON
      this.showDeleAlert(); // Hiện thông báo thành công
    },
    error => {
      this.loadAllCates();
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
searchCategories(name: string): void {
this.categoryService.searchCategoryByName(name).subscribe(
  (data: any) => {
    this.cates = data;
  },
  error => {
    console.error('Lỗi khi tìm kiếm danh mục:', error);
  }
);
}


}
