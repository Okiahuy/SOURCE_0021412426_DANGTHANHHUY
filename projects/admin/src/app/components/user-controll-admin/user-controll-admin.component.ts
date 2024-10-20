import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service'; 

@Component({
  selector: 'app-user-controll-admin',
  standalone: true,
  imports: [NgFor,NgIf, ReactiveFormsModule,RouterModule],
  templateUrl: './user-controll-admin.component.html',
  styleUrl: './user-controll-admin.component.css'
})
export class UserControllAdminComponent implements OnInit {

  userlists: User[] = [];

  constructor(private userService: UserService) {

  }

  ngOnInit(): void {
    this.loadAllusers(); // Gọi phương thức tải sản phẩm
  }
  loadAllusers() {
    this.userService.getAllUsers().subscribe(
      (data: any) => {
        this.userlists = data;
      },
      error => {
        console.error('Lỗi khi tải sản phẩm:', error);
      }
    );
  }
}


