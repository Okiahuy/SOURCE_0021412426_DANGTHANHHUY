import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Color } from '../../models/color.model';
import { ColorService } from '../../services/color.service';

@Component({
  selector: 'app-color-admin',
  standalone: true,
  imports: [NgFor,NgIf, ReactiveFormsModule,RouterModule],
  templateUrl: './color-admin.component.html',
  styleUrl: './color-admin.component.css'
})
export class ColorAdminComponent implements OnInit{
  colors: Color[] = [];

  editColorForm: FormGroup;

  colorForm: FormGroup;

  selectedColorId: number | null = null;

  idToDelete: number | null = null;

  constructor(private fb: FormBuilder, private colorService: ColorService) {
    //CONSTRUCTOR THÊM DANH MỤC
    this.colorForm = this.fb.group({
      colorName: ['', Validators.required], //THÊM TÊN 
      
    });
    //CONSTRUCTOR SỬA DANH MỤC
    this.editColorForm = this.fb.group({
      colorID: ['', Validators.required],
      colorName: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadAllColors(); // Gọi phương thức tải sản phẩm
    //this.loadCategories();
  }
  loadAllColors() {
    this.colorService.getAllColor().subscribe(
      (data: any) => {
        this.colors = data;
      },
      error => {
        console.error('Lỗi khi tải sản phẩm:', error);
      }
    );
  }
  //form thêm danh mục
  onSubmit() {
    if (this.colorForm.valid) {
      this.colorService.addColor(this.colorForm.value).subscribe(
        response => {
          //alert('Thêm danh mục thành công!');
          // Reset form và tải lại danh mục
          this.loadAllColors();
          this.colorForm.reset();
          this.showADDAlert();
        },
        error => {
          //alert('Có lỗi xảy ra khi thêm danh mục.');
          console.error(error);
          this.loadAllColors();
          this.showADDAlert();
        }
      );
    }
  }

// Mở modal để chỉnh sửa danh mục
openEditModal(color: Color) {
this.editColorForm.patchValue({
  colorID: color.colorID,
  colorName: color.colorName
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
if (this.editColorForm.valid) {
  this.colorService.updateColor(this.editColorForm.value).subscribe(
    response => {
      this.loadAllColors(); // Tải lại danh sách danh mục sau khi cập nhật
      this.showEditAlert();
      //this.hideEditAlert();
    },
    error => {
      //console.error('Error updating category:', error); // Log lỗi
      //console.error(error);
      this.loadAllColors();
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
deleteColor(id: number) {
  this.colorService.deleteColor(id).subscribe(
    response => {
      this.loadAllColors();
      //this.errorSuccess = response.message;// Lấy thông điệp từ phản hồi JSON
      this.showDeleAlert(); // Hiện thông báo thành công
    },
    error => {
      this.loadAllColors();
      console.error(error.error); // Ghi lại lỗi chi tiết
        // Kiểm tra nếu có thông điệp lỗi từ API
        if (error.error && error.error.message) {
          //this.errorMessage = error.error.message; // Hiển thị thông báo lỗi từ API
          this.showErrAlert(); ///dùng modal
      } else {
        
      }
      //this.showDeleAlert(); // Hiện thông báo lỗi
    }
  );

}

// Tìm kiếm danh mục theo tên
searchColors(name: string): void {
this.colorService.searchColorByName(name).subscribe(
  (data: any) => {
    this.colors = data;
  },
  error => {
    console.error('Lỗi khi tìm kiếm danh mục:', error);
  }
);
}


}
