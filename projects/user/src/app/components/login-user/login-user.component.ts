import { CurrencyPipe, NgClass, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { loginService } from '../../services/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-user',
  standalone: true,
  imports: [NgFor,NgIf,ReactiveFormsModule,CurrencyPipe,RouterModule,NgClass],
  templateUrl: './login-user.component.html',
  styleUrl: './login-user.component.css'
})
export class LoginUserComponent implements OnInit {

  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private loginservice: loginService, private router: Router ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void {
  }

  showloginAlert() {
    const successAlert = document.getElementById('login-alert');
    if (successAlert) {
      successAlert.style.display = 'block'; // Hiển thị alert
  
      // Tự động ẩn alert sau 3 giây
      setTimeout(() => {
        successAlert.style.display = 'none';
      }, 30000);
    }
  }
  showloginAlertinvalid() {
    const successAlert = document.getElementById('login-alert-invalid');
    if (successAlert) {
      successAlert.style.display = 'block'; // Hiển thị alert
  
      // Tự động ẩn alert sau 3 giây
      setTimeout(() => {
        successAlert.style.display = 'none';
      }, 3000);
    }
  }
  showloginmiisssAlert() {
    const successAlert = document.getElementById('login-alert-miss');
    if (successAlert) {
      successAlert.style.display = 'block'; // Hiển thị alert
  
      // Tự động ẩn alert sau 3 giây
      setTimeout(() => {
        successAlert.style.display = 'none';
      }, 3000);
    }
  }
  onSubmit(): void {
    const self = this; // Lưu trữ ngữ cảnh của `this`
    if (this.loginForm.invalid) {
      self.showloginAlertinvalid();
      return;
    }
    this.loginservice.login(this.loginForm.value).subscribe(function(res: any) {
      if(res.status === "success"){
        //alert(res.message);
        sessionStorage.setItem('fullName', res.fullName);
        sessionStorage.setItem('userID', res.userID);
        sessionStorage.setItem('email', res.email);
        location.assign("/");
        
        self.showloginAlert();
        //self.router.navigate(['/']);
      }else{
        //alert("Tên đăng nhập hoặc mật khẩu không đúng!");
        self.showloginmiisssAlert();
      }
    });
  }

// Phương thức để xử lý khi chọn file ảnh
onFileSelected(event: any): void {
  console.log(event);
}

}


