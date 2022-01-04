import { Component, OnInit } from '@angular/core';
// import { Category } from 'src/app/models/category.interface';
import { BackEndService } from 'src/app/services/back-end.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css'],
  providers: [MessageService]
})
export class CategoriesComponent implements OnInit {

  categories: any[] = [];
  eCategory?: any;

  constructor(private backendService: BackEndService, private messageService: MessageService, private router: Router) {

    this.backendService.getAllCategories().subscribe(
      res => this.categories = res as Array<any>
    );
  }

  ngOnInit(): void {
  }

  edit(category: any) {
    this.backendService.setEditedCategory(category);
    this.router.navigate(['/admin/edit-category']);
  }

  showConfirm(category: any) {
    this.messageService.clear();
    this.messageService.add({ key: 'c', sticky: true, severity: 'warn', summary: 'Are you sure?', detail: 'You want to delete this category' });
    this.eCategory = category;
  }

  delete() {
    this.messageService.clear('c');

    this.backendService.deleteCategory(this.eCategory!.id).subscribe(
      res => {
        this.backendService.getAllCategories().subscribe(
          res => this.categories = res as Array<any>
        );
      },
    );
  }

  cancelDelete() {
    this.messageService.clear('c');
  }

}
