import { NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-register-user',
  standalone: true,
  imports: [NgFor,NgIf, ReactiveFormsModule,RouterModule],
  templateUrl: './register-user.component.html',
  styleUrl: './register-user.component.css'
})
export class RegisterUserComponent {
  users: User[] = [];

  userForm: FormGroup;

  errorMessage: string | null = null;


  Message: string | null = null;

  constructor(private fb: FormBuilder, private userService: UserService) {
    //CONSTRUCTOR THÊM 
    this.userForm = this.fb.group({
      username: ['', Validators.required], 
      phone: ['', Validators.required],
      email: ['', Validators.required],
      fullname: ['', Validators.required],
      password: ['', Validators.required],
      address: ['', Validators.required],
    });
   
  }
  ngOnInit(): void {

  }
  onSubmit(): void {
    if (this.userForm.valid) {
      this.userService.addUser(this.userForm.value).subscribe(
        (response: HttpResponse<any>) => {
          // Kiểm tra mã trạng thái phản hồi từ response
          if (response.status === 201) {
            // Thành công - Reset form và hiện thông báo
            this.userForm.reset(); 
            //alert('Đăng ký thành công!');
            this.Message = "Đăng ký thành công!";
            this.showAddAlert();
          }
        },
        (error) => {
          // Xử lý lỗi
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
