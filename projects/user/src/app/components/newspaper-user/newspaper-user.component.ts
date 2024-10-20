import { Component, OnInit } from '@angular/core';
import { NewspaperService } from '../../services/newspaper.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { CurrencyPipe, NgFor, NgIf } from '@angular/common';


@Component({
  selector: 'app-newspaper-user',
  standalone: true,
  imports: [NgFor,NgIf,ReactiveFormsModule,CurrencyPipe,RouterModule],
  templateUrl: './newspaper-user.component.html',
  styleUrl: './newspaper-user.component.css'
})
export class NewspaperUserComponent implements OnInit{

  totalPages: number = 0;
  currentPage: number = 1;
  pageSize: number = 1;

  news: any[] = [];

  news2: any[] = [];

  constructor(private fb: FormBuilder,
    private newService: NewspaperService,
    private route: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer
  ) {
    
  }

  ngOnInit(): void {
    this.loadNewsInPage(this.currentPage); // Gọi phương thức tải sản phẩm
    this.loadNews(); 
  }

  loadNewsInPage(page: number): void {
    this.newService.getNewspapersInPage(page - 1, this.pageSize).subscribe(data => {
      this.news = data.content;
      this.totalPages = data.totalPages;
     
    });
  }
  loadNews(): void {
    this.newService.getAllNewspapers().subscribe(data => {
      this.news2 = data;
    });
  }
  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadNewsInPage(page);
    }
  }


}
