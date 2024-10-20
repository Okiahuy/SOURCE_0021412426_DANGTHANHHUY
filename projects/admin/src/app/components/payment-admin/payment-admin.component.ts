import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Payment } from '../../models/payment.model';
import { PaymentService } from '../../services/payment.service';

@Component({
  selector: 'app-payment-admin',
  standalone: true,
  imports: [NgFor,NgIf, ReactiveFormsModule,RouterModule],
  templateUrl: './payment-admin.component.html',
  styleUrl: './payment-admin.component.css'
})
export class PaymentAdminComponent  implements OnInit {
  payments: Payment[] = [];

  editCategoryForm: FormGroup;

  categoryForm: FormGroup;

  selectedCategoryId: number | null = null;

  idToDelete: number | null = null;

  constructor(private fb: FormBuilder, private paymentService: PaymentService) {
    //CONSTRUCTOR THÊM DANH MỤC
    this.categoryForm = this.fb.group({
      paymentName: ['', Validators.required], //THÊM TÊN DANH MỤC
      
    });
    //CONSTRUCTOR SỬA DANH MỤC
    this.editCategoryForm = this.fb.group({
      paymentID: ['', Validators.required],
      paymentName: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadAllCates(); // Gọi phương thức tải sản phẩm
    //this.loadCategories();
  }
  loadAllCates() {
    this.paymentService.getAllBrand().subscribe(
      (data: any) => {
        this.payments = data;
      },
      error => {
        console.error('Lỗi khi tải sản phẩm:', error);
      }
    );
  }
  //form thêm danh mục
  onSubmit() {
    if (this.categoryForm.valid) {
      this.paymentService.addPayment(this.categoryForm.value).subscribe(
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
openEditModal(cate: Payment) {
this.editCategoryForm.patchValue({
  paymentID: cate.paymentID,
  paymentName: cate.paymentName,
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
  this.paymentService.updatePayment(this.editCategoryForm.value).subscribe(
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
  this.paymentService.deletePayment(id).subscribe(
    response => {
      this.loadAllCates();
      this.showDeleAlert(); // Hiện thông báo thành công
    },
    error => {
      this.loadAllCates();
      console.error(error.error); // Ghi lại lỗi chi tiết
        // Kiểm tra nếu có thông điệp lỗi từ API
        if (error.error && error.error.message) {
          //this.errorMessage = error.error.message; // Hiển thị thông báo lỗi từ API
          this.showErrAlert(); ///dùng modal
      }
     
    }
  );

}



}

