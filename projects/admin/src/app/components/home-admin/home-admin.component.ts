import { CurrencyPipe, NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HomeService } from '../../services/home.service';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);
@Component({
  selector: 'app-home-admin',
  standalone: true,
  imports: [NgFor,RouterModule,CurrencyPipe,],
  templateUrl: './home-admin.component.html',
  styleUrl: './home-admin.component.css'
})
export class HomeAdminComponent implements OnInit{
  totalProductCount: number = 0;
  totalOrderPrice: number = 0;
  totalUsers: number = 0;

  constructor(private dashboardService: HomeService) {}

  ngOnInit(): void {
    this.loadSummary();
    this.renderChart();
  }


  renderChart() {
    const ctx = document.getElementById('myChart') as HTMLCanvasElement;

    // Tạo biểu đồ
    new Chart(ctx, {
      type: 'bar', // Loại biểu đồ (có thể là 'line', 'pie', v.v.)
      data: {
        labels: ['Khách Hàng', 'Doanh Thu', 'Lượt Thích', 'Câu Hỏi'], // Nhãn trên trục X
        datasets: [
          {
            label: 'Số liệu', // Nhãn cho dataset
            data: [this.totalUsers, this.totalOrderPrice, this.totalProductCount, 10], // Dữ liệu biểu đồ
            backgroundColor: [
              'rgba(75, 192, 192, 0.2)', // Màu nền cho cột 1
              'rgba(255, 206, 86, 0.2)',  // Màu nền cho cột 2
              'rgba(153, 102, 255, 0.2)', // Màu nền cho cột 3
              'rgba(255, 99, 132, 0.2)',  // Màu nền cho cột 4
            ],
            borderColor: [
              'rgba(75, 192, 192, 1)', // Màu viền cho cột 1
              'rgba(255, 206, 86, 1)',  // Màu viền cho cột 2
              'rgba(153, 102, 255, 1)', // Màu viền cho cột 3
              'rgba(255, 99, 132, 1)',  // Màu viền cho cột 4
            ],
            borderWidth: 1, // Độ dày viền
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true, // Bắt đầu trục Y từ 0
          },
        },
      },
    });
  }

  // Phương thức để lấy dữ liệu tổng hợp
  loadSummary(): void {
    this.dashboardService.getSummary().subscribe(
      (data) => {
        this.totalProductCount = data.totalProductCount;
        this.totalOrderPrice = data.totalOrderPrice;
        this.totalUsers = data.totalUsers;
      },
      (error) => {
        console.error('Lỗi khi lấy dữ liệu tổng hợp:', error);
      }
    );
  }
}
