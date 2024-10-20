import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { NgFor, NgIf } from '@angular/common';


@Component({
  selector: 'app-update-user-custom',
  standalone: true,
  imports: [ReactiveFormsModule,NgFor,NgIf],
  templateUrl: './update-user-custom.component.html',
  styleUrl: './update-user-custom.component.css'
})
export class UpdateUserCustomComponent {
  
  userForm: FormGroup;

  userID!: number;

  errorMessage: string | null = null;


  Message: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private userService: UserService, // Service để gọi API
    private router: Router,
  ) {
    // Tạo form với FormBuilder
    this.userForm = this.fb.group({
      email: [''],
      phone: [''],
      address: [''],
      fullname: ['']
      // Các trường khác
    });
  }

  ngOnInit(): void {
    this.userID = Number(this.route.snapshot.paramMap.get('userID')); // Lấy ID từ URL
    // Gọi API để lấy thông tin người dùng theo userID
    this.userService.getUserById(Number(this.userID)).subscribe((userData) => {
      // Set giá trị vào form
      this.userForm.patchValue({
        address: userData.address,
        email: userData.email,
        phone: userData.phone,
        fullname: userData.fullname,
        
      });
    });
  }
  // Hàm submit form để lưu lại thông tin sau khi chỉnh sửa
  onSubmit() {
    if (this.userForm.valid) {
      this.userService.updateUser(this.userID, this.userForm.value).subscribe(
        // Xử lý sau khi cập nhật thành công
        data => {
          alert("Cập nhật thông tin thành công");
          this.router.navigate(['/user/my']);
        },
        error => {
          console.error('Error fetching product details:', error);
          this.errorMessage = error.error.message;
          this.showErrAlert();
        }
      );
      
    }
  }

  showErrAlert() {
    const successAlert = document.getElementById('t');
    if (successAlert) {
      successAlert.style.display = 'block'; // Hiển thị alert
    
      // Tự động ẩn alert sau 3 giây
      setTimeout(() => {
        successAlert.style.display = 'none';
      }, 3000);
    }
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
}
