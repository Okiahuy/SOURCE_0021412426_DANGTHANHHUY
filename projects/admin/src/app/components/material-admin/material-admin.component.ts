import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Material } from '../../models/material.model';
import { NgFor, NgIf } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialService } from '../../services/material.service';

@Component({
  selector: 'app-material-admin',
  standalone: true,
  imports: [NgFor,NgIf, ReactiveFormsModule,RouterModule],
  templateUrl: './material-admin.component.html',
  styleUrl: './material-admin.component.css'
})
export class MaterialAdminComponent implements OnInit{
  materials: Material[] = [];

  editMaterialForm: FormGroup;

  materialForm: FormGroup;

  selectedMaterialId: number | null = null;

  idToDelete: number | null = null;

  constructor(private fb: FormBuilder, private materialService: MaterialService) {
    //CONSTRUCTOR THÊM DANH MỤC
    this.materialForm = this.fb.group({
      materialName: ['', Validators.required], //THÊM TÊN 
      size: ['', Validators.required]
    });
    //CONSTRUCTOR SỬA DANH MỤC
    this.editMaterialForm = this.fb.group({
      materialID: ['', Validators.required],
      materialName: ['', Validators.required],
      size: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadAllMaterial(); // Gọi phương thức tải sản phẩm
    //this.loadCategories();
  }
  loadAllMaterial() {
    this.materialService.getAllMaterial().subscribe(
      (data: any) => {
        this.materials = data;
      },
      error => {
        console.error('Lỗi khi tải sản phẩm:', error);
      }
    );
  }
  //form thêm danh mục
  onSubmit() {
    if (this.materialForm.valid) {
      this.materialService.addMaterial(this.materialForm.value).subscribe(
        response => {
          //alert('Thêm danh mục thành công!');
          // Reset form và tải lại danh mục
          this.loadAllMaterial();
          this.materialForm.reset();
          this.showADDAlert();
        },
        error => {
          //alert('Có lỗi xảy ra khi thêm danh mục.');
          console.error(error);
          this.loadAllMaterial();
          this.showADDAlert();
        }
      );
    }
  }

// Mở modal để chỉnh sửa danh mục
openEditModal(material: Material) {
this.editMaterialForm.patchValue({
  materialID: material.materialID,
  materialName: material.materialName,
  size: material.size
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
if (this.editMaterialForm.valid) {
  this.materialService.updateMaterial(this.editMaterialForm.value).subscribe(
    response => {
      this.loadAllMaterial(); // Tải lại danh sách danh mục sau khi cập nhật
      this.showEditAlert();
      //this.hideEditAlert();
    },
    error => {
      //console.error('Error updating category:', error); // Log lỗi
      //console.error(error);
      this.loadAllMaterial();
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
deleteMaterial(id: number) {
  this.materialService.deleteMaterial(id).subscribe(
    response => {
      this.loadAllMaterial();
      //this.errorSuccess = response.message;// Lấy thông điệp từ phản hồi JSON
      this.showDeleAlert(); // Hiện thông báo thành công
    },
    error => {
      this.loadAllMaterial();
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
searchMaterials(name: string): void {
this.materialService.searchMaterialByName(name).subscribe(
  (data: any) => {
    this.materials = data;
  },
  error => {
    console.error('Lỗi khi tìm kiếm danh mục:', error);
  }
);
}


}
