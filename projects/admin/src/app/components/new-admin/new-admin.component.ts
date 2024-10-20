import { CurrencyPipe, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { NewspaperService } from '../../services/newspaper.service';
import { Newspaper } from '../../models/newspaper.model';
import { Router } from '@angular/router'; 
import { DomSanitizer } from '@angular/platform-browser';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-new-admin',
  standalone: true,
  imports: [NgFor,NgIf,ReactiveFormsModule,CurrencyPipe,RouterModule],
  templateUrl: './new-admin.component.html',
  styleUrl: './new-admin.component.css'
})
export class NewAdminComponent implements OnInit {

  newspapers: any[] = [];

  selectedNewspaper: Newspaper | null = null;
  selectedNewspaperId: number = 0 ;
  newspaperForm: FormGroup;
  editNewspaperForm: FormGroup;

  idToDelete: number | null = null;

  imageUrl: string | null = null; // Biến để lưu tên tệp hình ảnh

  selectedFile: File | null = null;
  existingImageUrl: string | null = null;

  constructor(private fb: FormBuilder,
    private newspaperService: NewspaperService,
    private route: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer
  ) {
    /////////////////////////////////////////////////////////////////////////////////////////
    // Tạo form thêm sản phẩm
    this.newspaperForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      imageUrl: [null] // Trường này sẽ được cập nhật khi chọn hình ảnh
    });
    /////////////////////////////////////////////////////////////////////////////////////////

  // Khởi tạo form sửa sản phẩm
  this.editNewspaperForm = this.fb.group({
    title: ['', Validators.required],
    description: ['',Validators.required],
    imageUrl: [null]
  });
  }


/////////////////////////////////////////////////////////////////////////////
onFileSelected(event: any): void {
  console.log(event);
  const file = event.target.files[0];
  if (file) {
    this.newspaperForm.patchValue({
      imageUrl: file // Lưu file vào form
    });
  }
}
addNewspaper(): void {
  if (this.newspaperForm.valid) {
    const formData = this.prepareFormData(this.newspaperForm.value);
    
    this.newspaperService.addNewspaper(formData).subscribe({
      next: (response: any) => {
        // Kiểm tra mã trạng thái phản hồi từ res
        if (response.status === 201) {
          // Thành công - Reset form và tải lại sản phẩm
          this.newspaperForm.reset(); 
          this.loadAllNewspapers();
          this.showADDAlert();
        } else if (response.status === 400) {
          // Xử lý lỗi dữ liệu không hợp lệ
          this.showErr_valid_Alert();
        } else if (response.status === 409) {
          // Xử lý lỗi tên sản phẩm đã tồn tại
          this.showErrAlert();
        }
      },
      error: (err) => {
        console.error('Đã có lỗi xảy ra:', err);
        // Xử lý các lỗi chung hoặc tùy chỉnh thông báo cho người dùng
        this.loadAllNewspapers();
        if (err.error && err.error.message) {
          // Hiển thị thông điệp lỗi từ API
          alert(err.error.message);
        } else {
          this.showADDAlert();
          this.loadAllNewspapers();
        }
      }
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
    'title',
    this.editNewspaperForm.get('title')?.value
  );
  formData.append(
    'description',
    this.editNewspaperForm.get('description')?.value
  );

  // Nếu người dùng có chọn ảnh mới, thêm file vào FormData
  if (this.selectedFile) {
    formData.append('imageUrl', this.selectedFile);
  }

  return formData;
}

// Phương thức sửa sản phẩm
updateNewspaper(): void {
  const formData = this.prepareFormData_update();

  this.newspaperService.updateNewspaper(this.selectedNewspaperId, formData).subscribe(
    (response: any) => {
      if (response.status === 200) {
          this.editNewspaperForm.reset();
          this.loadAllNewspapers();
          this.showEditAlert();
      } else if (response.status === 400) {
        this.showErr_data_Alert();
      }
    },
    (error) => {
      this.showEditAlert();
      this.loadAllNewspapers();
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
  this.loadAllNewspapers();
}
loadAllNewspapers() {
  this.newspaperService.getAllNewspapers().subscribe(
    (data: any) => {
      this.newspapers = data;
    },
    error => {
      console.error('Lỗi khi tải sản phẩm:', error);
    }
  );
}
openEditModal(newspaper: any): void {
  this.selectedNewspaperId = newspaper.id;
  this.imageUrl = newspaper.imageUrl; // Đặt URL hình ảnh từ sản phẩm
  this.editNewspaperForm.patchValue(newspaper);
}
//Mở form xóa
openDeleteModal(id: number): void {
  if (id && typeof id === 'number') {
    this.idToDelete = id;
  } else {
    console.error('ID không hợp lệ:', id);
    // Bạn có thể hiển thị thông báo lỗi hoặc xử lý logic khác ở đây
  }
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
  const successAlert = document.getElementById('err-already');
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
// Xóa sản phẩm
deleteNewspaper(id: number) {
  this.newspaperService.deleteNewspaper(id).subscribe(
    response => {
      // Nếu xóa thành công, tải lại danh sách báo
      this.loadAllNewspapers();
      this.showDeleAlert(); // Hiển thị thông báo thành công
    },
    error => {
      // Tải lại danh sách báo trong cả hai trường hợp (có thể kiểm tra xem có cần thiết không)
      this.loadAllNewspapers();
      console.error(error.error); // Ghi lại chi tiết lỗi trong console
      this.showDeleAlert();
      // Kiểm tra nếu có thông điệp lỗi từ API
      if (error.error && error.error.message) {
        console.error('Lỗi từ API:', error.error.message);
        // Hiển thị thông báo lỗi nếu cần, ví dụ dùng modal
        this.showErrAlert(); // Hiển thị lỗi chi tiết qua modal
      } else {
        // Nếu không có thông điệp lỗi từ API, vẫn hiển thị thông báo xóa thành công
        this.showDeleAlert();
      }
    }
  );
}

// Tìm kiếm sản phẩm
// Reset form
resetForm(form: any): void {
  form.reset();
  this.selectedNewspaper= null;
}
// Chọn sản phẩm để sửa
selectProduct(product: Newspaper): void {
  this.selectedNewspaper = product;
}

}
